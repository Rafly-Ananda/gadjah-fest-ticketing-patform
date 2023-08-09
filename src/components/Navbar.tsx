"use client";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { menus } from "@/statics/statics";
import CheckTicketModal from "./modals/CheckTicketModal";
import { useRouter, usePathname } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";
import Hamburger from "hamburger-react";

const Navbar: FC<any> = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [bookingCode, setBookingCode] = useState<string>("");
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isIntersecting, setIstersecting] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigateToTicketDetails = async () => {
    setIsLoading(true);
    router.push(`/invoice/${bookingCode}`);
    setIsNavOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((e) => {
      setIstersecting(e[0].isIntersecting);
    });

    if (document.getElementById("hero")) {
      observer.observe(document.getElementById("hero")!);
    }
    setIsNavOpen(false);

    return () => {
      if (document.getElementById("hero")) {
        observer.observe(document.getElementById("hero")!);
      }
      onClose();
      setIsLoading(false);
    };
  }, [pathname, onClose]);

  return (
    <nav
      className={`fixed flex flex-col items-center justify-between ${
        isIntersecting && pathname === "/"
          ? "bg-transparent"
          : "bg-gradient-to-b from-[#0a6c72] to-transparent"
      }  md:p-4 px-7 py-4 w-full z-50 ${
        pathname.includes("admin") && "bg-[#0a6c72]"
      } ${pathname.includes("invoice") && "bg-[#0a6c72]"} ${
        pathname.includes("validate") && "bg-[#0a6c72]"
      }`}
    >
      <CheckTicketModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        isLoading={isLoading}
        bookingCode={bookingCode}
        setBookingCode={setBookingCode}
        navigateToTicketDetails={navigateToTicketDetails}
      />
      <div className="flex md:w-3/4 w-full items-center justify-between ">
        <div className="flex items-center justify-center gap-8">
          <Image
            src="/logo-alternate.png"
            alt="logo"
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            className="h-auto md:w-[100px] w-[70px]"
          />

          <ul className="hidden md:flex flex-row items-center justify-center gap-14 ">
            {menus.map((e, i: number) => (
              <a
                key={i}
                href={e.href}
                className={`group relative font-medium text-white no-underline`}
              >
                {e.name}
                <span className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 transform bg-[#fdcf00] transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              </a>
            ))}
          </ul>
        </div>
        <div
          className={`flex items-center justify-center flex-col gap-5 w-screen h-screen bg-transparent backdrop-blur-md absolute inset-0 ${
            isNavOpen ? "block" : "hidden"
          }`}
        >
          {menus.map((e, i: number) => (
            <a
              key={i}
              href={e.href}
              className="group relative font-medium text-[#0a6c72] no-underline"
            >
              {e.name}
            </a>
          ))}
          <button className="text-[#0a6c72] font-medium" onClick={onOpen}>
            Cek Tiket
          </button>
        </div>

        <div className="block lg:hidden z-10">
          <Hamburger
            toggled={isNavOpen}
            toggle={setIsNavOpen}
            direction="left"
            color="#ffffff"
          />
        </div>
        <button
          className="hidden md:block rounded-lg bg-[#ffffff] w-fit h-fit p-4 text-xs font-medium
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
