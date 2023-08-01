import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { TicketAvailibilityType, TicketDetailsType } from "@/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        bookingStatus: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            bookingDetails: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: "Success",
      message: "Bookings found",
      booking: bookings,
    }, {
      status: 200,
    });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({
        status: "Failed",
        message: "Error occurred",
        error: e.message,
      }, { status: 500 });
    }
  }
}

export async function POST(
  request: Request,
) {
  let booking: TicketDetailsType = await request.json();
  const availabilityReturnObj: TicketAvailibilityType[] = [];
  let validToBook: boolean = true;
  const xenditAuthToken = Buffer.from(`${process.env.XENDIT_API_KEY}:`)
    .toString(
      "base64",
    );

  function generateBookingCode(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingCode = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      bookingCode += characters[randomIndex];
    }
    return bookingCode;
  }

  try {
    // ** 1 Validate ticket availability
    const bookedTicketsData = await prisma.bookingDetails.groupBy({
      by: ["masterTicketId"],
      _sum: {
        quantity: true,
      },
    }).then((res) => {
      if (res.length === 0) {
        return booking.details.map((e) => {
          return {
            masterTicketId: e.ticketId,
            totalBooking: 0,
          };
        });
      } else {
        return res.map((e) => {
          return {
            masterTicketId: e.masterTicketId,
            totalBooking: e._sum.quantity != null ? e._sum.quantity : 0,
          };
        });
      }
    });

    const masterTicketsData = await prisma.ticket.findMany({
      where: {
        OR: booking.details.map((e) => {
          return { id: { equals: e.ticketId } };
        }),
      },
    });

    for (let i = 0; i < bookedTicketsData.length; i++) {
      const masterTicket = masterTicketsData.find((e) =>
        e.id === bookedTicketsData[i].masterTicketId
      );
      const userTicketBookingQty = booking.details.find((e) =>
        e.ticketId === bookedTicketsData[i].masterTicketId
      );

      if (
        bookedTicketsData[i].totalBooking + userTicketBookingQty!.quantity >
          masterTicket!.quantity || masterTicket!.quantity === 0
      ) {
        availabilityReturnObj.push({
          ticketId: masterTicket!.id,
          available: false,
        });
        validToBook = false;
      } else {
        availabilityReturnObj.push({
          ticketId: masterTicket!.id,
          available: true,
        });
      }
    }

    if (!validToBook) {
      return NextResponse.json({
        status: "Failed to Book",
        message: "Limit to some ticket reached",
        data: availabilityReturnObj,
      }, { status: 200 });
    }

    // ** 2 Create Booking
    booking.details = booking.details.map((e) => {
      let masterTicket = masterTicketsData.find((v) => v.id === e.ticketId);

      return {
        ticketId: e.ticketId,
        name: masterTicket!.name,
        type: masterTicket!.type,
        price: e.quantity * masterTicket!.price,
        quantity: e.quantity,
      };
    });

    // ** 3 Create Booking & Details
    const newBooking = await prisma.booking.create({
      data: {
        bookingStatus: "Pending",
        generatedBookingCode: generateBookingCode(10),
        bookingDetails: {
          create: booking.details.map((e) => {
            return {
              masterTicketId: e.ticketId,
              quantity: e.quantity,
              price: e.price,
            };
          }),
        },
        user: {
          create: {
            firstName: booking.user.firstName,
            lastName: booking.user.lastName,
            email: booking.user.email,
            mobileNumber: booking.user.mobileNumber,
          },
        },
      },
    });

    // ** 4 Create xenditInvoice

    const { data } = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id: newBooking.id,
        bookingCode: newBooking.generatedBookingCode,
        amount: booking.details.map((e) => e.price * e.quantity),
        currency: "IDR",
        customer: {
          given_names: booking.user.firstName,
          surname: booking.user.lastName,
          email: booking.user.email,
          mobile_number: booking.user.mobileNumber,
        },
        customer_notification_preference: {
          invoice_paid: ["email", "whatsapp"],
        },
        success_redirect_url: "example.com/success",
        failure_redirect_url: "example.com/failure",
        items: booking.details.map((e) => {
          return {
            name: e.name,
            type: e.type,
            quantity: e.quantity,
            price: e.price,
          };
        }),
      },
      {
        headers: {
          "Authorization": `Basic ${xenditAuthToken}`,
        },
      },
    );

    const {
      external_id: xenditInvoiceId,
      invoice_url: xenditInvoiceUrl,
      expiry_date: xenditExpiryDate,
      amount: xenditInvoiceAmount,
    } = data;

    // ** 5 Create Payment
    await prisma.payment.create({
      data: {
        amount: xenditInvoiceAmount,
        bookingId: newBooking.id,
        xenditInvoiceId: xenditInvoiceId,
        status: "Pending",
        paymentTime: xenditExpiryDate,
        xenditInvoiceUrl: xenditInvoiceUrl,
      },
    });

    return NextResponse.json(
      {
        status: "Success",
        message: "Booking successfuly created",
        booking: { ...newBooking, invoiceUrl: xenditInvoiceUrl },
      },
      {
        status: 201,
      },
    );
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({
        status: "Failed to Book",
        message: "Error occurred",
        error: e.message,
      }, { status: 500 });
    }
  }
}
