"use client";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#222222] mt-8 w-full flex flex-col items-center">
      <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-3/5 p-5 gap-5">
        <Image
          src="/footer_logo.png"
          alt="logo"
          width="0"
          height="0"
          sizes="100vw"
          priority={true}
          className="h-auto md:w-[100px] w-[70px]"
        />

        <div className="flex flex-col items-center justify-center gap-1 z-50">
          <h1 className="text-white font-semibold md:text-sm text-xs">
            HUBUNGI KAMI
          </h1>
          <p className="text-[#818181] md:text-sm text-xs">
            info@gadjahfest.com
          </p>
          <div className="flex gap-2">
            <a href="https://www.facebook.com/profile.php?id=100095413808267">
              <Image
                src="/facebook.png"
                alt="logo"
                width="10"
                height="11"
                sizes="100vw"
                priority={true}
                className="md:w-[10px] md:h-[14 px]"
              />
            </a>

            <a href="https://www.instagram.com/gadjahfest/">
              <Image
                src="/instagram.png"
                alt="logo"
                width="14"
                height="14"
                sizes="100vw"
                priority={true}
                className="md:w-[14px] md:h-[14px]"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#000000] p-4 flex items-center justify-center">
        <h1 className="text-[#808080] md:text-sm text-xs font-semibold ">
          GADJAHFEST2023 - #HIDUPBERDAMPINGAN
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
