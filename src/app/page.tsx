"use client";

// ** Libs
import axios from "axios";
import { useEffect, useState } from "react";
import { PROJECT_HOST } from "@/config";
import { Ticket } from "@prisma/client";

// ** Components
import FestivalRegistration from "@/components/sections/FestivalRegistration";
import KiteRegistration from "@/components/sections/KiteRegistration";
import Footer from "@/components/sections/Footer";
import SupportedBy from "@/components/sections/SupportedBy";
import LampungLittleIndonesia from "@/components/sections/LampungLittleIndonesia";
import Hero from "@/components/sections/Hero";
import MarathonRegistration from "@/components/sections/MarathonRegistration";

export default function Home() {
  const [festivalTickets, setFestivalTickets] = useState<Ticket[]>([]);
  const [kiteTickets, setKiteTickets] = useState<Ticket[]>([]);
  const [marathonTickets, setMarathonTickets] = useState<Ticket[]>([]);

  const fetchAllTicket = async () => {
    try {
      const tickets = await axios.get(`${PROJECT_HOST}/api/tickets`);

      tickets.data.forEach((e: Ticket) => {
        if (e.type === "festival") {
          setFestivalTickets((prev) => [...prev, e]);
        } else if (e.type === "marathon") {
          setMarathonTickets((prev) => [...prev, e]);
        } else {
          setKiteTickets((prev) => [...prev, e]);
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  const resetTicketsList = () => {
    setFestivalTickets([]);
    setKiteTickets([]);
    setMarathonTickets([]);
  };

  useEffect(() => {
    resetTicketsList();
    fetchAllTicket();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center relative">
      {/* Hero */}
      <Hero />

      {/* Tiket Festival */}
      <FestivalRegistration ticketsList={festivalTickets} />

      {/* Registrasi Layang-layang */}
      <KiteRegistration ticketsList={kiteTickets} />

      {/* Registrasi Marathon */}
      <MarathonRegistration ticketsList={marathonTickets} />

      {/* Lampung Little Indonesia */}
      <LampungLittleIndonesia />

      {/* Supported By */}
      <SupportedBy />

      {/* Footer */}
      <Footer />
    </main>
  );
}
