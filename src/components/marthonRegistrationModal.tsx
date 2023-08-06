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
  useDisclosure,
} from "@nextui-org/react";
import { MarathonDetailType } from "@/interfaces";
import { RadioGroup, Radio } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import Image from "next/image";

interface ComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  handleBooking: () => Promise<void>;
  marathonDetail: MarathonDetailType | undefined;
  setMarathonDetail: React.Dispatch<React.SetStateAction<MarathonDetailType>>;
  isBooking: boolean;
  onClose: any;
  onOpenConfirm: any;
}

const MarathonRegistrationModal: FC<ComponentProps> = ({
  isOpen,
  onOpenChange,
  handleBooking,
  marathonDetail,
  setMarathonDetail,
  isBooking,
  onClose,
  onOpenConfirm,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        scrollBehavior="inside"
        placement="center"
        size="md"
        onClose={onClose}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Marathon Registration
              </ModalHeader>
              <ModalBody>
                <Image
                  src="/half-marathon-popup.jpg"
                  alt="logo"
                  width="0"
                  height="0"
                  sizes="100vw"
                  priority={true}
                  className="w-[500px] h-[400px]"
                />
                <Input
                  autoFocus
                  label="Email"
                  placeholder="Masukkan email"
                  variant="bordered"
                  value={marathonDetail?.user.email}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      user: { ...prev.user, email: e.target.value },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Pertama"
                  placeholder="Masukkan nama pertama"
                  variant="bordered"
                  value={marathonDetail?.user.firstName}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      user: { ...prev.user, firstName: e.target.value },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Terakhir"
                  placeholder="Masukkan nama terakhir"
                  variant="bordered"
                  value={marathonDetail?.user.lastName}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      user: { ...prev.user, lastName: e.target.value },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nomor Handphone"
                  placeholder="Masukkan nomor handphone"
                  variant="bordered"
                  value={marathonDetail?.user.mobileNumber}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      user: { ...prev.user, mobileNumber: e.target.value },
                    }))
                  }
                />
                <RadioGroup
                  label="Jenis Kelamin"
                  size="sm"
                  value={marathonDetail?.user.gender}
                  onValueChange={(e) => {
                    setMarathonDetail((prev) => ({
                      ...prev,
                      user: { ...prev.user, gender: e },
                    }));
                  }}
                >
                  <Radio value="pria">Pria</Radio>
                  <Radio value="wanita">Wanita</Radio>
                </RadioGroup>
                <RadioGroup
                  label="Jelaskan skill dalam marathon atau berlari anda"
                  size="sm"
                  value={marathonDetail?.user.marathonSkill}
                  onValueChange={(e) => {
                    setMarathonDetail((prev) => ({
                      ...prev,
                      user: { ...prev.user, marathonSkill: e },
                    }));
                  }}
                >
                  <Radio value="1">1</Radio>
                  <Radio value="2">2</Radio>
                  <Radio value="3">3</Radio>
                  <Radio value="4">4</Radio>
                  <Radio value="5">5</Radio>
                </RadioGroup>
                <h1>Informasi Kontak (situasi darurat)</h1>
                <Input
                  autoFocus
                  label="Email Kontak"
                  placeholder="Masukkan email"
                  variant="bordered"
                  value={marathonDetail?.contactInformation.email}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      contactInformation: {
                        ...prev.contactInformation,
                        email: e.target.value,
                      },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Pertama Kontak"
                  placeholder="Masukkan nama pertama"
                  variant="bordered"
                  value={marathonDetail?.contactInformation.firstName}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      contactInformation: {
                        ...prev.contactInformation,
                        firstName: e.target.value,
                      },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Terakhir Kontak"
                  placeholder="Masukkan nama terakhir"
                  variant="bordered"
                  value={marathonDetail?.contactInformation.lastName}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      contactInformation: {
                        ...prev.contactInformation,
                        lastName: e.target.value,
                      },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nomor Handphone Kontak"
                  placeholder="Masukkan nomor handphone"
                  variant="bordered"
                  value={marathonDetail?.contactInformation.mobileNumber}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      contactInformation: {
                        ...prev.contactInformation,
                        mobileNumber: e.target.value,
                      },
                    }))
                  }
                />
                <Textarea
                  label="Informasi tambahan"
                  labelPlacement="outside"
                  placeholder="Masukkan informasi tambahan"
                  value={marathonDetail?.additionalInformation}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev,
                      additionalInformation: e.target.value,
                    }))
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-[#0a6c72] text-white"
                  onPress={onOpenConfirm}
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

export default MarathonRegistrationModal;
