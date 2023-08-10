"use client";

// ** Libs
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@nextui-org/react";
import { PROJECT_HOST } from "@/config";
import axios from "axios";

// ** Components
import SelfValidateTicketFormModal from "@/components/modals/validate/SelfValidateTicketFormModal";
import SelfValidateTicketConfirmationModal from "@/components/modals/validate/SelfValidateTicketConfirmationModal";
import SelfValidateTicketSuccessModal from "@/components/modals/validate/SelfValidateTicketSuccessModal";

export default function Page() {
  const {
    isOpen: isOpenValidate,
    onOpen: onOpenValidate,
    onClose: onCloseValidate,
    onOpenChange: onOpenChangeValidate,
  } = useDisclosure();
  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onClose: onCloseConfirmation,
    onOpenChange: onOpenChangeConfirmation,
  } = useDisclosure();
  const {
    isOpen: isOpenFinish,
    onOpen: onOpenFinish,
    onOpenChange: onOpenChangeFinish,
  } = useDisclosure();

  const [bookingCode, setBookingCode] = useState<string>("");
  const [isCodeError, setIsCodeError] = useState<boolean>(false);
  const [codeValue, setCodeValue] = useState<string>("");
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const getBookingDetails = async () => {
    setMessage("");
    if (codeValue !== "G4dj4hf3st2023") {
      setIsCodeError(true);
      return;
    }

    try {
      setisLoading(true);
      const { data } = await axios.post(
        `${PROJECT_HOST}/api/booking/self-checkout/${bookingCode}`
      );

      if (data.message === "Booking not found") {
        setMessage(`Booking dengan id ${bookingCode} tidak ditemukan.`);
        setisLoading(false);
        onCloseConfirmation();
        return;
      }

      if (data.message === "Booking already paid, skipping ticket generation") {
        setMessage(`Booking dengan id ${bookingCode} sudah di validasi.`);
        setisLoading(false);
        onCloseConfirmation();
        return;
      }

      setisLoading(false);
      onCloseValidate();
      onCloseConfirmation();
      onOpenFinish();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setMessage("");
    setBookingCode("");
    setCodeValue("");
    setIsCodeError(false);
    setisLoading(false);
  }, []);

  return (
    <main className="pt-28 md:pt-32">
      <SelfValidateTicketFormModal
        isOpen={isOpenValidate}
        onClose={onCloseValidate}
        onOpenChange={onOpenChangeValidate}
        bookingCode={bookingCode}
        setBookingCode={setBookingCode}
        onOpenConfirm={onOpenConfirmation}
        message={message}
      />

      <SelfValidateTicketSuccessModal
        isOpen={isOpenFinish}
        onOpenChange={onOpenChangeFinish}
      />

      <SelfValidateTicketConfirmationModal
        isOpen={isOpenConfirmation}
        onClose={onCloseConfirmation}
        onOpenChange={onOpenChangeConfirmation}
        codeValue={codeValue}
        setCodeValue={setCodeValue}
        isCodeError={isCodeError}
        validateBookingAction={getBookingDetails}
        isLoading={isLoading}
      />
      <div className="flex flex-col gap-4 items-center justify-center pt-2">
        <div className="w-3/4 flex items-center justify-center border border-[#0a6c72] p-16 rounded-lg">
          <button
            className=" rounded-lg bg-[#0a6c72] w-fit h-fit p-4 text-xs font-medium
    tracking-widest text-white"
            onClick={onOpenValidate}
          >
            Validasi Tiket
          </button>
        </div>
      </div>
    </main>
  );
}
