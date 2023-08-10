"use client";
import React, { FC, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface IComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: any;
  isLoading: boolean;
  activateTicketFunction: any;
  adminCode: string;
  setAdminCode: any;
  isCodeError: boolean;
  setIsCodeError: any;
  activationSuccess: boolean;
}

const TicketActivationConfirmationModal: FC<IComponentProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  isLoading,
  activateTicketFunction,
  adminCode,
  setAdminCode,
  isCodeError,
  setIsCodeError,
  activationSuccess,
}) => {
  const router = useRouter();
  useEffect(() => {
    setIsCodeError(false);
  }, []);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={true}
        onClose={onClose}
        placement="center"
        size="xs"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Activate Ticket
              </ModalHeader>
              {activationSuccess ? (
                <>
                  <ModalBody className="flex items-center justify-center">
                    <h1 className="text-sm font-semibold text-green-600">
                      Aktivasi tiket berhasil
                    </h1>
                  </ModalBody>
                  <ModalFooter className="flex items-center justify-center">
                    <Button
                      className="bg-[#0a6c72] text-white"
                      onPress={() => router.push("/")}
                      isLoading={isLoading}
                    >
                      Selesai
                    </Button>
                  </ModalFooter>
                </>
              ) : (
                <>
                  <ModalBody>
                    <Input
                      autoFocus
                      label="Kode Admin"
                      placeholder="Masukkan kode Admin"
                      variant="bordered"
                      value={adminCode}
                      validationState={isCodeError ? "invalid" : "valid"}
                      errorMessage={isCodeError && "Kode admin salah"}
                      onChange={(e) => {
                        setAdminCode(e.target.value);
                        if (isCodeError) {
                          setIsCodeError(false);
                        }
                      }}
                    />
                    <h1 className="text-sm font-semibold">
                      Apakah kamu yakin untuk aktivasi tiket ini.
                    </h1>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-[#720a0a] text-white"
                      isLoading={isLoading}
                      onPress={onClose}
                    >
                      Tidak
                    </Button>
                    <Button
                      className="bg-[#0a6c72] text-white"
                      onPress={activateTicketFunction}
                      isLoading={isLoading}
                    >
                      Ya
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TicketActivationConfirmationModal;
