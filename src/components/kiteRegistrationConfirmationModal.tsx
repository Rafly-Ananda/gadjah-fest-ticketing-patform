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
import { buyerDataType } from "@/interfaces";

interface ComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: any;
  handleKiteBooking: any;
  buyerData: buyerDataType;
  isBooking: boolean;
}

const KiteRegistrationConfirmationModal: FC<ComponentProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  handleKiteBooking,
  buyerData,
  isBooking,
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
                Kite Booking Confirmation
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
                  onPress={handleKiteBooking}
                  isLoading={isBooking}
                  isDisabled={
                    buyerData.firstName === "" ||
                    buyerData.lastName === "" ||
                    buyerData.email === "" ||
                    buyerData.mobileNumber === ""
                  }
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

export default KiteRegistrationConfirmationModal;
