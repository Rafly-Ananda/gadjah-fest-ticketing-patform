import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { uploadQRCodetoS3 } from "@/utils/s3Init";
import { PurchasedTicket, TicketStatus } from "@prisma/client";
import { generatePdf } from "@/utils/playwrightInit";
import QRCode from "qrcode";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import PaidBookingTemplate from "@/emails-utils/paidBookingTemplate";
import axios from "axios";

const prisma = new PrismaClient();

interface EmailPayloatInterface {
  to: string;
  subject: string;
  html?: string;
  bookingId: string;
  firstName: string;
  tickets: Array<PurchasedTicket>;
  attachmentLink: string;
}

const sendEmail = async (data: EmailPayloatInterface) => {
  const transporter = nodemailer.createTransport({
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
    html: render(
      PaidBookingTemplate({
        firstName: data.firstName,
        bookingId: data.bookingId,
        tickets: data.tickets,
      }),
    ),
    attachments: [{
      filename: "Document",
      path: data.attachmentLink,
      contentType: "application/pdf",
    }],
  });
};

const generateQR = async (text: any) => {
  try {
    return QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
  }
};

export async function POST(
  request: Request,
) {
  return NextResponse.json({
    status: "Sefl Checkout Success",
    message: "Payment received",
    //   detail: {
    //     id: updateBooking.id,
    //     bookingId: updateBooking.generatedBookingCode,
    //     userId: updateBooking.userId,
    //     createdAt: updateBooking.createdAt,
    //     updatedAt: updateBooking.updatedAt,
    //   },
  }, {
    status: 200,
  });
}
