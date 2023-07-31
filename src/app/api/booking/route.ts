import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { TicketAvailibilityType, TicketDetailsType } from "@/interfaces";
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
  let { booking }: { booking: TicketDetailsType[] } = await request.json();
  const date = new Date();
  const availabilityReturnObj: TicketAvailibilityType[] = [];
  let validToBook: boolean = true;

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
    // 1 Validate ticket availability
    const bookedTicketsData = await prisma.bookingDetails.groupBy({
      by: ["masterTicketId"],
      _sum: {
        quantity: true,
      },
    }).then((res) =>
      res.map((e) => {
        return {
          masterTicketId: e.masterTicketId,
          totalBooking: e._sum.quantity != null ? e._sum.quantity : 0,
        };
      })
    );

    const masterTicketsData = await prisma.ticket.findMany({
      where: {
        OR: booking.map((e) => {
          return { id: { equals: e.ticketId } };
        }),
      },
    });

    for (let i = 0; i < bookedTicketsData.length; i++) {
      const masterTicket = masterTicketsData.find((e) =>
        e.id === bookedTicketsData[i].masterTicketId
      );
      const userTicketBookingQty = booking.find((e) =>
        e.ticketId === bookedTicketsData[i].masterTicketId
      );

      if (
        bookedTicketsData[i].totalBooking + userTicketBookingQty!.quantity >
          masterTicket!.quantity
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

    // 2 Create Booking
    booking = booking.map((e) => {
      let masterTicket = masterTicketsData.find((v) => v.id === e.ticketId);

      return {
        ticketId: e.ticketId,
        price: e.quantity * masterTicket!.price,
        quantity: e.quantity,
      };
    });

    // 3 Create Booking & Details
    const newBooking = await prisma.booking.create({
      data: {
        bookingStatus: "Pending",
        generatedBookingCode: generateBookingCode(10),
        bookingDetails: {
          create: booking.map((e) => {
            return {
              masterTicketId: e.ticketId,
              quantity: e.quantity,
              price: e.price,
            };
          }),
        },
      },
    });

    // 4 Create Payment
    await prisma.payment.create({
      data: {
        amount: booking.map((e) => e.price).reduce((a, b) => a + b, 0),
        bookingId: newBooking.id,
        status: "Pending",
        paymentTime: new Date(date.getTime() + 5 * 60 * 1000),
      },
    });

    return NextResponse.json(
      { status: "Success", message: "Booking success", booking: newBooking },
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
