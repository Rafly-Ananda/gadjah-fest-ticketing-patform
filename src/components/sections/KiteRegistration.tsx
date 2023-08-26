"use client";
import { useState, useEffect, FC } from "react";
import Image from "next/image";
import { Button, Card, Skeleton, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { PROJECT_HOST } from "@/config";

// ** Components
import KiteRegistrationFormModal from "../modals/kite/KiteRegistrationFormModal";
import RegistrationConfirmationModal from "../modals/RegistrationConfirmationModal";
import RegistrationSuccessModal from "../modals/RegistrationSuccessModal";

// ** Interfaces
import { Ticket } from "@prisma/client";
import { IBuyerData } from "@/interfaces/_base";
import { IBookingDetailsResponse } from "@/interfaces/_base";

interface IComponentProps {
  ticketsList: Ticket[];
}

const skeletonCount = 2;

const KiteRegistration: FC<IComponentProps> = (props) => {
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

  const [buyerData, setBuyerData] = useState<IBuyerData | undefined>(undefined);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [selectedKiteId, setSelectedKiteId] = useState<string>("");
  const [bookingResponse, setBookingResponse] = useState<
    IBookingDetailsResponse | undefined
  >(undefined);

  const resetState = () => {
    onOpenSuccess();
    setIsBooking(false);
    onCloseRegistration();
    onCloseConfirmation();
    setSelectedKiteId("");
    setBuyerData(undefined);
  };

  const handleKiteRegistration = async () => {
    try {
      setIsBooking(true);
      const bookingPayload = {
        user: {
          ...buyerData,
        },
        details: [{ ticketId: selectedKiteId, quantity: 1 }],
      };

      const { data } = await axios.post(
        `${PROJECT_HOST}/api/booking/kite`,
        bookingPayload
      );

      if (data?.detail === undefined) {
        setBookingResponse({
          bookingCode: data.booking.bookingId,
          invoiceUrl: data.booking.invoiceUrl,
        });
      } else {
        setBookingResponse({
          bookingCode: data.detail.bookingId,
          invoiceUrl: "",
        });
      }

      resetState();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center justify-center w-full pt-5">
      <KiteRegistrationFormModal
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
        handleBooking={handleKiteRegistration}
      />
      <RegistrationSuccessModal
        isOpen={isOpenSuccess}
        onOpenChange={onOpenChangeSuccess}
        bookingResponse={bookingResponse}
      />
      <div className="flex flex-col items-center gap-8 md:w-3/5 lg:w-3/5 w-full p-2 md:p-0">
        <h1 className="text-lg font-medium">Registrasi Layang-Layang</h1>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {props.ticketsList.length > 0
            ? props.ticketsList.map((e, i) => (
                <div
                  key={e.id}
                  className="h-[180px] w-[300px] bg-[#0a6c72] rounded-md flex items-start justify-center p-4 gap-4 flex-col text-white "
                >
                  <div className="flex flex-row gap-5 items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-xs text-white font-medium">AUG</p>
                      {e.name === "Layangan Anak-Anak" ? (
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
                      <p className="text-xs font-bold">{e.name}</p>
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
                      isDisabled
                        onPress={() => {
                          onOpenRegistration();
                          setSelectedKiteId(e.id);
                        }}
                        className="bg-[#ffffff] text-[#0a6c72] rounded-2xl  border border-[#0a6c72] flex items-center justify-center text-xs"
                      >
                        Registrasi
                      </Button>
                    </div>
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
      </div>
    </div>
  );
};

export default KiteRegistration;
