"use client";
import Image from "next/image";
import QRCode from "react-qr-code";
import axios from "axios";
import { useEffect, useState } from "react";
import { PROJECT_HOST } from "@/config";

export default function Page({ params }: { params: { id: string } }) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${PROJECT_HOST}/api/booking/code/${params.id}`
      );
      console.log(data.booking);
      console.log(data.booking.purchasedTickets);
      console.log(data.booking.user);
      setTickets(data.booking.purchasedTickets);
    })();
  }, [params.id]);

  return (
    <main className="">
      <div className="flex flex-col gap-4 items-center justify-center mt-5 pt-2">
        <h1 className="text-lg font-semibold">Electronic Ticket</h1>
        {tickets &&
          tickets.map((e: any, i) => (
            <div
              key={e}
              className="rounded-lg border border-[#0a6c72] flex w-4/5 gap-4 p-4 m-2"
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "15%", width: "15%" }}
                value={"www.youtube.com"}
                viewBox={`0 0 256 256`}
              />
              <div className="flex items-start justity-center">
                <ul className="text-sm">
                  <li>Ticket Name : {e.ticket.name}</li>
                  <li>Ticket ID : {e.id}</li>
                </ul>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
