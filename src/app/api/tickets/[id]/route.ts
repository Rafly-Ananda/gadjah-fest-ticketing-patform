import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";
import axios from "axios";
const prisma = prismaClientInstance;
const nodemailer = require("nodemailer");

async function sendMail() {
  console.log(process.env.NODEMAILER_EMAIL);
  console.log(process.env.NODEMAILER_PW);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secureConnection: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: "kayzeel15@gmail.com",
    subject: "Testozz",
    text: "http://localhost:3000/",
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log(error);
      console.log("err occurred");
    } else {
      console.log("email sento");
      return true;
    }
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  await sendMail();

  return NextResponse.json({
    status: "Success",
    message: "xoxo",
  }, { status: 404 });
}
