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
  onClose: any;
  handleFestivalBooking: any;
}

const FestivalConfirmationModal: FC<ComponentProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  handleFestivalBooking,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={true}
        placement="center"
        size="xs"
        onClose={onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Festival Booking Confirmation
              </ModalHeader>
              <ModalBody>
                <h1>Apakah kamu yakin dengan data yang kamu masukkan?</h1>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#720a0a] text-white" onPress={onClose}>
                  Tidak
                </Button>
                <Button
                  className="bg-[#0a6c72] text-white"
                  onPress={handleFestivalBooking}
                >
                  Ya
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default FestivalConfirmationModal;
