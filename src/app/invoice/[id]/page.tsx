"use client";
import Image from "next/image";
import QRCode from "react-qr-code";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { PROJECT_HOST } from "@/config";

export default function Page({ params }: { params: { id: string } }) {
  const [tickets, setTickets] = useState([]);
  const [bookingStatus, setBookingStatus] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${PROJECT_HOST}/api/booking/code/${params.id}`
      );
      setBookingStatus(data.booking.bookingStatus);
      if (data.booking.length !== 0) {
        setTickets(data.booking.purchasedTickets);
      }
    })();
  }, [params.id]);

  return (
    <main className="">
      <div className="flex flex-col gap-4 items-center justify-center mt-5 pt-2">
        {tickets && tickets.length === 0 && bookingStatus === "" ? (
          <div className="border border-[#0a6c72] p-16 rounded-lg">
            <h1>
              Tidak ada booking dengan ID <strong>{params.id}</strong>
            </h1>
          </div>
        ) : bookingStatus === "PENDING" ? (
          <div className="border border-[#0a6c72] p-16 rounded-lg">
            <h1>
              Lakukan pembayaran untuk booking dengan ID
              <strong> {params.id}</strong>
            </h1>
          </div>
        ) : bookingStatus === "EXPIRED" ? (
          <div className="border border-[#0a6c72] p-16 rounded-lg max-w-2xl">
            <h1>
              Booking dengan ID <strong>{params.id}</strong> telah hangus,
              karena anda melewati batas waktu pembayaran, silahkan lakukan
              booking ulang.
            </h1>
          </div>
        ) : (
          <React.Fragment>
            <h1 className="text-lg font-semibold">Electronic Ticket</h1>
            {tickets &&
              tickets.map((e: any, i) => (
                <div
                  key={e.id + i}
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
          </React.Fragment>
        )}
      </div>
    </main>
  );
}
