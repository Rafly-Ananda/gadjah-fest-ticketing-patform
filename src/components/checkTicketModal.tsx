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
  onOpenChange: () => void;
  navigateToTicketDetails: () => void;
  bookingCode: string;
  setBookingCode: React.Dispatch<React.SetStateAction<string>>;
}

const CheckTicketModal: FC<ComponentProps> = ({
  isOpen,
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
        isDismissable={false}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
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
                  color="primary"
                  onPress={async () => {
                    onClose();
                    navigateToTicketDetails();
                  }}
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
