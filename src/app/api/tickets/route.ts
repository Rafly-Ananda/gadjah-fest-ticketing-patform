import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request): Promise<NextResponse> {
  const masterTicekts = await prisma.ticket.findMany();
  return NextResponse.json(masterTicekts, { status: 200 });
}

export async function POST(request: Request) {
  console.log("post route");
  return NextResponse.json({ mesasge: "Posting" });
}
