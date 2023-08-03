import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { TicketAvailibilityType, TicketDetailsType } from "@/interfaces";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import BookingTemplate from "@/emails-utils/BookingTemplate";

import axios from "axios";
const prisma = new PrismaClient();

interface EmailPayloatInterface {
  to: string;
  subject: string;
  html?: string;
  bookingId: string;
  firstName: string;
  bookingLink: string;
}

const sendEmail = async (data: EmailPayloatInterface) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  return await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    ...data,
    html: render(
      BookingTemplate({
        firstName: data.firstName,
        bookingId: data.bookingId,
        bookingLink: data.bookingLink,
      }),
    ),
    // attachments: [{
    //   filename: "Document",
    //   path: data.attachmentLink,
    //   contentType: "application/pdf",
    // }],
  });
};

export async function GET(request: Request) {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        bookingStatus: true,
        generatedBookingCode: true,
        user: true,
        payment: true,
        bookingDetails: true,
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
    // const bookedTicketsData = await prisma.bookingDetails.groupBy({
    //   by: ["masterTicketId"],
    //   _sum: {
    //     quantity: true,
    //   },
    //   where: {
    //     AND: [
    //       { itemStatus: "PAID" },
    //       { itemStatus: "PENDING" },
    //     ],
    //   },
    // }).then((res) => {
    //   if (res.length === 0) {
    //     return booking.details.map((e) => {
    //       return {
    //         masterTicketId: e.ticketId,
    //         totalBooking: 0,
    //       };
    //     });
    //   } else {
    //     return res.map((e) => {
    //       return {
    //         masterTicketId: e.masterTicketId,
    //         totalBooking: e._sum.quantity != null ? e._sum.quantity : 0,
    //       };
    //     });
    //   }
    // });

    const masterTicketsData = await prisma.ticket.findMany({
      where: {
        OR: booking.details.map((e) => {
          return { id: { equals: e.ticketId } };
        }),
      },
    });

    // for (let i = 0; i < bookedTicketsData.length; i++) {
    //   const masterTicket = masterTicketsData.find((e) =>
    //     e.id === bookedTicketsData[i].masterTicketId
    //   );
    //   const userTicketBookingQty = booking.details.find((e) =>
    //     e.ticketId === bookedTicketsData[i].masterTicketId
    //   );

    //   if (
    //     bookedTicketsData[i].totalBooking + userTicketBookingQty!.quantity >
    //       masterTicket!.quantity || masterTicket!.quantity === 0
    //   ) {
    //     availabilityReturnObj.push({
    //       ticketId: masterTicket!.id,
    //       available: false,
    //     });
    //     validToBook = false;
    //   } else {
    //     availabilityReturnObj.push({
    //       ticketId: masterTicket!.id,
    //       available: true,
    //     });
    //   }
    // }

    // if (!validToBook) {
    //   return NextResponse.json({
    //     status: "Failed to Book",
    //     message: "Limit to some ticket reached",
    //     data: availabilityReturnObj,
    //   }, { status: 200 });
    // }

    // ** 2 Create Booking
    booking.details = booking.details.map((e) => {
      let masterTicket = masterTicketsData.find((v) => v.id === e.ticketId);

      return {
        ticketId: e.ticketId,
        name: masterTicket!.name,
        type: masterTicket!.type,
        price: masterTicket!.price,
        quantity: e.quantity,
      };
    });

    // ** 3 Create Booking & Details
    const newBooking = await prisma.booking.create({
      data: {
        bookingStatus: "PENDING",
        generatedBookingCode: generateBookingCode(10),
        bookingDetails: {
          create: booking.details.map((e) => {
            return {
              masterTicketId: e.ticketId,
              quantity: e.quantity,
              price: e.price,
              itemStatus: "PENDING",
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
        amount: booking.details.map((e) => e.price * e.quantity).reduce(
          (a, b) => a + b,
          0,
        ),
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
        success_redirect_url: `${process.env.PROJECT_HOST}`,
        failure_redirect_url: `${process.env.PROJECT_HOST}`,
        items: booking.details.map((e) => {
          return {
            name: e.name,
            type: e.type,
            quantity: e.quantity,
            price: e.price,
          };
        }),
        // fees: [
        //   {
        //     type: "Admin Fee",
        //     value: (10 / 100) *
        //       booking.details.map((e) => e.price * e.quantity).reduce(
        //         (a, b) => a + b,
        //         0,
        //       ),
        //   },
        // ],
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
        status: "PENDING",
        paymentTime: xenditExpiryDate,
        xenditInvoiceUrl: xenditInvoiceUrl,
      },
    });

    // ** 6 Send Confirm Payment Email
    await sendEmail({
      to: booking.user.email,
      subject: "Konfirmasi Pembayaran Gadjah Fest 2023",
      bookingId: newBooking.generatedBookingCode,
      firstName: booking.user.firstName,
      bookingLink: xenditInvoiceUrl,
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
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({
        status: "Failed to Book",
        message: "Error occurred",
        error: e.message,
      }, { status: 500 });
    }
  }
}
