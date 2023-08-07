import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";

const prisma = prismaClientInstance;

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const purchasedTicket = await prisma.purchasedTicket.findFirst({
      where: {
        id: params.id,
      },
      include: {
        booking: true,
      },
    });

    if (purchasedTicket === null) {
      return NextResponse.json({
        status: "Request Success",
        message: "Ticket not found",
        data: params.id,
      }, { status: 200 });
    }

    if (purchasedTicket.ticketStatus === "INVALID") {
      return NextResponse.json({
        status: "Request Success",
        message: `Ticket sudah di aktivasi`,
        activationDate: purchasedTicket.scannedTime,
        data: params.id,
      }, { status: 200 });
    }

    return NextResponse.json({
      status: "Request Success",
      message: "Ticket found",
      data: purchasedTicket,
    }, { status: 200 });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({
        status: "Failed",
        message: "Server error",
        detail: e.message,
      }, { status: 500 });
    }
  }
}

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const updatedTicket = await prisma.purchasedTicket.update({
//       where: {
//         id: params.id,
//       },
//       data: {
//         ticketStatus: "INVALID",
//         scannedTime: new Date(),
//       },
//     });

//     return NextResponse.json({
//       status: "Request Success",
//       message: "Ticket found",
//       ticket: updatedTicket,
//     }, { status: 200 });
//   } catch (e) {
//     if (e instanceof Error) {
//       return NextResponse.json({
//         status: "Failed",
//         message: "Server error",
//         detail: e.message,
//       }, { status: 500 });
//     }
//   }
// }
