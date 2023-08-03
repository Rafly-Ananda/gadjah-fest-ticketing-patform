"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { PROJECT_HOST } from "@/config";
import { Ticket } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button, useDisclosure } from "@nextui-org/react";
import CheckoutModal from "@/components/checkoutModal";
import { buyerDataType, bookingTicketPayload } from "@/interfaces";

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [content, setContent] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [festivalTicket, setFestivalTicket] = useState<Ticket[]>([]);
  const [marathonTicker, setMarathonTicket] = useState<Ticket[]>([]);
  const [supportedBy, setSupportedBy] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const [isBooking, setIsBooking] = useState<boolean>(false);

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

    const booking = await axios.post(`${PROJECT_HOST}`, bookingPayload);

    setIsBooking(false);

    console.log(booking);

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
      <div className="h-[400px]">{/* gambar kesini */}</div>
      <div className="bg-[#0a6c72] flex flex-col items-center justify-center gap-8 w-full">
        <div className="flex flex-col items-center justify-center gap-4 w-2/4 text-white">
          <h1 className="text-2xl font-semibold">#HidupBerdampingan</h1>
          <p className="text-center font-medium">
            Semangat kemenangan ada di depan mata, gelora persatuan turut
            menyuarakan asa. Kini saatnya kita kembali, bersama-sama memupuk
            harapan. Bersatu padu menyuarakan kemenangan.
          </p>
          <p className="text-center font-medium">
            Gadjah Fest 2023 mengundang semua pihak untuk bersatu menyuarakan
            semangat juang bersama masyarakat dan alam di sekitar kita. Tahun
            ini, mari saling menginspirasi melalui semangat hidup berdampingan
            antara manusia, satwa, dan lingkungan.
          </p>
        </div>
        <div className="flex items-center justify-center w-full gap-2 mb-10">
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
        <div className="flex flex-col gap-8  w-3/5">
          <h1 className="text-lg font-medium">Tiket Festival</h1>
          <div className="flex flex-row gap-4 items-center justify-center">
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
            className="bg-[#0a6c72] hover:bg-[#08555a] text-white"
          >
            Checkout
          </Button>
        </div>
      </div>

      {/* Registrasi Marathon */}
      <div className="flex items-center justify-center w-full pt-5">
        <div className="flex flex-col gap-8  w-3/5">
          <h1 className="text-lg font-medium">Registrasi Marathon</h1>

          <div className=" flex flex-col items-center justify-center">
            <h2 className="text-xs">TANGGAL LOMBA</h2>
            <h2 className="font-semibold flex items-center gap-1">
              Sabtu, <span className="text-3xl">12</span> Agustus 2023
            </h2>
          </div>
          <div className="flex flex-row gap-4 items-center justify-center">
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
                      <button
                        className="bg-[#ffffff] text-[#0a6c72] rounded-lg px-2 border border-[#0a6c72] flex items-center justify-center text-xs"
                        onClick={() => router.push(`/marathon/${e.id}`)}
                      >
                        Registrasi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Lampung Little Indonesia */}
      <div className="bg-[#f0c01b] flex flex-col items-center justify-center gap-8 mt-8 py-5 w-full">
        <div className="flex flex-col items-center justify-center gap-4 w-2/4 text-[#0a6c72]">
          <h1 className="text-2xl font-semibold">LAMPUNG = LITTLE INDONESIA</h1>
          <p className="text-center font-medium">
            Semangat kemenangan ada di depan mata, gelora persatuan turut
            menyuarakan asa. Kini saatnya kita kembali, bersama-sama memupuk
            harapan. Bersatu padu menyuarakan kemenangan.
          </p>
          <p className="text-center font-medium">
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
        <div className="flex flex-wrap items-center justify-center gap-8 w-2/4 text-[#0a6c72]">
          {supportedBy &&
            supportedBy.map((e, i) => (
              <div key={i} className="bg-[#d9d9d9] h-[120px] w-[120px]"></div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#222222] mt-8 w-full flex flex-col  items-center">
        <div className="flex items-center justify-between w-3/5 p-5">
          <Image
            src="/footer_logo.png"
            alt="logo"
            width="0"
            height="0"
            sizes="100vw"
            priority={true}
            className="h-auto w-[100px]"
          />

          <div className="flex flex-col gap-1">
            <h1 className="text-white font-semibold text-">HUBUNGI KAMI</h1>
            <p className="text-[#818181] text-sm">info@gadjahfest.com</p>
            <div className="flex gap-2">
              <Image
                src="/facebook.png"
                alt="logo"
                width="8"
                height="8"
                sizes="100vw"
                priority={true}
                className="w-auto h-auto"
              />
              <Image
                src="/instagram.png"
                alt="logo"
                width="12"
                height="12"
                sizes="100vw"
                priority={true}
                className="w-auto h-auto"
              />
            </div>
          </div>
        </div>

        <div className="w-full bg-[#000000] p-4 flex items-center justify-center">
          <h1 className="text-[#808080] text-sm font-semibold ">
            GADJAHFEST2023 - #HIDUPBERDAMPINGAN
          </h1>
        </div>
      </footer>
    </main>
  );
}
