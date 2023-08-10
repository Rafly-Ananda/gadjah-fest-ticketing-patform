"use client";
import Image from "next/image";
import { supportedByImageLink } from "@/statics/statics";

const SupportedBy = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-8 gap-8">
      <h1 className="text-lg font-medium">Supported By</h1>
      <div className="flex flex-wrap items-center justify-center gap-3 w-4/5 md:w-3/5 text-[#0a6c72]">
        {supportedByImageLink.map((e, i) => (
          <div
            className="flex items-center justify-center md:w-[150px] md:h-p[150px] w-[70px] h-[70px] border border-[#f0c01b] rounded-md"
            key={i}
          >
            <Image
              key={i}
              src={`/${e}`}
              alt="logo"
              width="0"
              height="0"
              sizes="100vw"
              priority={true}
              className="block md:max-w-[140px] md:max-h-p[140px] max-h-[60px] max-w-[60px] w-auto h-auto "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportedBy;
