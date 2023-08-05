import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        generatedBookingCode: params.id,
      },
      select: {
        id: true,
        generatedBookingCode: true,
        bookingStatus: true,
        purchasedTickets: {
          include: {
            ticket: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            mobileNumber: true,
          },
        },
      },
      // include: {
      //   bookingDetails: true,
      //   payment: true,
      //   user: true,
      //   purchasedTickets: true,
      // },
    });

    if (booking) {
      return NextResponse.json({
        status: "Success",
        message: "Booking found",
        booking: booking,
      }, {
        status: 200,
      });
    } else {
      return NextResponse.json({
        status: "Success",
        message: "Booking not found",
        bookingId: params.id,
        booking: [],
      }, { status: 200 });
    }
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
