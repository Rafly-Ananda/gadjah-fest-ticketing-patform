import { NextRequest, NextResponse } from "next/server";
import { Ticket } from "@prisma/client";
import { prismaClientInstance } from "@/_base";

export async function GET(request: Request): Promise<NextResponse> {
  const masterTicekts = await prismaClientInstance.ticket.findMany();
  return NextResponse.json(masterTicekts, { status: 200 });
}

export async function POST(request: Request) {
  const body: Ticket = await request.json();

  const ticket = await prismaClientInstance.ticket.create({
    data: {
      name: body.name,
      type: body.type,
      quantity: body.quantity,
      description: body.description,
      price: body.price,
      published: body.published,
    },
  });

  return NextResponse.json({ mesasge: "Ticket Created", ticket });
}

// export async function GET(request: Request): Promise<NextResponse> {
//   const response = await prisma.purchasedTicket.findMany({
//     where: {
//       masterTicketId: "65a3910d-f549-4fb4-8847-76ddf7cccc29",
//     },
//     include: {
//       booking: {
//         include: {
//           marathonDetail: true,
//         },
//       },
//     },
//   });

//   const resultMale = response.filter((e) =>
//     e.booking.marathonDetail.userGender === "pria"
//   );

//   const resultFemale = response.filter((e) =>
//     e.booking.marathonDetail.userGender === "wanita"
//   );

//   const returnObj = {
//     totalMaleCount: resultMale.length,
//     totalFemaleCount: resultFemale.length,
//     data: {
//       male: [...resultMale],
//       female: [...resultFemale],
//     },
//   };

//   return NextResponse.json(returnObj, { status: 200 });
// }
