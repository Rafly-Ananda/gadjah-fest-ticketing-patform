import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";

const prisma = prismaClientInstance;

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const purchasedTickets = await prisma.purchasedTicket.findMany({
    where: {
      bookingId: "e9d85f92-bea8-4f05-b1ac-e03de7ad4007",
    },
    include: {
      ticket: true,
    },
  });

  console.log(purchasedTickets);

  return NextResponse.json({
    status: "Success",
    message: "xoxo",
  }, { status: 404 });
}
