"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import { menus } from "@/statics/statics";
import CheckTicketModal from "./checkTicketModal";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";

const Navbar: FC<any> = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bookingCode, setBookingCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const navigateToTicketDetails = async () => {
    router.push(`/invoice/${bookingCode}`);
  };

  return (
    <nav className="hidden md:flex flex-col items-center justify-between bg-[#0a6c72] p-4">
      <CheckTicketModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        bookingCode={bookingCode}
        setBookingCode={setBookingCode}
        navigateToTicketDetails={navigateToTicketDetails}
      />
      <div className="flex w-3/4 items-center justify-between ">
        <div className="flex items-center justify-center gap-8">
          <Image
            src="/logo.png"
            alt="logo"
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            className="h-auto w-[100px]"
          />
          <ul className="flex flex-row items-center justify-center gap-14 ">
            {menus.map((e: any, i: number) => (
              <a
                key={i}
                href=""
                className="group relative font-medium text-white no-underline"
              >
                {e}
                <span className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 transform bg-[#fdcf00] transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </a>
            ))}
          </ul>
        </div>

        <button
          className="rounded-lg bg-[#ffffff] w-fit h-fit p-4 text-xs font-medium
    tracking-widest hover:bg-[#fdcf00] hover:text-white"
          onClick={onOpen}
        >
          Cek Tiket
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
