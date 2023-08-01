import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";
import axios from "axios";
const prisma = prismaClientInstance;

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  return NextResponse.json({
    status: "Success",
    message: "xoxo",
  }, { status: 404 });
}
