"use client";
import React, { FC, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { PurchasedTicket, Booking } from "@prisma/client";

interface validateAPIResponseType {
  status: string;
  message: string;
  activationDate?: string;
  data: APIResponseData;
}

interface APIResponseData extends PurchasedTicket {
  booking: Booking;
}

interface IComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: any;
  message?: string;
  onOpenConfirmationModal?: any;
  isLoading?: boolean;
  ticketData?: validateAPIResponseType;
}

const TicketActivationFormModal: FC<IComponentProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  message,
  onOpenConfirmationModal,
  isLoading,
  ticketData,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        placement="center"
        size="xs"
        onClose={onClose}
        hideCloseButton={true}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center justify-center">
                Activate Ticket
              </ModalHeader>
              {ticketData?.data && (
                <ModalBody>
                  <div
                    className={`w-full flex items-center justify-center text-semibold text-sm text-center ${
                      ticketData?.data.ticketStatus === "VALID"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <h1>{message}</h1>
                  </div>
                  {ticketData?.data.ticketStatus === "VALID" && (
                    <Button
                      className="bg-[#0a6c72] text-white"
                      onPress={onOpenConfirmationModal}
                      isLoading={isLoading}
                    >
                      Aktivasi Ticket
                    </Button>
                  )}
                </ModalBody>
              )}

              <ModalFooter className="flex items-center justify-center"></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TicketActivationFormModal;
