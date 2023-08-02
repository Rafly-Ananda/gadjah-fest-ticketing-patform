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
import { buyerDataType } from "@/interfaces";

interface ComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  handleBooking: () => Promise<void>;
  buyerData: buyerDataType | undefined;
  setBuyerData: React.Dispatch<React.SetStateAction<buyerDataType>>;
  isBooking: boolean;
}

const CheckoutModal: FC<ComponentProps> = ({
  isOpen,
  onOpenChange,
  handleBooking,
  buyerData,
  setBuyerData,
  isBooking,
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
                  label="Email"
                  placeholder="Masukkan email"
                  variant="bordered"
                  value={buyerData?.email}
                  onChange={(e) =>
                    setBuyerData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Pertama"
                  placeholder="Masukkan nama pertama"
                  variant="bordered"
                  value={buyerData?.firstName}
                  onChange={(e) =>
                    setBuyerData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Terakhir"
                  placeholder="Masukkan nama terakhir"
                  variant="bordered"
                  value={buyerData?.lastName}
                  onChange={(e) =>
                    setBuyerData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nomor Handphone"
                  placeholder="Masukkan nomor handphone"
                  variant="bordered"
                  value={buyerData?.mobileNumber}
                  onChange={(e) =>
                    setBuyerData((prev) => ({
                      ...prev,
                      mobileNumber: e.target.value,
                    }))
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={async () => {
                    await handleBooking();
                    onClose();
                  }}
                  isLoading={isBooking ? true : false}
                >
                  Pesan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckoutModal;
