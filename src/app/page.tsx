"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { PROJECT_HOST } from "@/config";
import { Ticket } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button, useDisclosure } from "@nextui-org/react";
import CheckoutModal from "@/components/checkoutModal";
import MarathonRegistrationModal from "@/components/marthonRegistrationModal";
import {
  buyerDataType,
  bookingTicketPayload,
  MarathonDetailType,
} from "@/interfaces";
import BookingConfirmationModal from "@/components/bookingConfirmationModal";
import { Card, Skeleton } from "@nextui-org/react";

const supportedByImageLink = [
  "CoinFolks.png",
  "DREZZO LOGO_CLEAR BACKGROUND.png",
  "Gadjah Society Purple.png",
  "IEI.png",
  "Imah arch.jpg",
  "Koperasi PNG.png",
  "KTH Bina Warga.png",
  "KTH Rahayu Jaya_PLVII.jpg",
  "Liman Wana Asri_LRVI.png",
  "Logo FKGI_Vector Remake-03.png",
  "LOGO KUYOUID FONT REV2.png",
  "LOGO MAJA LABS_.png",
  "Logo_Pesona_Indonesia_(Kementerian_Pariwisata).png",
  "NOAH.png",
  "OXLABS.png",
  "POKDARWIS.jpg",
  "Solar Generation.png",
  "TN Way Kambas.png",
];

const tBanner = [
  "tbanner1.png",
  "tbanner2.png",
  "tbanner3.png",
  "tbanner4.png",
  "tbanner5.png",
  "tbanner6.png",
  "tbanner7.png",
  "tbanner8.png",
  "tbanner9.png",
];

