"use client";
import Image from "next/image";
import { tBannerImageLink } from "@/statics/statics";

const Hero = () => {
  return (
    <>
      {" "}
      <div className="absolute inset-0">
        <div className="md:h-[700px] h-[300px] w-full relative" id="hero">
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center md:pb-14 pb-10">
            <h1 className=" text-white font-bold md:text-4xl text-base">
              12 - 13 Agustus 2023
            </h1>
            <h1 className="text-white font-bold md:text-4xl text-base">
              Jln. Dugul, Lampung Timur
            </h1>
          </div>

          <Image
            src="/hero-2.png"
            alt="logo"
            fill={true}
            sizes="100vw"
            priority={true}
          />
        </div>
      </div>
      <div className="relative bg-[#0a6c72] flex flex-col items-center justify-center gap-8 w-full md:pt-10 px-5 md:px-0 md:mt-[620px] mt-[300px]">
        <div className="flex flex-col items-center justify-center gap-4 md:w-2/4 w-full text-white">
          <Image
            src="/hidup-berdampingan.png"
            alt="logo"
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            className="block absolute md:-top-14 -top-16 md:h-[70px] md:w-[250px] h-[50px] w-[200px] rounded-md mb-5"
          />
          <p className="text-center font-medium text-sm md:text-base">
            Semangat kemenangan ada di depan mata, gelora persatuan turut
            menyuarakan asa. Kini saatnya kita kembali, bersama-sama memupuk
            harapan. Bersatu padu menyuarakan kemenangan.
          </p>
          <p className="text-center font-medium text-sm md:text-base">
            Gadjah Fest 2023 mengundang semua pihak untuk bersatu menyuarakan
            semangat juang bersama masyarakat dan alam di sekitar kita. Tahun
            ini, mari saling menginspirasi melalui semangat hidup berdampingan
            antara manusia, satwa, dan lingkungan.
          </p>
        </div>
        <div className="flex flex-wrap md:flex-row items-center justify-center w-full gap-2 pb-10 relative">
          {tBannerImageLink.map((e, i) => (
            <div key={i} className=" bg-[#d9d9d9] rounded-md">
              <Image
                key={i}
                src={`/${e}`}
                alt="logo"
                width="0"
                height="0"
                sizes="100vw"
                priority={true}
                className="block md:h-[280px] md:w-[120px] h-[250px] w-[90px] rounded-md"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
