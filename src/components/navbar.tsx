import React from "react";
import Image from "next/image";
import { menus } from "@/statics/statics";

export default function Navbar() {
  return (
    <nav className="hidden md:flex flex-col items-center justify-center">
      <div className="flex w-full items-center justify-center border-b-2 border-black ">
        <div className="flex w-11/12 lg:w-3/5 items-center justify-between py-9 ">
          <h1>Gadjah Fest 2023</h1>
          {/* <Image
            src="/logo_white.png"
            alt="logo"
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            className="h-auto w-[224px]"
          /> */}
          <button
            className="rounded-2xl bg-[#fdcf00] px-7 py-2 text-xs font-extrabold
    tracking-widest hover:bg-[#d4ad00]"
          >
            Ticket Check
          </button>
        </div>
      </div>
      <ul className="flex md:w-11/12 lg:w-[950px] flex-row items-center justify-center border-b border-slate-200 pt-5">
        {menus.map((e: any, i: number) => (
          <a
            key={i}
            href=""
            className="group relative h-[50px] md:px-7 lg:px-10 font-semibold text-black no-underline"
          >
            {e}
            <span className="absolute bottom-0 left-0  h-[3px] w-full scale-x-0 transform bg-[#fdcf00] transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
          </a>
        ))}
      </ul>
    </nav>
  );
}
