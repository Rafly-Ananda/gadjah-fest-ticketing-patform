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

interface ComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const SelfValidateTicketSuccessModal: FC<ComponentProps> = ({
  isOpen,
  onOpenChange,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        placement="center"
        size="xs"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Booking Success
              </ModalHeader>
              <ModalBody className="flex items-center">
                <p className="text-justify">
                  Booking berhasil di validasi, silahkan cek email admin dan
                  pelanggan untuk detail tiket nya.
                </p>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SelfValidateTicketSuccessModal;
