import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const updatedTicket = await prismaClientInstance.purchasedTicket.update({
      where: {
        id: params.id,
      },
      data: {
        ticketStatus: "INVALID",
        scannedTime: new Date(),
      },
      include: {
        booking: true,
      },
    });

    return NextResponse.json({
      status: "Request Success",
      message: "Ticket sudah di aktivasi",
      data: updatedTicket,
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
