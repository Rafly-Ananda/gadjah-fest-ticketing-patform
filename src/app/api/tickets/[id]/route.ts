import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const purchasedTicket = await prismaClientInstance.purchasedTicket
      .findFirst({
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
