import { NextResponse } from "next/server";
import { PurchasedTicket } from "@prisma/client";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import BookingTemplate from "@/emails-utils/BookingTemplate";
import { TicketStatus } from "@prisma/client";
import QRCode from "qrcode";
import { uploadQRCodetoS3 } from "@/utils/s3Init";
import PaidBookingTemplate from "@/emails-utils/paidBookingTemplate";
import { prismaClientInstance } from "@/_base";
import axios from "axios";

interface EmailPayloadInterface {
  to: string;
  subject: string;
  html?: string;
  bookingId: string;
  firstName: string;
  bookingLink: string;
}

interface PaidEmailPayloadInterface {
  to: string;
  subject: string;
  html?: string;
  bookingId: string;
  firstName: string;
  tickets: Array<PurchasedTicket>;
  attachmentLink: string;
}

const sendEmail = async (data: EmailPayloadInterface) => {
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
      BookingTemplate({
        firstName: data.firstName,
        bookingId: data.bookingId,
        bookingLink: data.bookingLink,
      }),
    ),
  });
};

const sendEmailPaidFreeTicket = async (data: PaidEmailPayloadInterface) => {
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
  let booking: any = await request.json();
  const xenditAuthToken = Buffer.from(`${process.env.XENDIT_API_KEY}:`)
    .toString(
      "base64",
    );

  function generateBookingCode(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingCode = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      bookingCode += characters[randomIndex];
    }
    return bookingCode;
  }

  try {
    const masterTicketsData = await prismaClientInstance.ticket.findMany({
      where: {
        OR: booking.details.map((e: any) => {
          return { id: { equals: e.ticketId } };
        }),
      },
    });

    // ** 2 Create Booking
    booking.details = booking.details.map((e: any) => {
      let masterTicket = masterTicketsData.find((v) => v.id === e.ticketId);

      return {
        ticketId: e.ticketId,
        name: masterTicket!.name,
        type: masterTicket!.type,
        price: masterTicket!.price,
        quantity: e.quantity,
      };
    });

    // ** 3 Create Booking & Details
    const newBooking = await prismaClientInstance.booking.create({
      data: {
        bookingStatus: "PENDING",
        generatedBookingCode: generateBookingCode(10),
        bookingDetails: {
          create: booking.details.map((e: any) => {
            return {
              masterTicketId: e.ticketId,
              quantity: e.quantity,
              price: e.price,
              itemStatus: "PENDING",
            };
          }),
        },
        user: {
          create: {
            firstName: booking.user.firstName,
            lastName: booking.user.lastName,
            email: booking.user.email,
            mobileNumber: booking.user.mobileNumber,
          },
        },
      },
    });

    let price = booking.details.map((e: any) => e.price * e.quantity).reduce(
      (a: any, b: any) => a + b,
      0,
    );

    if (price === 0) {
      // ** 1 Update booking status
      const updateBooking = await prismaClientInstance.booking.update({
        where: {
          id: newBooking.id,
        },
        data: {
          bookingStatus: "PAID",
          bookingDetails: {
            updateMany: {
              where: {
                bookingId: newBooking.id,
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
              bookingId: newBooking.id,
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

      await sendEmailPaidFreeTicket({
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
    } else {
      // ** 4 Create xenditInvoice
      const { data } = await axios.post(
        "https://api.xendit.co/v2/invoices",
        {
          external_id: newBooking.id,
          bookingCode: newBooking.generatedBookingCode,
          amount: booking.details.map((e: any) => e.price * e.quantity).reduce(
            (a: any, b: any) => a + b,
            0,
          ),
          currency: "IDR",
          customer: {
            given_names: booking.user.firstName,
            surname: booking.user.lastName,
            email: booking.user.email,
            mobile_number: booking.user.mobileNumber,
          },
          customer_notification_preference: {
            invoice_paid: ["email", "whatsapp"],
          },
          success_redirect_url: `${process.env.PROJECT_HOST}`,
          failure_redirect_url: `${process.env.PROJECT_HOST}`,
          items: booking.details.map((e: any) => {
            return {
              name: e.name,
              type: e.type,
              quantity: e.quantity,
              price: e.price,
            };
          }),
        },
        {
          headers: {
            "Authorization": `Basic ${xenditAuthToken}`,
          },
        },
      );

      const {
        external_id: xenditInvoiceId,
        invoice_url: xenditInvoiceUrl,
        expiry_date: xenditExpiryDate,
        amount: xenditInvoiceAmount,
      } = data;

      // ** 5 Create Payment
      await prismaClientInstance.payment.create({
        data: {
          amount: xenditInvoiceAmount,
          bookingId: newBooking.id,
          xenditInvoiceId: xenditInvoiceId,
          status: "PENDING",
          paymentTime: xenditExpiryDate,
          xenditInvoiceUrl: xenditInvoiceUrl,
        },
      });

      // ** 6 Send Confirm Payment Email
      await sendEmail({
        to: booking.user.email,
        subject: "Konfirmasi Pembayaran Gadjah Fest 2023",
        bookingId: newBooking.generatedBookingCode,
        firstName: booking.user.firstName,
        bookingLink: xenditInvoiceUrl,
      });

      return NextResponse.json(
        {
          status: "Success",
          message: "Booking successfuly created",
          booking: { ...newBooking, invoiceUrl: xenditInvoiceUrl },
        },
        {
          status: 201,
        },
      );
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({
        status: "Failed to Book",
        message: "Error occurred",
        error: e.message,
      }, { status: 500 });
    }
  }
}
