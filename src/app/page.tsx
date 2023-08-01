"use client";
import Image from "next/image";
import QRCode from "react-qr-code";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        "http://localhost:3000/api/booking/code/6I9AGG1Z4Q"
      );
      console.log(data);
    })();
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* test */}
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "40%", width: "40%" }}
        value={"www.youtube.com"}
        viewBox={`0 0 256 256`}
      />
    </main>
  );
}