interface BookingDetailsRespond {
  invoiceUrl: string;
  bookingCode: string;
}

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenMarathon,
    onOpen: onOpenMarathon,
    onOpenChange: onOpenChangeMarathon,
  } = useDisclosure();
  const {
    isOpen: bookingConfirmIsOpen,
    onOpen: bookingConfirmOnOpen,
    onOpenChange: bookingConfirmOnOpenChange,
  } = useDisclosure();

  const [festivalTicket, setFestivalTicket] = useState<Ticket[]>([]);
  const [marathonTicker, setMarathonTicket] = useState<Ticket[]>([]);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [selectedMarathon, setSelectedMarathon] = useState<string>("");
  const [bookingObj, setbookingObj] = useState<BookingDetailsRespond>({
    bookingCode: "",
    invoiceUrl: "",
  });
  const items = [1, 2, 3];

  const [festivalTicketBooking, setFestivalTicketBooking] = useState({
    dayOnePass: {
      id: "",
      quantity: 0,
    },
    dayTwoPass: {
      id: "",
      quantity: 0,
    },
    budlePass: {
      id: "",
      quantity: 0,
    },
  });

  const [buyerData, setBuyerData] = useState<buyerDataType>({
    email: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
  });

  const [marathonDetail, setMarathonDetail] = useState<MarathonDetailType>({
    user: {
      email: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      gender: "",
      marathonSkill: "",
    },
    contactInformation: {
      email: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
    },
    additionalInformation: "",
  });

  const addBookingQuantity = async (ticket: Ticket) => {
    if (ticket.name === "Day One Pass") {
      setFestivalTicketBooking((prev) => ({
        ...prev,
        dayOnePass: {
          ...prev.dayOnePass,
          quantity: prev.dayOnePass.quantity + 1,
        },
      }));
    }

    if (ticket.name === "Day Two Pass") {
      setFestivalTicketBooking((prev) => ({
        ...prev,
        dayTwoPass: {
          ...prev.dayTwoPass,
          quantity: prev.dayTwoPass.quantity + 1,
        },
      }));
    }

    if (ticket.name === "Day One and Two Bundle Pass") {
      setFestivalTicketBooking((prev) => ({
        ...prev,
        budlePass: {
          ...prev.budlePass,
          quantity: prev.budlePass.quantity + 1,
        },
      }));
    }
  };

  const decreaseBookingQuantity = async (ticket: Ticket) => {
    if (ticket.name === "Day One Pass") {
      setFestivalTicketBooking((prev) => ({
        ...prev,
        dayOnePass: {
          ...prev.dayOnePass,
          quantity:
            prev.dayOnePass.quantity === 0 ? 0 : prev.dayOnePass.quantity - 1,
        },
      }));
    }

    if (ticket.name === "Day Two Pass") {
      setFestivalTicketBooking((prev) => ({
        ...prev,
        dayTwoPass: {
          ...prev.dayTwoPass,
          quantity:
            prev.dayTwoPass.quantity === 0 ? 0 : prev.dayTwoPass.quantity - 1,
        },
      }));
    }

    if (ticket.name === "Day One and Two Bundle Pass") {
      setFestivalTicketBooking((prev) => ({
        ...prev,
        budlePass: {
          ...prev.budlePass,
          quantity:
            prev.budlePass.quantity === 0 ? 0 : prev.budlePass.quantity - 1,
        },
      }));
    }
  };

  const fetchAllTicket = async () => {
    try {
      const tickets = await axios.get(`${PROJECT_HOST}/api/tickets`);

      tickets.data.forEach((e: Ticket) => {
        if (e.type === "festival") {
          setFestivalTicket((prev) => [...prev, e]);
          setFestivalTicketBooking((prev) => {
            if (e.name === "Day One Pass") {
              return { ...prev, dayOnePass: { id: e.id, quantity: 0 } };
            } else if (e.name === "Day Two Pass") {
              return { ...prev, dayTwoPass: { id: e.id, quantity: 0 } };
            } else {
              return { ...prev, budlePass: { id: e.id, quantity: 0 } };
            }
          });
        } else {
          setMarathonTicket((prev) => [...prev, e]);
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      let bookedTicket: bookingTicketPayload[] = [];
      Object.entries(festivalTicketBooking).forEach((e) => {
        if (e[1].quantity > 0) {
          bookedTicket.push({ ticketId: e[1].id, quantity: e[1].quantity });
        }
      });

      const bookingPayload = {
        user: {
          ...buyerData,
        },
        details: [...bookedTicket],
      };

      const { data } = await axios.post(
        `${PROJECT_HOST}/api/booking`,
        bookingPayload
      );

      setbookingObj({
        bookingCode: data.booking.generatedBookingCode,
        invoiceUrl: data.booking.invoiceUrl,
      });
      bookingConfirmOnOpen();

      setIsBooking(false);

      return;
    } catch (e) {
      console.log(e);
    }
  };

  const handleMarathonRegistartion = async () => {
    setIsBooking(true);

    const bookingPayload = {
      user: {
        ...marathonDetail,
      },
      details: [{ ticketId: selectedMarathon, quantity: 1 }],
    };

    const { data } = await axios.post(
      `${PROJECT_HOST}/api/booking/marathon`,
      bookingPayload
    );

    setbookingObj({
      bookingCode: data.booking.generatedBookingCode,
      invoiceUrl: data.booking.invoiceUrl,
    });

    setIsBooking(false);
    return;
  };

  useEffect(() => {
    fetchAllTicket();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center relative">
      <CheckoutModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        buyerData={buyerData}
        setBuyerData={setBuyerData}
        handleBooking={handleBooking}
        isBooking={isBooking}
      />
      <MarathonRegistrationModal
        isOpen={isOpenMarathon}
        onOpenChange={onOpenChangeMarathon}
        marathonDetail={marathonDetail}
        setMarathonDetail={setMarathonDetail}
        handleBooking={handleMarathonRegistartion}
        isBooking={isBooking}
      />
      <BookingConfirmationModal
        isOpen={bookingConfirmIsOpen}
        onOpenChange={bookingConfirmOnOpenChange}
        bookingObj={bookingObj}
      />
      <div className="absolute inset-0">
        <div className="md:h-[700px] h-[300px] w-full relative" id="hero">
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center md:pb-14 pb-10">
            <h1 className=" text-white font-bold md:text-4xl text-base">
              12 - 13 Agustus 2023
            </h1>
            <h1 className="text-white font-bold md:text-4xl text-base">
              Jl. Dugul, Lampung Timur
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
          {tBanner &&
            tBanner.map((e, i) => (
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

      {/* Tiket Festival */}
      <div className="flex items-center justify-center w-full pt-8">
        <div className="flex flex-col items-center gap-8 md:w-3/5 lg:w-3/5 w-full p-2 md:p-0">
          <h1 className="text-lg font-medium">Tiket Festival</h1>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {festivalTicket.length > 0
              ? festivalTicket.map((e) => (
                  <div
                    key={e.id}
                    className="h-[180px] w-[300px] bg-[#f0c01b] rounded-md flex items-start justify-center p-4 gap-4 flex-col text-[#0a6c72] "
                  >
                    <div className="flex flex-row gap-5 items-center justify-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-xs text-[#0a6c72] font-medium">
                          AUG
                        </p>
                        {e.name === "Day One Pass" ? (
                          <p className="text-lg font-bold">12</p>
                        ) : e.name === "Day Two Pass" ? (
                          <p className="text-lg font-bold">13</p>
                        ) : (
                          <div className="text-lg font-bold">
                            <p>12</p>
                            <div className="h-[2px] w-full bg-[#0a6c72]"></div>
                            <p>13</p>
                          </div>
                        )}
                      </div>

                      <div className="h-full flex flex-col items-start">
                        <p className="text-xs font-bold">
                          {e.name === "Day One Pass"
                            ? "Hari Pertama"
                            : e.name === "Day Two Pass"
                            ? "Hari kedua"
                            : "Paket Hari Pertama & Kedua"}
                        </p>
                        <div className="flex w-full gap-2">
                          <p className="text-xs font-semibold">
                            RP {e.price.toString().slice(0, 2)}.
                            {e.price.toString().slice(2)},-
                          </p>
                          {e.name === "Day One and Two Bundle Pass" && (
                            <Image
                              src="/hot-deals.png"
                              alt="logo"
                              width="0"
                              height="0"
                              sizes="100vw"
                              priority={true}
                              className="block w-auto h-auto"
                            />
                          )}
                        </div>

                        <p className="text-xs">{e.description}</p>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-center gap-2 z-40">
                      <button
                        className="bg-[#ffffff] w-[20px] h-[20px] border-2 border-[#0a6c72] flex items-center justify-center"
                        onClick={() => decreaseBookingQuantity(e)}
                      >
                        -
                      </button>
                      <p>
                        {e.name === "Day One Pass"
                          ? festivalTicketBooking.dayOnePass.quantity
                          : e.name === "Day Two Pass"
                          ? festivalTicketBooking.dayTwoPass.quantity
                          : festivalTicketBooking.budlePass.quantity}
                      </p>
                      <button
                        className="bg-[#ffffff] w-[20px] h-[20px] border-2 border-[#0a6c72] flex items-center justify-center"
                        onClick={() => addBookingQuantity(e)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              : items.map((e, i) => (
                  <Card
                    key={i}
                    className="h-[180px] w-[300px] bg-[#d9d9d9] space-y-5 p-4"
                  >
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <div className="space-y-3">
                      <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                      <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                      <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                      </Skeleton>
                    </div>
                  </Card>
                ))}
          </div>
          {festivalTicket.length > 0 && (
            <Button
              onPress={onOpen}
              className="bg-[#0a6c72] hover:bg-[#08555a] text-white w-[300px]"
            >
              Checkout
            </Button>
          )}
        </div>
      </div>

      {/* Registrasi Marathon */}
      <div className="flex items-center justify-center w-full pt-5">
        <div className="flex flex-col items-center gap-8 md:w-3/5 lg:w-3/5 w-full p-2 md:p-0">
          <h1 className="text-lg font-medium">Registrasi Marathon</h1>

          <div className=" flex flex-col items-center justify-center">
            <h2 className="text-xs">TANGGAL LOMBA</h2>
            <h2 className="font-semibold flex items-center gap-1">
              Sabtu, <span className="text-3xl">12</span> Agustus 2023
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {marathonTicker.length > 0
              ? marathonTicker.map((e, i) => (
                  <div
                    key={e.id}
                    className="h-[250px] w-[350px] bg-[#0a6c72] text-white rounded-md flex items-center justify-center p-4 gap-4 flex-col "
                  >
                    <div className="flex flex-row gap-5 items-center justify-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-xs text-white font-medium">KM</p>
                        <p className="text-lg font-bold">{parseInt(e.name)}</p>
                      </div>

                      <div className="h-full flex flex-col items-start">
                        <p className="text-xs font-medium">
                          RP {e.price.toString().slice(0, 3)}.
                          {e.price.toString().slice(3)},-
                        </p>
                        <p className="text-xs text-white">{e.description}</p>
                      </div>
                    </div>

                    {e.name === "7 Km Marathon Pass" ? (
                      <Image
                        src="/7 Km Marathon Pass.png"
                        alt="logo"
                        width="0"
                        height="0"
                        sizes="100vw"
                        priority={true}
                        className="block w-auto h-auto"
                      />
                    ) : (
                      <Image
                        src="/21 Km Marathon Pass.png"
                        alt="logo"
                        width="0"
                        height="0"
                        sizes="100vw"
                        priority={true}
                        className="block w-auto h-auto"
                      />
                    )}

                    <div className="flex w-full items-center justify-center gap-2">
                      <div className="flex w-full items-center justify-center gap-2">
                        <Button
                          onPress={() => {
                            onOpenMarathon();
                            setSelectedMarathon(e.id);
                          }}
                          className="bg-[#ffffff] text-[#0a6c72] rounded-2xl  border border-[#0a6c72] flex items-center justify-center text-xs"
                        >
                          Registrasi
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              : items.map((e, i) => (
                  <Card
                    key={i}
                    className="h-[180px] w-[300px] bg-[#d9d9d9] space-y-5 p-4"
                  >
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <div className="space-y-3">
                      <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                      <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                      </Skeleton>
                      <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                      </Skeleton>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      </div>

      {/* Lampung Little Indonesia */}
      <div className="bg-[#f0c01b] flex flex-col items-center justify-center gap-8 mt-8 w-full py-5 px-5 md:px-0">
        <div className="flex flex-col items-center justify-center gap-4 w-full md:w-2/4 text-[#0a6c72]">
          <h1 className="md:text-2xl font-semibold">
            Lampung = Little Indonesia
          </h1>
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
      </div>

      {/* Supported By */}
      <div className="flex flex-col items-center justify-center mt-8 gap-8">
        <h1 className="text-lg font-medium">Supported By</h1>
        <div className="flex flex-wrap items-center justify-center gap-3 w-4/5 md:w-2/4 text-[#0a6c72]">
          {supportedByImageLink.map((e, i) => (
            <div
              className="flex items-center justify-center md:w-[130px] md:h-p[130px] w-[70px] h-[70px] bg-[#f0c01b] rounded-md"
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
                className="block md:max-w-[120px] md:max-h-p[120px] max-h-[60px] max-w-[60px] w-auto h-auto "
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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

          <div className="flex flex-col items-center justify-center gap-1 ">
            <h1 className="text-white font-semibold md:text-sm text-xs">
              HUBUNGI KAMI
            </h1>
            <p className="text-[#818181] md:text-sm text-xs">
              info@gadjahfest.com
            </p>
            <div className="flex gap-2">
              <Image
                src="/facebook.png"
                alt="logo"
                width="10"
                height="10"
                sizes="100vw"
                priority={true}
                className="w-auto h-auto"
              />
              <Image
                src="/instagram.png"
                alt="logo"
                width="14"
                height="14"
                sizes="100vw"
                priority={true}
                className="w-auto h-auto"
              />
            </div>
          </div>
        </div>

        <div className="w-full bg-[#000000] p-4 flex items-center justify-center">
          <h1 className="text-[#808080] md:text-sm text-xs font-semibold ">
            GADJAHFEST2023 - #HIDUPBERDAMPINGAN
          </h1>
        </div>
      </footer>
    </main>
  );
}
