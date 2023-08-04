import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { PurchasedTicket } from "@prisma/client";

interface BookingTemplateInterface {
  firstName?: string;
  bookingId: string;
  tickets: Array<PurchasedTicket>;
}

export const PaidBookingTemplate = ({
  firstName,
  bookingId,
  tickets,
}: BookingTemplateInterface) => {
  return (
    <Html>
      <Head />
      <Preview>Gadjah Fest 2023</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://gadjah-ticketing-platform.s3.ap-southeast-1.amazonaws.com/logo-alternate.png"
                width="40"
                height="37"
                alt="Vercel"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-[#0a6c72] text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Konfirmasi Pemesanan</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hallo, {firstName}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Pembayaran yang sudah kamu lakukan telah terkonfirmasi oleh
              sistem, kode QR untuk tiket bisa kamu cek di lampiran email ini.
            </Text>

            <Section className="flex items-center justify-center">
              Kode Booking : <strong>{bookingId}</strong>
            </Section>

            <Section className="pt-5 items-center justify-center ">
              {tickets &&
                tickets.map((e: any, i) => (
                  <Section
                    key={i}
                    className="p-5 rounded-lg border border-solid border-[#0a6c72] my-5"
                  >
                    <Img
                      src={e.s3BarcodeKeyUrl}
                      width="150"
                      height="150"
                      alt="Vercel"
                      className="my-0 mx-auto"
                    />
                    <Section className="items">
                      <ul className="text-sm list-none">
                        <li>Ticket Name : {e.ticket.name}</li>
                        <li>Ticket ID : {e.id}</li>
                      </ul>
                    </Section>
                  </Section>
                ))}
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Email ini dikirim secara sistem, apabila ada pertanyaan silahkan
              hubungi kami di <span> </span>
              <Link
                href={"gadjahfest@gmail.com"}
                className="text-blue-600 no-underline"
              >
                gadjahfest@gmail.com
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PaidBookingTemplate;
