"use client";
import { useState, useEffect } from "react";
import { PROJECT_HOST } from "@/config";
import axios from "axios";
import ValidateTicketModal from "@/components/validateTicketModal";
import TicketActivationConfirmationModal from "@/components/ticketActivationConfirmationModal";
import { useDisclosure } from "@nextui-org/react";
import { Booking, PurchasedTicket } from "@prisma/client";

interface validateAPIResponseType {
  status: string;
  message: string;
  activationDate?: string;
  data: APIResponseData;
}

interface APIResponseData extends PurchasedTicket {
  booking: Booking;
}

const Page = ({ params }: { params: { id: string } }) => {
  const { onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onClose: onCloseConfirmation,
    onOpenChange: onOpenChangeConfirmation,
  } = useDisclosure();

  const [ticketData, setTicketData] = useState<validateAPIResponseType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminCode, setAdminCode] = useState<string>("");
  const [adminError, setAdminError] = useState<boolean>(false);
  const [activationSuccess, setActivationSuccess] = useState<boolean>(false);

  const getTicketData = async () => {
    try {
      const { data } = await axios.post(
        `${PROJECT_HOST}/api/tickets/${params.id}`
      );

      setTicketData(data);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
      }
    }
  };

  const activateTicket = async () => {
    setIsLoading(true);
    try {
      if (adminCode !== "G4dj4hf3st2023") {
        setAdminError(true);
        setIsLoading(false);
        return;
      }

      const { data } = await axios.put(
        `${PROJECT_HOST}/api/tickets/activate/${params.id}`
      );

      console.log(data);
      setActivationSuccess(true);
      setIsLoading(false);
      onClose();
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    getTicketData();
  }, [params.id]);

  if (ticketData?.message === "Ticket not found") {
    return (
      <ValidateTicketModal
        isOpen={true}
        onClose={onClose}
        onOpenChange={onOpenChange}
        message={"Tiket tidak ditemukan"}
        ticketData={ticketData}
      />
    );
  }

  if (ticketData?.message === "Ticket sudah di aktivasi") {
    return (
      <ValidateTicketModal
        isOpen={true}
        onClose={onClose}
        onOpenChange={onOpenChange}
        message={`Tiket sudah di aktivasi pada tanggal ${new Date(
          ticketData.activationDate!
        ).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`}
        ticketData={ticketData}
      />
    );
  }

  return (
    <main>
      <ValidateTicketModal
        isOpen={true}
        onClose={onClose}
        onOpenChange={onOpenChange}
        onOpenConfirmationModal={onOpenConfirmation}
        isLoading={isLoading}
        ticketData={ticketData}
        message="Tiket dapat di aktivasi"
      />
      <TicketActivationConfirmationModal
        isOpen={isOpenConfirmation}
        onClose={onCloseConfirmation}
        onOpenChange={onOpenChangeConfirmation}
        isLoading={isLoading}
        activateTicketFunction={activateTicket}
        adminCode={adminCode}
        setAdminCode={setAdminCode}
        isCodeError={adminError}
        setIsCodeError={setAdminError}
        activationSuccess={activationSuccess}
      />
    </main>
  );
};

export default Page;
