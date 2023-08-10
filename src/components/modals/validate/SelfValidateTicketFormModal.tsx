"use client";
import React, { FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

interface IComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: any;
  bookingCode: string;
  setBookingCode: React.Dispatch<React.SetStateAction<string>>;
  onOpenConfirm: any;
  message: string;
}

const SelfValidateTicketFormModal: FC<IComponentProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  bookingCode,
  setBookingCode,
  onOpenConfirm,
  message,
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
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Validate Booking
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
                <h1 className="font-semibold text-sm text-red-600">
                  {message}
                </h1>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#0a6c72] text-white"
                  onPress={onOpenConfirm}
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

export default SelfValidateTicketFormModal;
