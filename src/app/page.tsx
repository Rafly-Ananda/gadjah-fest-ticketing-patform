"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { PROJECT_HOST } from "@/config";
import { Ticket } from "@prisma/client";
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
import dynamic from "next/dynamic";
import ConfirmationModal from "@/components/confirmationModal";
import FestivalConfirmationModal from "@/components/festivalConfirmationModal";
import KiteRegistrationModal from "@/components/kiteRegistrationModal";
import KiteRegistrationConfirmationModal from "@/components/kiteRegistrationConfirmationModal";

const Map = dynamic(() => import("../components/leafletMap"), {
  ssr: false,
});

const supportedByImageLink = [
  "CoinFolks.png",
  "Drezzo new.png",
  "Gadjah Society Purple.png",
  "IEI.png",
  "Imah arch.jpg",
  "Koperasi PNG.png",
  "KTH Bina Warga.png",
  "KTH Rahayu Jaya_PLVII.jpg",
  "FKGI_merah.jpg",
  "LOGO KUYOUID FONT REV2.png",
  "LOGO MAJA LABS_.png",
  "Logo_Pesona_Indonesia_(Kementerian_Pariwisata).png",
  "NOAH.png",
  "Oxlabs Hitam Horizontal.png",
  "POKDARWIS.jpg",
  "Solar Generation.png",
  "TN Way Kambas.png",
  "SATWA Ecolodges.jpg",
  "Ecosafari.jpg",
  "Logo_ITERA.png",
  "UNU.png",
  "darusalam.png",
  "Logo_UnivLampung.png",
  "braja harjosari.png",
  "bumdes.png",
  "trans api.png",
  "koperasi pl7.png",
  "yekti.png",
  "kencana.png",
  "shelter-baru.png",
  "kopkop.png",
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

interface kiteTicketInterface {
  name: string;
}

export default function Home() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenMarathon,
    onOpen: onOpenMarathon,
    onOpenChange: onOpenChangeMarathon,
    onClose: onCloseMarathon,
  } = useDisclosure();
  const {
    isOpen: isOpenKiteRegistration,
    onOpen: onOpenKiteRegistration,
    onOpenChange: onOpenChangeKiteRegistration,
    onClose: onCloseKiteRegistration,
  } = useDisclosure();
  const {
    isOpen: isOpenKiteRegistrationConfirmation,
    onOpen: onOpenKiteRegistrationConfirmation,
    onOpenChange: onOpenChangeKiteRegistrationConfirmation,
    onClose: onCloseKiteRegistrationConfirmation,
  } = useDisclosure();
  const {
    isOpen: bookingConfirmIsOpen,
    onOpen: bookingConfirmOnOpen,
    onOpenChange: bookingConfirmOnOpenChange,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onOpenChange: onOpenChangeConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmFestival,
    onOpen: onOpenConfirmFestival,
    onOpenChange: onOpenChangeConfirmFestival,
    onClose: onCloseConfirmFestival,
  } = useDisclosure();

  const [festivalTicket, setFestivalTicket] = useState<Ticket[]>([]);
  const [marathonTicker, setMarathonTicket] = useState<Ticket[]>([]);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [selectedMarathon, setSelectedMarathon] = useState<string>("");
  const [selectedKite, setSelectedKite] = useState<string>("");
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

  const [kiteTicketBooking, setKiteTicketBooking] = useState<Ticket[]>([]);

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
        } else if (e.type === "marathon") {
          setMarathonTicket((prev) => [...prev, e]);
        } else {
          setKiteTicketBooking((prev) => [...prev, e]);
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
      onClose();
      onCloseConfirmFestival();
      setBuyerData({
        email: "",
        firstName: "",
        lastName: "",
        mobileNumber: "",
      });
      return;
    } catch (e) {
      console.log(e);
    }
  };

  const handleKiteBooking = async () => {
    try {
      setIsBooking(true);
      const bookingPayload = {
        user: {
          ...buyerData,
        },
        details: [{ ticketId: selectedKite, quantity: 1 }],
      };

      const { data } = await axios.post(
        `${PROJECT_HOST}/api/booking/kite`,
        bookingPayload
      );

      setbookingObj({
        bookingCode: data.booking.generatedBookingCode,
        invoiceUrl: data.booking.invoiceUrl,
      });

      setIsBooking(false);
      bookingConfirmOnOpen();
      setTimeout(() => {
        onCloseKiteRegistrationConfirmation();
        onCloseKiteRegistration();
      }, 500);
      setBuyerData({
        email: "",
        firstName: "",
        lastName: "",
        mobileNumber: "",
      });
      setSelectedKite("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarathonRegistartion = async () => {
    setIsBooking(true);
    try {
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
      bookingConfirmOnOpen();

      setIsBooking(false);
      onCloseMarathon();
      onCloseConfirm();
      setMarathonDetail({
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
      setSelectedMarathon("");
      return;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setKiteTicketBooking([]);
    setFestivalTicket([]);
    setMarathonTicket([]);
    setIsBooking(false);
    setSelectedMarathon("");
    setbookingObj({
      bookingCode: "",
      invoiceUrl: "",
    });
    setFestivalTicketBooking({
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
    setBuyerData({
      email: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
    });
    setMarathonDetail({
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
    fetchAllTicket();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center relative">
      <FestivalConfirmationModal
        isOpen={isOpenConfirmFestival}
        onOpenChange={onOpenChangeConfirmFestival}
        onClose={onCloseConfirmFestival}
        handleFestivalBooking={handleBooking}
        buyerData={buyerData}
        isBooking={isBooking}
      />
      <ConfirmationModal
        isOpen={isOpenConfirm}
        onOpenChange={onOpenChangeConfirm}
        onClose={onCloseConfirm}
        handleMarathonBooking={handleMarathonRegistartion}
        isBooking={isBooking}
      />
      <CheckoutModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        buyerData={buyerData}
        setBuyerData={setBuyerData}
        handleBooking={handleBooking}
        isBooking={isBooking}
        onClose={onClose}
        onOpenConfirm={onOpenConfirmFestival}
      />
      <MarathonRegistrationModal
        isOpen={isOpenMarathon}
        onOpenChange={onOpenChangeMarathon}
        marathonDetail={marathonDetail}
        setMarathonDetail={setMarathonDetail}
        handleBooking={handleMarathonRegistartion}
        isBooking={isBooking}
        onClose={onCloseMarathon}
        onOpenConfirm={onOpenConfirm}
      />
      <KiteRegistrationModal
        isOpen={isOpenKiteRegistration}
        onOpenChange={onOpenChangeKiteRegistration}
        buyerData={buyerData}
        setBuyerData={setBuyerData}
        isBooking={isBooking}
        onClose={onCloseKiteRegistration}
        onOpenConfirm={onOpenChangeKiteRegistrationConfirmation}
      />
      <KiteRegistrationConfirmationModal
        isOpen={isOpenKiteRegistrationConfirmation}
        onOpenChange={onOpenChangeKiteRegistrationConfirmation}
        isBooking={isBooking}
        onClose={onCloseKiteRegistrationConfirmation}
        buyerData={buyerData}
        handleKiteBooking={handleKiteBooking}
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
                              className="block w-[35px] h-[15px]"
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

      {/* Registrasi Layang-layang */}
      <div className="flex items-center justify-center w-full pt-5">
        <div className="flex flex-col items-center gap-8 md:w-3/5 lg:w-3/5 w-full p-2 md:p-0">
          <h1 className="text-lg font-medium">Registrasi Layang-Layang</h1>

          {/* <div className=" flex flex-col items-center justify-center">
            <h2 className="text-xs">TANGGAL LOMBA</h2>
            <h2 className="font-semibold flex items-center gap-1">
              Sabtu, <span className="text-3xl">12 - 13</span> Agustus 2023
            </h2>
          </div> */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            {kiteTicketBooking.length > 0
              ? kiteTicketBooking.map((e, i) => (
                  <div
                    key={e.id}
                    className="h-[180px] w-[300px] bg-[#0a6c72] rounded-md flex items-start justify-center p-4 gap-4 flex-col text-white "
                  >
                    <div className="flex flex-row gap-5 items-center justify-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-xs text-white font-medium">AUG</p>
                        {e.name === "Anak-Anak" ? (
                          <p className="text-lg font-bold">12</p>
                        ) : (
                          <div className="text-lg font-bold">
                            <p>12</p>
                            <div className="h-[2px] w-full bg-white"></div>
                            <p>13</p>
                          </div>
                        )}
                      </div>

                      <div className="h-full flex flex-col items-start">
                        <p className="text-xs font-bold">
                          Layang-layang {e.name}
                        </p>
                        <div className="flex w-full gap-2">
                          {e.price === 0 ? (
                            <p className="text-xs font-semibold">Gratis</p>
                          ) : (
                            <p className="text-xs font-semibold">
                              RP {e.price.toString().slice(0, 2)}.
                              {e.price.toString().slice(2)},-
                            </p>
                          )}

                          {e.name === "Day One and Two Bundle Pass" && (
                            <Image
                              src="/hot-deals.png"
                              alt="logo"
                              width="0"
                              height="0"
                              sizes="100vw"
                              priority={true}
                              className="block w-[35px] h-[15px]"
                            />
                          )}
                        </div>

                        <p className="text-xs">{e.description}</p>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-center gap-2">
                      <div className="flex w-full items-center justify-center gap-2">
                        <Button
                          onPress={() => {
                            onOpenKiteRegistration();
                            setSelectedKite(e.id);
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
                          RP {e.price.toString().slice(0, 2)}.
                          {e.price.toString().slice(2)},-
                        </p>
                        <p className="text-xs text-white">{e.description}</p>
                      </div>
                    </div>

                    {e.name === "7 Km Marathon Pass" ? (
                      <Image
                        src="/7 Km Range Marathon Pass.png"
                        alt="logo"
                        width="0"
                        height="0"
                        sizes="100vw"
                        priority={true}
                        className="block w-[100px] h-[100px]"
                      />
                    ) : (
                      <Image
                        src="/21 Km Range Marathon Pass.png"
                        alt="logo"
                        width="0"
                        height="0"
                        sizes="100vw"
                        priority={true}
                        className="block w-[100px] h-[100px]"
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
            menyuarakan ketangguhan yang telah kita tunjukkan di tempat yang
            mana banyak suku, budaya, dan ras berkumpul menjadi satu.
          </p>
        </div>
      </div>

      {/* Supported By */}
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
    </main>
  );
}
