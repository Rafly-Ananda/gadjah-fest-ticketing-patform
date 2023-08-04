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

  const router = useRouter();
  const [content, setContent] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [festivalTicket, setFestivalTicket] = useState<Ticket[]>([]);
  const [marathonTicker, setMarathonTicket] = useState<Ticket[]>([]);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [selectedMarathon, setSelectedMarathon] = useState<string>("");
  const [bookingObj, setbookingObj] = useState<BookingDetailsRespond>({
    bookingCode: "",
    invoiceUrl: "",
  });

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
    <main className="flex flex-col items-center justify-center">
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
      <div className="h-[700px] w-full relative brightness-50" id="hero">
        <Image
          src="/marathon-indonesia.jpg"
          alt="logo"
          fill={true}
          sizes="100vw"
          priority={true}
        />
      </div>
      <div className="relative bg-[#0a6c72] flex flex-col items-center justify-center gap-8 w-full pt-10">
        <div className="flex flex-col items-center justify-center gap-4 md:w-2/4 w-full text-white">
          <h1 className="absolute md:text-4xl font-medium md:-top-6 -top-5 text-2xl">
            #HidupBerdampingan
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
        <div className="flex flex-wrap md:flex-row items-center justify-center w-full gap-2 mb-10">
          {content &&
            content.map((e, i) => (
              <div
                key={i}
                className="h-[180px] w-[100px] bg-[#d9d9d9] rounded-md"
              ></div>
            ))}
        </div>
      </div>

      {/* Tiket Festival */}
      <div className="flex items-center justify-center w-full pt-8">
        <div className="flex flex-col items-center gap-8 md:w-3/5 lg:w-3/5 w-full p-2 md:p-0">
          <h1 className="text-lg font-medium">Tiket Festival</h1>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {festivalTicket &&
              festivalTicket.map((e) => (
                <div
                  key={e.id}
                  className="h-[180px] w-[300px] bg-[#d9d9d9] rounded-md flex items-start p-4 gap-4"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs text-[#0a6c72] font-medium">AUG</p>
                    <p className="text-lg font-bold">12</p>
                  </div>

                  <div className="h-full flex flex-col items-start gap-5">
                    <p className="text-xs font-medium">{e.name}</p>
                    {/* <p className="text-xs text-[#6a6a6a]">{e.description}</p> */}
                    <p className="text-xs text-[#6a6a6a]">
                      We will get you directly seated and inside for you to
                      enjoy the show.
                    </p>

                    <div className="flex w-full items-center justify-center gap-2">
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
                </div>
              ))}
          </div>
          {/* <button
            className="bg-[#0a6c72] hover:bg-[#08555a] m-2 p-2 rounded-lg text-white"
            onClick={handleBooking}
          >
            Checkout
          </button> */}
          <Button
            onPress={onOpen}
            className="bg-[#0a6c72] hover:bg-[#08555a] text-white w-[300px]"
          >
            Checkout
          </Button>
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
            {marathonTicker &&
              marathonTicker.map((e, i) => (
                <div
                  key={i}
                  className="h-[180px] w-[300px] bg-[#d9d9d9] rounded-md flex items-start p-4 gap-4"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs text-[#0a6c72] font-medium">KM</p>
                    <p className="text-lg font-bold">{parseInt(e.name)}</p>
                  </div>

                  <div className="h-full flex flex-col items-start gap-5">
                    <p className="text-xs font-medium">{e.name}</p>
                    <p className="text-xs text-[#6a6a6a]">
                      We will get you directly seated and inside for you to
                      enjoy the show.
                    </p>

                    <div className="flex w-full items-center justify-center gap-2">
                      {/* <button
                        className="bg-[#ffffff] text-[#0a6c72] rounded-lg px-2 border border-[#0a6c72] flex items-center justify-center text-xs"
                        onClick={() => router.push(`/marathon/${e.id}`)}
                      >
                        Registrasi
                      </button> */}
                      <Button
                        onPress={() => {
                          onOpenMarathon();
                          setSelectedMarathon(e.id);
                        }}
                        className="bg-[#ffffff] text-[#0a6c72] rounded-lg px-2 border border-[#0a6c72] flex items-center justify-center text-xs"
                      >
                        Registrasi
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Lampung Little Indonesia */}
      <div className="bg-[#f0c01b] flex flex-col items-center justify-center gap-8 mt-8 py-5 w-full">
        <div className="flex flex-col items-center justify-center gap-4 w-full md:w-2/4 text-[#0a6c72]">
          <h1 className="md:text-2xl font-semibold">
            LAMPUNG = LITTLE INDONESIA
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
        <div className="flex flex-wrap items-center justify-center gap-8 w-full md:w-2/4 text-[#0a6c72]">
          {supportedByImageLink.map((e, i) => (
            <div
              className="flex items-center justify-center w-[130px] h-[130px] bg-[#f0c01b] rounded-md"
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
                className="block max-h-[120px] max-w-[120px] w-auto h-auto "
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
