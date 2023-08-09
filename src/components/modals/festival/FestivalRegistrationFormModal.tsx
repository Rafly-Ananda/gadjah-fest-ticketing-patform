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
import { IBuyerData } from "@/interfaces/_base";

interface IComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onOpenChange: () => void;
  buyerData: IBuyerData | undefined;
  setBuyerData: React.Dispatch<React.SetStateAction<IBuyerData | undefined>>;
  isBooking: boolean;
}

const FestivalRegistrationFormModal: FC<IComponentProps> = ({
  isOpen,
  onOpenChange,
  buyerData,
  setBuyerData,
  isBooking,
  onClose,
  onOpen,
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
                Festival Ticket Booking
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Email"
                  placeholder="Masukkan email"
                  variant="bordered"
                  value={buyerData?.email ?? ""}
                  isRequired
                  onChange={(e) =>
                    setBuyerData((prev) => ({
                      ...prev!,
                      email: e.target.value,
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Pertama"
                  placeholder="Masukkan nama pertama"
                  variant="bordered"
                  value={buyerData?.firstName ?? ""}
                  isRequired
                  onChange={(e) =>
                    setBuyerData((prev) => ({
                      ...prev!,
                      firstName: e.target.value,
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Terakhir"
                  placeholder="Masukkan nama terakhir"
                  variant="bordered"
                  value={buyerData?.lastName ?? ""}
                  isRequired
                  onChange={(e) =>
                    setBuyerData((prev) => ({
                      ...prev!,
                      lastName: e.target.value,
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nomor Handphone"
                  placeholder="Masukkan nomor handphone"
                  variant="bordered"
                  value={buyerData?.mobileNumber ?? ""}
                  isRequired
                  onChange={(e) =>
                    setBuyerData((prev) => ({
                      ...prev!,
                      mobileNumber: e.target.value,
                    }))
                  }
                />
                <h1 className="text-sm">
                  <strong>Note:</strong> Pastikan email benar, tiket akan
                  dikirimkan melalui email tersebut.
                </h1>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#0a6c72] text-white"
                  onPress={onOpen}
                  isLoading={isBooking ? true : false}
                  isDisabled={
                    buyerData?.firstName === "" ||
                    buyerData?.firstName === undefined ||
                    buyerData?.lastName === "" ||
                    buyerData?.lastName === undefined ||
                    buyerData?.email === "" ||
                    buyerData?.email === undefined ||
                    buyerData?.mobileNumber === "" ||
                    buyerData?.mobileNumber === undefined
                  }
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

export default FestivalRegistrationFormModal;
