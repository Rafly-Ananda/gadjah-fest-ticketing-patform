import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { uploadQRCodetoS3 } from "@/utils/s3Init";
import { PurchasedTicket, TicketStatus } from "@prisma/client";
import { generatePdf } from "@/utils/playwrightInit";
import QRCode from "qrcode";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import PaidBookingTemplate from "@/emails-utils/paidBookingTemplate";
import { user } from "@nextui-org/react";

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

export async function POST(
  request: Request,
) {
  try {
    console.log("coming from callback");
    const body = await request.json();
    console.log(body);

    if (body.status === "PAID") {
      try {
        // ** 1 Update booking status
        const updateBooking = await prisma.booking.update({
          where: {
            id: body.external_id,
          },
          data: {
            bookingStatus: "PAID",
            payment: {
              update: {
                where: {
                  bookingId: body.external_id,
                },
                data: {
                  status: "PAID",
                },
              },
            },
            bookingDetails: {
              updateMany: {
                where: {
                  bookingId: body.external_id,
                },
                data: {
                  itemStatus: "PAID",
                },
              },
            },
          },
          include: {
            bookingDetails: {
              where: {
                bookingId: body.external_id,
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
              marathonDetail: "",
            });
          }
        }

        await prisma.purchasedTicket.createMany({
          data: [...purchasedTicketObj],
        });

        const generatedTickets = await prisma.purchasedTicket.findMany({
          where: {
            bookingId: updateBooking.id,
          },
        });

        // ** 3 Save to S3
        const generateQR = async (text: any) => {
          try {
            return QRCode.toDataURL(text);
          } catch (err) {
            console.error(err);
          }
        };

        for (const ticket of generatedTickets) {
          const qrCode = await generateQR(JSON.stringify(ticket));
          const base64Img = new (Buffer as any).from(
            qrCode?.replace(/^data:image\/\w+;base64,/, ""),
            "base64",
          );
          const type = qrCode!.split(";")[0].split("/")[1];
          await uploadQRCodetoS3(ticket.id, base64Img, type);
          await prisma.purchasedTicket.update({
            where: {
              id: ticket.id,
            },
            data: {
              s3BarcodeKeyUrl:
                `https://gadjah-ticketing-platform.s3.ap-southeast-1.amazonaws.com/${ticket.id}.${type}`,
            },
          });
        }

        // ** 4  generate pdf to S3
        await generatePdf(
          updateBooking.id,
          `${process.env.PROJECT_HOST}/invoice/${updateBooking.generatedBookingCode}`,
        );

        await prisma.booking.update({
          where: {
            id: body.external_id,
          },
          data: {
            invoicePdfUrl:
              `https://gadjah-ticketing-platform.s3.ap-southeast-1.amazonaws.com/${updateBooking.id}.pdf`,
          },
        });

        const purchasedTickets = await prisma.purchasedTicket.findMany({
          where: {
            bookingId: updateBooking.id,
          },
          include: {
            ticket: true,
          },
        });

        // ** 6 Send Finish Payment Email
        await sendEmail({
          to: updateBooking.user.email,
          subject: "Konfirmasi Pembayaran Gadjah Fest 2023",
          bookingId: updateBooking.generatedBookingCode,
          firstName: updateBooking.user.firstName,
          attachmentLink:
            `https://gadjah-ticketing-platform.s3.ap-southeast-1.amazonaws.com/${updateBooking.id}.pdf`,
          tickets: [...purchasedTickets],
        });

        return NextResponse.json({
          status: "Success",
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
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          return NextResponse.json({
            status: "Failed",
            message: "Payment Received But Failed",
            detail: {
              ...e,
            },
          }, {
            status: 500,
          });
        }
      }
    }

    if (body.status === "EXPIRED") {
      // 1 Update booking status
      const updateBooking = await prisma.booking.update({
        where: {
          id: body.external_id,
        },
        data: {
          bookingStatus: "EXPIRED",
          payment: {
            update: {
              where: {
                bookingId: body.external_id,
              },
              data: {
                status: "EXPIRED",
              },
            },
          },
          bookingDetails: {
            updateMany: {
              where: {
                bookingId: body.external_id,
              },
              data: {
                itemStatus: "REVOKED",
              },
            },
          },
        },
        include: {
          bookingDetails: {
            where: {
              bookingId: body.external_id,
            },
          },
        },
      });

      return NextResponse.json({
        status: "Success",
        message: "Payment expired",
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
