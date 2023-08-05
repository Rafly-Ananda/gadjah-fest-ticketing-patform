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
  isCodeError: boolean;
  codeValue: string;
  setCodeValue: React.Dispatch<React.SetStateAction<string>>;
  validateBookingAction: any;
  isLoading: boolean;
}

const SelfValidateTicketConfirmationModal: FC<ComponentProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  isCodeError,
  codeValue,
  setCodeValue,
  validateBookingAction,
  isLoading,
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
                Validate Confirmation Booking
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Kode Admin"
                  placeholder="Masukkan kode Admin"
                  variant="bordered"
                  value={codeValue}
                  validationState={isCodeError ? "invalid" : "valid"}
                  errorMessage={isCodeError && "Kode admin salah"}
                  onChange={(e) => setCodeValue((prev) => e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#0a6c72] text-white"
                  onPress={validateBookingAction}
                  isLoading={isLoading}
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

export default SelfValidateTicketConfirmationModal;
