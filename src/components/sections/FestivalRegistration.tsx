"use client";
// ** Libs
import { useState, useEffect, FC } from "react";
import Image from "next/image";
import { Button, Card, Skeleton, useDisclosure } from "@nextui-org/react";
import { PROJECT_HOST } from "@/config";
import axios from "axios";

// ** Components
import FestivalRegistrationFormModal from "../modals/festival/FestivalRegistrationFormModal";
import RegistrationConfirmationModal from "../modals/RegistrationConfirmationModal";
import RegistrationSuccessModal from "../modals/RegistrationSuccessModal";

// ** Interfaces
import { IBuyerData, IBookingDetailsResponse } from "@/interfaces/_base";
import { ITicketData, IBookingPasses } from "@/interfaces/festival";
import { Ticket } from "@prisma/client";

// ** Enums
import { EQuantityBookingMode } from "@/enums/festival";

interface IComponentProps {
  ticketsList: Ticket[];
}

const defaultBookingPasses: ITicketData = {
  ticketId: "",
  quantity: 0,
};

const skeletonCount = 3;

const FestivalRegistration: FC<IComponentProps> = (props) => {
  // ? NextUI Modal Action for BookingForm (Required to Use Modal)
  const {
    isOpen: isOpenRegistration,
    onOpen: onOpenRegistration,
    onClose: onCloseRegistration,
    onOpenChange: onOpenChangeRegistration,
  } = useDisclosure();
  // ? NextUI Modal Action for Confrmation (Required to Use Modal)
  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onClose: onCloseConfirmation,
    onOpenChange: onOpenChangeConfirmation,
  } = useDisclosure();
  // ? NextUI Modal Action for Success (Required to Use Modal)
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onOpenChange: onOpenChangeSuccess,
  } = useDisclosure();

  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [buyerData, setBuyerData] = useState<IBuyerData | undefined>(undefined);
  const [festivalTicketBooking, setFestivalTicketBooking] = useState<
    IBookingPasses | undefined
  >(undefined);
  const [bookingResponse, setBookingResponse] = useState<
    IBookingDetailsResponse | undefined
  >();

  const bookingQuantityAction = (
    mode: EQuantityBookingMode,
    ticket: Ticket
  ) => {
    if (mode === EQuantityBookingMode.increase) {
      setFestivalTicketBooking((prev) => ({
        ...prev,
        [ticket.name]: {
          ...defaultBookingPasses,
          ticketId: ticket.id,
          quantity:
            (prev?.[ticket.name]?.quantity as number) === undefined
              ? 1
              : (prev?.[ticket.name]?.quantity as number) + 1,
        },
      }));
    } else {
      if (festivalTicketBooking?.[ticket.name]?.quantity === 0) {
        return;
      }
      setFestivalTicketBooking((prev) => ({
        ...prev,
        [ticket.name]: {
          ...defaultBookingPasses,
          ticketId: ticket.id,
          quantity:
            (prev?.[ticket.name]?.quantity as number) === undefined
              ? 1
              : (prev?.[ticket.name]?.quantity as number) - 1,
        },
      }));
    }
  };

  const resetState = () => {
    onOpenSuccess();
    setIsBooking(false);
    onCloseRegistration();
    onCloseConfirmation();
    setBuyerData(undefined);
  };

  const handleTicketBooking = async () => {
    let bookedTicket: ITicketData[] = [];
    try {
      setIsBooking(true);
      if (festivalTicketBooking) {
        Object.entries(festivalTicketBooking).forEach((e) => {
          if (e[1].quantity > 0) {
            bookedTicket.push({
              ticketId: e[1].ticketId,
              quantity: e[1].quantity,
            });
          }
        });
      }

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

      setBookingResponse({
        bookingCode: data.booking.generatedBookingCode,
        invoiceUrl: data.booking.invoiceUrl,
      });

      resetState();

      return;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-center w-full pt-8">
      <FestivalRegistrationFormModal
        isOpen={isOpenRegistration}
        onOpen={onOpenConfirmation}
        onClose={onCloseRegistration}
        onOpenChange={onOpenChangeRegistration}
        isBooking={isBooking}
        buyerData={buyerData}
        setBuyerData={setBuyerData}
      />
      <RegistrationConfirmationModal
        isOpen={isOpenConfirmation}
        onClose={onCloseConfirmation}
        onOpenChange={onOpenChangeConfirmation}
        isBooking={isBooking}
        buyerData={buyerData}
        handleBooking={handleTicketBooking}
      />
      <RegistrationSuccessModal
        isOpen={isOpenSuccess}
        onOpenChange={onOpenChangeSuccess}
        bookingResponse={bookingResponse}
      />
      <div className="flex flex-col items-center gap-8 md:w-3/5 lg:w-3/5 w-full p-2 md:p-0">
        <h1 className="text-lg font-medium">Tiket Festival</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {props.ticketsList.length > 0
            ? props.ticketsList.map((e) => (
                <div
                  key={e.id}
                  className="h-[180px] w-[300px] bg-[#f0c01b] rounded-md flex items-start justify-center p-4 gap-4 flex-col text-[#0a6c72] "
                >
                  <div className="flex flex-row gap-5 items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xs text-[#0a6c72] font-medium">AUG</p>
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
                      onClick={() =>
                        bookingQuantityAction(EQuantityBookingMode.decrease, e)
                      }
                    >
                      -
                    </button>
                    <p>{festivalTicketBooking?.[e.name]?.quantity ?? 0}</p>
                    <button
                      className="bg-[#ffffff] w-[20px] h-[20px] border-2 border-[#0a6c72] flex items-center justify-center"
                      onClick={() =>
                        bookingQuantityAction(EQuantityBookingMode.increase, e)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            : Array(skeletonCount)
                .fill(null)
                .map((_, i) => (
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
        {props.ticketsList.length > 0 && (
          <Button
            isDisabled
            onPress={onOpenRegistration}
            className="bg-[#0a6c72] hover:bg-[#08555a] text-white w-[300px]"
          >
            Checkout
          </Button>
        )}
      </div>
    </div>
  );
};

export default FestivalRegistration;
