import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";
import axios from "axios";
const prisma = prismaClientInstance;

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: {
        bookingId: params.id,
      },
    });

    if (payment) {
      return NextResponse.json({
        status: "Success",
        message: "Payment found",
        booking: payment,
      }, {
        status: 200,
      });
    } else {
      return NextResponse.json({
        status: "Success",
        message: "Payment not found",
        bookingId: params.id,
      }, { status: 404 });
    }
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({
        status: "Failed",
        message: "Error occurred",
        error: e.message,
      }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  const authToken = Buffer.from(`${process.env.XENDIT_API_KEY}:`).toString(
    "base64",
  );
  try {
    const { data, status } = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id: "xendit_test_id_1", // paymentId
        amount: 20000,
        currency: "IDR",
        customer: {
          given_names: "Ahmad",
          surname: "Gunawan",
          email: "ahmad_gunawan@example.com",
          mobile_number: "+6287774441111",
        },
        customer_notification_preference: {
          invoice_paid: ["email", "whatsapp"],
        },
        success_redirect_url: "example.com/success",
        failure_redirect_url: "example.com/failure",
        items: [
          {
            name: "Double Cheeseburger",
            quantity: 1,
            price: 8000,
            category: "Fast Food",
          },
          {
            name: "Chocolate Sundae",
            quantity: 1,
            price: 8000,
            category: "Fast Food",
          },
        ],
      },
      {
        headers: {
          "Authorization": `Basic ${authToken}`,
        },
      },
    );

    console.log(`Response returned with a status of ${status}`);

    console.log(data);

    const { invoice_url } = data;

    console.log(`Invoice created! Visit ${invoice_url} to complete payment`);

    return NextResponse.json({
      status: "Success",
      message: "Payment success",
    }, {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      status: "Success",
      message: "Payment failed",
    }, {
      status: 200,
    });
  }
}
