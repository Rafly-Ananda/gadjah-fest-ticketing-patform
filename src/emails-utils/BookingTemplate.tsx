import { Html } from "@react-email/html";
import { Button } from "@react-email/button";
import { Img } from "@react-email/img";
import QRCode from "react-qr-code";

// qr code
import { toDataURL, QRCodeToDataURLOptions } from "qrcode";

const options: QRCodeToDataURLOptions = {
  width: 400,
  margin: 2,
};

const getQRCode = (value: string) => {
  let qrValue: string | undefined = undefined;

  toDataURL(value, options, (err, url) => {
    if (err) {
      console.error(err);
      return;
    }
    qrValue = url;
  });

  return qrValue;
};

export default function BookingTemplate() {
  return (
    <Html lang="en">
      <Img
        src="https://gadjah-ticketing-platform.s3.ap-southeast-1.amazonaws.com/qrcode.png"
        alt="Cat"
        width="300"
        height="300"
      />

      <Button href={"https://www.youtube.com"}>Click me</Button>
    </Html>
  );
}
