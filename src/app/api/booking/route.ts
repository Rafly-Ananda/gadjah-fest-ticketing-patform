import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { TicketDetailsType } from "@/interfaces";
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
  // TODO: validate sisa tiket tersedia disini
  let { booking }: { booking: TicketDetailsType[] } = await request.json();
  const date = new Date();

  try {
    // 1 Calculate prices
    const masterTicketsData = await prisma.ticket.findMany({
      where: {
        OR: booking.map((e) => {
          return { id: { equals: e.ticketId } };
        }),
      },
    });

    booking = booking.map((e) => {
      let masterTicket = masterTicketsData.find((v) => v.id === e.ticketId);

      return {
        ticketId: e.ticketId,
        price: e.quantity * masterTicket!.price,
        quantity: e.quantity,
      };
    });

    // 2 Create Booking & Details
    const newBooking = await prisma.booking.create({
      data: {
        bookingStatus: "Pending",
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

    // 3 Create Payment
    await prisma.payment.create({
      data: {
        amount: booking.map((e) => e.price).reduce((a, b) => a + b, 0),
        bookingId: newBooking.id,
        status: "Pending",
        paymentTime: new Date(date.getTime() + 5 * 60 * 1000),
      },
    });

    return NextResponse.json(
      { status: "Success", message: "Booking created", booking: newBooking },
      {
        status: 201,
      },
    );
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
