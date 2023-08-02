"use client";
import Image from "next/image";
import QRCode from "react-qr-code";
import axios from "axios";
import { useEffect, useState } from "react";
import { PROJECT_HOST } from "@/config";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="">
      <h1>marathon registration page {params.id}</h1>
    </main>
  );
}
