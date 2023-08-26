"use client";
// ** Libs
import axios from "axios";
import { PROJECT_HOST } from "@/config";
import { useState, useEffect, FC } from "react";
import { MarathonDetail, Ticket } from "@prisma/client";
import Image from "next/image";
import { Button, Card, Skeleton, useDisclosure } from "@nextui-org/react";

// ** Components
import MarathonRegistrationFormModal from "../modals/marathon/MarathonRegistrationFormModal";
import RegistrationConfirmationModal from "../modals/RegistrationConfirmationModal";
import RegistrationSuccessModal from "../modals/RegistrationSuccessModal";

// ** Interfaces
import { IBookingDetailsResponse } from "@/interfaces/_base";
import { IMarathonDetailData } from "@/interfaces/marathon";

interface IComponentProps {
  ticketsList: Ticket[];
}

const defaultMarathonDetail: IMarathonDetailData = {
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
};

const skeletonCount = 3;

const MarathonRegistration: FC<IComponentProps> = (props) => {
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
  const [selectedMarathonId, setSelectedMarathonId] = useState<string>("");
  const [bookingResponse, setBookingResponse] = useState<
    IBookingDetailsResponse | undefined
  >();
  const [marathonDetail, setMarathonDetail] = useState<
    IMarathonDetailData | undefined
  >({ ...defaultMarathonDetail });

  const resetState = () => {
    setIsBooking(false);
    onOpenSuccess();
    setMarathonDetail({ ...defaultMarathonDetail });
    setSelectedMarathonId("");
    onCloseConfirmation();
    onCloseRegistration();
  };

  const handleMarathonRegistration = async () => {
    try {
      setIsBooking(true);
      const bookingPayload = {
        user: {
          ...marathonDetail,
        },
        details: [{ ticketId: selectedMarathonId, quantity: 1 }],
      };

      const { data } = await axios.post(
        `${PROJECT_HOST}/api/booking/marathon`,
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

  return (
    <div className="flex items-center justify-center w-full pt-5">
      <MarathonRegistrationFormModal
        isOpen={isOpenRegistration}
        onClose={onCloseRegistration}
        onOpen={onOpenConfirmation}
        onOpenChange={onOpenChangeRegistration}
        marathonDetail={marathonDetail}
        setMarathonDetail={setMarathonDetail}
        isBooking={isBooking}
      />
      <RegistrationConfirmationModal
        isOpen={isOpenConfirmation}
        onClose={onCloseConfirmation}
        onOpenChange={onOpenChangeConfirmation}
        isBooking={isBooking}
        handleBooking={handleMarathonRegistration}
      />
      <RegistrationSuccessModal
        isOpen={isOpenSuccess}
        onOpenChange={onOpenChangeSuccess}
        bookingResponse={bookingResponse}
      />
      <div className="flex flex-col items-center gap-8 md:w-3/5 lg:w-3/5 w-full p-2 md:p-0">
        <h1 className="text-lg font-medium">Registrasi Marathon</h1>
        <div className=" flex flex-col items-center justify-center">
          <h2 className="text-xs">TANGGAL LOMBA</h2>
          <h2 className="font-semibold flex items-center gap-1">
            Sabtu, <span className="text-3xl">12</span> Agustus 2023
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          {props.ticketsList.length > 0
            ? props.ticketsList.map((e, i) => (
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
                      isDisabled
                        onPress={() => {
                          setSelectedMarathonId(e.id);
                          onOpenRegistration();
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
        RegistrationSuccessModal
      </div>
    </div>
  );
};

export default MarathonRegistration;
