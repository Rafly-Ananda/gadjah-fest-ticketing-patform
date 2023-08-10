"use client";
import Image from "next/image";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../LeafletMap"), {
  ssr: false,
});

const LampungLittleIndonesia = () => {
  return (
    <div className="relative bg-[#f0c01b] flex md:flex-row flex-col items-center justify-center gap-8 mt-32 w-full md:h-[400px] py-5 px-5 md:px-0">
      <div className="flex flex-col md:items-start items-center  justify-center gap-4 w-full md:w-2/4 text-[#0a6c72] md:pl-40 pt-28 md:pt-0 z-0">
        <h1 className="md:text-2xl font-semibold">
          Lampung = Little Indonesia
        </h1>

        <Map />

        <a href="https://www.google.com/maps/place/Gadjah+Fest/@-5.182838,105.78751,15z/data=!4m2!3m1!1s0x0:0xcfd1f46ae0bb31ec?sa=X&ved=2ahUKEwiKq8jz1sOAAxXpa2wGHSpTDbsQ_BJ6BAhDEAA&ved=2ahUKEwiKq8jz1sOAAxXpa2wGHSpTDbsQ_BJ6BAhNEAM">
          <p className="text-sm font-semibold underline">
            Lokasi: Jln Dugul, Desa Braja Harjosari, Lampung Timur
          </p>
        </a>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 w-full md:w-2/4 text-[#0a6c72] md:pr-24 md:pt-24">
        <Image
          src="/icon-rumah.png"
          alt="logo"
          width="0"
          height="0"
          sizes="100vw"
          priority={true}
          className="block absolute md:-top-24 md:right-1 -top-16 md:h-[250px] md:w-[300px] h-[200px] w-[200px] rounded-md mb-5"
        />
        <p className="md:text-left text-center font-medium text-sm md:text-base">
          Tahun ini menjadi saksi bahwa Lampung mampu bangkit dari segala
          tantangan. Perjuangan ini tidak luput dari peran semangat satu sama
          lain yang saling menginspirasi.
        </p>
        <p className="md:text-left text-center font-medium text-sm md:text-base">
          Gadjah Fest 2023 mengundang kalian para pejuang, untuk merayakan dan
          menyuarakan ketangguhan yang telah kita tunjukkan di tempat yang mana
          banyak suku, budaya, dan ras berkumpul menjadi satu.
        </p>
      </div>
    </div>
  );
};

export default LampungLittleIndonesia;
