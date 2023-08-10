import { NextResponse } from "next/server";
import { uploadQRCodetoS3 } from "@/utils/s3Init";
import { PurchasedTicket, TicketStatus } from "@prisma/client";
import QRCode from "qrcode";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import PaidBookingTemplate from "@/emails-utils/paidBookingTemplate";
import axios from "axios";
import { prismaClientInstance } from "@/_base";

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
  { params }: { params: { id: string } },
) {
  try {
    const booking = await (await fetch(
      `${process.env.PROJECT_HOST}/api/booking/code/${params.id}`,
    )).json();

    console.log(booking);

    if (booking.message === "Booking not found") {
      return NextResponse.json({
        status: "Success",
        message: "Booking not found",
      }, {
        status: 200,
      });
    }

    if (booking.booking.bookingStatus === "PAID") {
      return NextResponse.json({
        status: "Self Checkout Success",
        message: "Booking already paid, skipping ticket generation",
        detail: {
          id: booking.booking.id,
          bookingId: booking.booking.generatedBookingCode,
        },
      }, {
        status: 200,
      });
    } else {
      // ** 1 Update booking status
      const updateBooking = await prismaClientInstance.booking.update({
        where: {
          id: booking.booking.id,
        },
        data: {
          bookingStatus: "PAID",
          paidMethod: "SELF",
          updatedAt: new Date(),
          payment: {
            update: {
              where: {
                bookingId: booking.booking.id,
              },
              data: {
                status: "PAID",
                updatedAt: new Date(),
              },
            },
          },
          bookingDetails: {
            updateMany: {
              where: {
                bookingId: booking.booking.id,
              },
              data: {
                itemStatus: "PAID",
                updatedAt: new Date(),
              },
            },
          },
        },
        include: {
          bookingDetails: {
            where: {
              bookingId: booking.booking.id,
            },
          },
          user: true,
        },
      });

      // ** 2 Generate ticket for QR
      let purchasedTicketObj = [];
      for (let i = 0; i < updateBooking.bookingDetails.length; i++) {
        for (let j = 0; j < updateBooking.bookingDetails[i].quantity; j++) {
          purchasedTicketObj.push({
            masterTicketId: updateBooking.bookingDetails[i].masterTicketId,
            ticketStatus: "VALID" as TicketStatus,
            bookingId: updateBooking.bookingDetails[i].bookingId,
          });
        }
      }

      await prismaClientInstance.purchasedTicket.createMany({
        data: [...purchasedTicketObj],
      });

      const generatedTickets = await prismaClientInstance.purchasedTicket
        .findMany({
          where: {
            bookingId: updateBooking.id,
          },
        });

      // ** 3 Save to S3
      for (const ticket of generatedTickets) {
        const qrCode = await generateQR(
          `https://www.gadjahfest.com/validate/${ticket.id}`,
        );
        const base64Img = new (Buffer as any).from(
          qrCode?.replace(/^data:image\/\w+;base64,/, ""),
          "base64",
        );
        const type = qrCode!.split(";")[0].split("/")[1];
        await uploadQRCodetoS3(ticket.id, base64Img, type);
        await prismaClientInstance.purchasedTicket.update({
          where: {
            id: ticket.id,
          },
          data: {
            s3BarcodeKeyUrl:
              `https://gadjah-ticketing-platform.s3.ap-southeast-1.amazonaws.com/${ticket.id}.${type}`,
          },
        });
        NextResponse.json({
          status: "uploading generated ticket to s3...",
        }, {
          status: 201,
        });
      }

      // ** 4  generate pdf to S3
      await axios.get(
        `https://vercel-pdf-generator.vercel.app/api?bookingId=${updateBooking.id}&url=https://www.gadjahfest.com/invoice/${updateBooking.generatedBookingCode}`,
      );

      await prismaClientInstance.booking.update({
        where: {
          id: updateBooking.id,
        },
        data: {
          invoicePdfUrl:
            `https://gadjah-ticketing-platform.s3.ap-southeast-1.amazonaws.com/${updateBooking.id}.pdf`,
        },
      });

      NextResponse.json({
        status: "Finish generating pdf and saving to S3...",
      }, {
        status: 201,
      });

      // ** 5 Send Finish Payment Email
      const purchasedTickets = await prismaClientInstance.purchasedTicket
        .findMany({
          where: {
            bookingId: updateBooking.id,
          },
          include: {
            ticket: true,
          },
        });

      NextResponse.json({
        status: "finding records on db ...",
      }, {
        status: 201,
      });

      await sendEmail({
        to: `gadjahfest@gmail.com, ${updateBooking.user.email}`,
        subject:
          `Self Checkout ${updateBooking.user.firstName} - ${updateBooking.user.lastName}`,
        bookingId: updateBooking.generatedBookingCode,
        firstName: updateBooking.user.firstName,
        attachmentLink:
          `https://gadjah-ticketing-platform.s3.ap-southeast-1.amazonaws.com/${updateBooking.id}.pdf`,

        tickets: [...purchasedTickets],
      });

      console.log("PASS 5");

      return NextResponse.json({
        status: "Self Checkout Success",
        message: "Payment received",
        detail: {
          id: updateBooking.id,
          bookingId: updateBooking.generatedBookingCode,
          userId: updateBooking.userId,
          createdAt: updateBooking.createdAt,
          updatedAt: updateBooking.updatedAt,
        },
      }, {
        status: 200,
      });
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({
        status: "Error",
        message: "Error Occurred",
        detail: {
          ...e,
        },
      }, {
        status: 500,
      });
    }
  }
}
