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
import { IMarathonDetailData } from "@/interfaces/marathon";
import { RadioGroup, Radio } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import Image from "next/image";

interface IComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onOpenChange: () => void;
  marathonDetail: IMarathonDetailData | undefined;
  setMarathonDetail: React.Dispatch<
    React.SetStateAction<IMarathonDetailData | undefined>
  >;
  isBooking: boolean;
}

const MarathonRegistrationFormModal: FC<IComponentProps> = ({
  isOpen,
  onClose,
  onOpen,
  onOpenChange,
  marathonDetail,
  setMarathonDetail,
  isBooking,
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
                  value={marathonDetail?.user.email ?? ""}
                  isRequired={true}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      user: { ...prev!.user, email: e.target.value },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Pertama"
                  placeholder="Masukkan nama pertama"
                  variant="bordered"
                  value={marathonDetail?.user.firstName ?? ""}
                  isRequired={true}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      user: { ...prev!.user, firstName: e.target.value },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nama Terakhir"
                  placeholder="Masukkan nama terakhir"
                  variant="bordered"
                  value={marathonDetail?.user.lastName ?? ""}
                  isRequired={true}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      user: { ...prev!.user, lastName: e.target.value },
                    }))
                  }
                />
                <Input
                  autoFocus
                  label="Nomor Handphone"
                  placeholder="Masukkan nomor handphone"
                  variant="bordered"
                  value={marathonDetail?.user.mobileNumber ?? ""}
                  isRequired={true}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      user: { ...prev!.user, mobileNumber: e.target.value },
                    }))
                  }
                />
                <RadioGroup
                  label="Jenis Kelamin"
                  size="sm"
                  value={marathonDetail?.user.gender ?? ""}
                  onValueChange={(e) => {
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      user: { ...prev!.user, gender: e },
                    }));
                  }}
                >
                  <Radio value="pria">Pria</Radio>
                  <Radio value="wanita">Wanita</Radio>
                </RadioGroup>
                <RadioGroup
                  label="Jelaskan skill dalam marathon atau berlari anda"
                  size="sm"
                  value={marathonDetail?.user.marathonSkill ?? ""}
                  onValueChange={(e) => {
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      user: { ...prev!.user, marathonSkill: e },
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
                  value={marathonDetail?.contactInformation.email ?? ""}
                  isRequired={true}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      contactInformation: {
                        ...prev!.contactInformation,
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
                  value={marathonDetail?.contactInformation.firstName ?? ""}
                  isRequired={true}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      contactInformation: {
                        ...prev!.contactInformation,
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
                  value={marathonDetail?.contactInformation.lastName ?? ""}
                  isRequired={true}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      contactInformation: {
                        ...prev!.contactInformation,
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
                  value={marathonDetail?.contactInformation.mobileNumber ?? ""}
                  isRequired={true}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      contactInformation: {
                        ...prev!.contactInformation,
                        mobileNumber: e.target.value,
                      },
                    }))
                  }
                />
                <Textarea
                  label="Informasi tambahan"
                  labelPlacement="outside"
                  placeholder="Masukkan informasi tambahan"
                  value={marathonDetail?.additionalInformation ?? ""}
                  onChange={(e) =>
                    setMarathonDetail((prev) => ({
                      ...prev!,
                      additionalInformation: e.target.value,
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
                    marathonDetail?.user.firstName === "" ||
                    marathonDetail?.user.firstName === undefined ||
                    marathonDetail?.user.lastName === "" ||
                    marathonDetail?.user.lastName === undefined ||
                    marathonDetail?.user.email === "" ||
                    marathonDetail?.user.email === undefined ||
                    marathonDetail?.user.mobileNumber === "" ||
                    marathonDetail?.user.mobileNumber === undefined ||
                    marathonDetail?.contactInformation.email === "" ||
                    marathonDetail?.contactInformation.email === undefined ||
                    marathonDetail?.contactInformation.firstName === "" ||
                    marathonDetail?.contactInformation.firstName ===
                      undefined ||
                    marathonDetail?.contactInformation.lastName === "" ||
                    marathonDetail?.contactInformation.lastName === undefined ||
                    marathonDetail?.contactInformation.mobileNumber === "" ||
                    marathonDetail?.contactInformation.mobileNumber ===
                      undefined
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

export default MarathonRegistrationFormModal;
