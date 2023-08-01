import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";
import axios from "axios";
const prisma = prismaClientInstance;
import nodemailer from "nodemailer";
// const nodemailer = require("nodemailer");

type EmailPayload = {
  to: string;
  subject: string;
  html?: string;
};

// Replace with your SMTP credentials
const smtpOptions = {
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "user",
    pass: process.env.SMTP_PASSWORD || "password",
  },
};

// async function sendMail() {
//   console.log(process.env.NODEMAILER_EMAIL);
//   console.log(process.env.NODEMAILER_PW);
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     secureConnection: true,
//     auth: {
//       user: process.env.NODEMAILER_EMAIL,
//       pass: process.env.NODEMAILER_PW,
//     },
//   });

//   const mailOptions = {
//     from: process.env.NODEMAILER_EMAIL,
//     to: "kayzeel15@gmail.com",
//     subject: "Testozz",
//     text: "http://localhost:3000/",
//   };

//   transporter.sendMail(mailOptions, (error: any, info: any) => {
//     if (error) {
//       console.log(error);
//       console.log("err occurred");
//     } else {
//       console.log("email sento");
//       return true;
//     }
//   });
// }

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    // ...smtpOptions,
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  return await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    ...data,
    text: "aiueo",
  });
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  await sendEmail({ to: "kayzeel15@gmail.com", subject: "Welcome to NextAPI" });

  return NextResponse.json({
    status: "Success",
    message: "xoxo",
  }, { status: 404 });
}
