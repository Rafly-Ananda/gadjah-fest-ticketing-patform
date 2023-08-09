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

interface ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onOpenChange: () => void;
  navigateToTicketDetails: (cb: any) => void;
  bookingCode: string;
  setBookingCode: React.Dispatch<React.SetStateAction<string>>;
}

const CheckTicketModal: FC<ComponentProps> = ({
  isOpen,
  onClose,
  isLoading,
  onOpenChange,
  navigateToTicketDetails,
  bookingCode,
  setBookingCode,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={isLoading ? false : true}
        onClose={onClose}
        placement="center"
        size="xs"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Check Ticket
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Kode Booking"
                  placeholder="Masukkan kode booking"
                  variant="bordered"
                  value={bookingCode}
                  onChange={(e) => setBookingCode((prev) => e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#0a6c72] text-white"
                  onPress={navigateToTicketDetails}
                  isLoading={isLoading ? true : false}
                >
                  Cek
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckTicketModal;
