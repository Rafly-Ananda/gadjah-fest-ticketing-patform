import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: params.id,
      },
      include: {
        bookingDetails: true,
        payment: true,
      },
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
      }, { status: 404 });
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const booking = await prisma.booking.update({
      where: {
        id: params.id,
      },
      data: {
        payment: {
          delete: true,
        },
        bookingDetails: {
          deleteMany: {
            bookingId: params.id,
          },
        },
        bookingStatus: "EXPIRED",
      },
    });

    if (booking) {
      return NextResponse.json({
        status: "Success",
        message: "Booking Canceleld",
        booking: booking,
      }, {
        status: 200,
      });
    } else {
      return NextResponse.json({
        status: "Success",
        message: "Booking not found",
        bookingId: params.id,
      }, { status: 404 });
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
