"use client";
import React, { FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { IBuyerData } from "@/interfaces/_base";

interface IComponentProps {
  isOpen: boolean;
  onClose: any;
  onOpenChange: () => void;
  buyerData?: IBuyerData | undefined;
  isBooking: boolean;
  handleBooking: () => Promise<void>;
}

const RegistrationConfirmationModal: FC<IComponentProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  handleBooking,
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
                  onPress={handleBooking}
                  isLoading={isBooking}
                  isDisabled={
                    buyerData?.firstName === "" ||
                    buyerData?.lastName === "" ||
                    buyerData?.email === "" ||
                    buyerData?.mobileNumber === ""
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

export default RegistrationConfirmationModal;
