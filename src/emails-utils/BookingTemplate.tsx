import {
  Body,
  Button,
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

interface BookingTemplateInterface {
  firstName?: string;
  bookingLink?: string;
  bookingId: string;
}

export const BookingTemplate = ({
  firstName,
  bookingLink,
  bookingId,
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
              <strong>Lakukan Pembayaran</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hallo, {firstName}
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Kamu baru saja melakukan pemesanan tiket dengan booking id
              <strong> {bookingId}</strong> untuk acara Gadjah Fest 2023, segera
              lakukan pembayaran dengan menekan tombol link pembayaran dibawah
              ini.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                pX={20}
                pY={12}
                className="bg-[#0a6c72] rounded text-white text-[12px] font-semibold no-underline text-center"
                href={bookingLink}
              >
                Link Pembayaran
              </Button>
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

export default BookingTemplate;
