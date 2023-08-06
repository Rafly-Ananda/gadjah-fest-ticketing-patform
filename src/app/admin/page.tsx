"use client";
import React, { useState, useEffect } from "react";
import SelfValidateTicketModal from "@/components/selfValidateTicketModal";
import SelfValidateTicketConfirmationModal from "@/components/selfValidateTicketConfirmationModal";
import SelfValidateTicketFinish from "@/components/selfValidateTicketFinish";
import { useDisclosure } from "@nextui-org/react";
import { PROJECT_HOST } from "@/config";
import axios from "axios";

export default function Page() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
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

  const getBookingDetails = async () => {
    if (codeValue !== "G4dj4hf3st2023") {
      setIsCodeError(true);
      return;
    }

    try {
      setisLoading(true);
      const { data } = await axios.post(
        `${PROJECT_HOST}/api/booking/self-checkout/${bookingCode}`
      );

      console.log(data);
      setisLoading(false);
      onClose();
      onCloseConfirmation();
      onOpenFinish();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setBookingCode("");
    setCodeValue("");
    setIsCodeError(false);
    setisLoading(false);
  }, []);

  return (
    <main className="pt-28 md:pt-32">
      <SelfValidateTicketFinish
        isOpen={isOpenFinish}
        onOpenChange={onOpenChangeFinish}
      />
      <SelfValidateTicketModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        bookingCode={bookingCode}
        setBookingCode={setBookingCode}
        onOpenConfirm={onOpenConfirmation}
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
            onClick={onOpen}
          >
            Validasi Tiket
          </button>
        </div>
      </div>
    </main>
  );
}
