import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
) {
  const body = await request.json();

  if (body.status === "PAID") {
    // 1 Update booking status
    const updateBooking = await prisma.booking.update({
      where: {
        id: body.external_id,
      },
      data: {
        bookingStatus: "PAID",
        payment: {
          update: {
            where: {
              bookingId: body.external_id,
            },
            data: {
              status: "PAID",
            },
          },
        },
        bookingDetails: {
          updateMany: {
            where: {
              bookingId: body.external_id,
            },
            data: {
              itemStatus: "PAID",
            },
          },
        },
      },
      include: {
        bookingDetails: {
          where: {
            bookingId: body.external_id,
          },
        },
      },
    });

    // 2 Generate ticket for QR
    const generateTicket = await prisma.purchasedTicket.createMany({
      data: updateBooking.bookingDetails.map((e) => {
        return {
          masterTicketId: e.masterTicketId,
          ticketStatus: "VALID",
          bookingId: e.bookingId,
          marathonDetail: "", // TODO: isi ntar
        };
      }),
    });

    return NextResponse.json({
      status: "Success",
      message: "Payment received",
      detail: {
        id: updateBooking.id,
        bookingId: updateBooking.generatedBookingCode,
        userId: updateBooking.userId,
        createdAt: updateBooking.createdAt,
        updatedAt: updateBooking.updatedAt,
      },
    }, {
      status: 200,
    });
  }

  if (body.status === "EXPIRED") {
    // 1 Update booking status
    const updateBooking = await prisma.booking.update({
      where: {
        id: body.external_id,
      },
      data: {
        bookingStatus: "EXPIRED",
        payment: {
          update: {
            where: {
              bookingId: body.external_id,
            },
            data: {
              status: "EXPIRED",
            },
          },
        },
        bookingDetails: {
          updateMany: {
            where: {
              bookingId: body.external_id,
            },
            data: {
              itemStatus: "REVOKED",
            },
          },
        },
      },
      include: {
        bookingDetails: {
          where: {
            bookingId: body.external_id,
          },
        },
      },
    });

    return NextResponse.json({
      status: "Success",
      message: "Payment expired",
      detail: {
        id: updateBooking.id,
        bookingId: updateBooking.generatedBookingCode,
        userId: updateBooking.userId,
        createdAt: updateBooking.createdAt,
        updatedAt: updateBooking.updatedAt,
      },
    }, {
      status: 200,
    });
  }
}
