import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Ticket } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request): Promise<NextResponse> {
  const masterTicekts = await prisma.ticket.findMany();
  return NextResponse.json(masterTicekts, { status: 200 });
}

export async function POST(request: Request) {
  const body: Ticket = await request.json();

  const ticket = await prisma.ticket.create({
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
