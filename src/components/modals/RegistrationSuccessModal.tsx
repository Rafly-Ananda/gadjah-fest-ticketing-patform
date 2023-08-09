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
import { IBookingDetailsResponse } from "@/interfaces/_base";

interface IComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  bookingResponse: IBookingDetailsResponse | undefined;
}

const RegistrationSuccessModal: FC<IComponentProps> = ({
  isOpen,
  onOpenChange,
  bookingResponse,
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
                {bookingResponse?.invoiceUrl === "" ? (
                  <>
                    <p className="text-justify">
                      Kamu baru saja melakukan pemesanan tiket dengan booking ID
                      <strong> {bookingResponse?.bookingCode}</strong> silahkan
                      cek email kamu untuk detail nya.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-justify">
                      Kamu baru saja melakukan pemesanan tiket dengan booking ID
                      <strong> {bookingResponse?.bookingCode}</strong> untuk
                      acara Gadjah Fest 2023, segera lakukan pembayaran dengan
                      menekan tombol link pembayaran dibawah ini. Atau cek email
                      kamu!.
                    </p>
                    <a href={bookingResponse?.invoiceUrl} className="w-full">
                      <Button className="bg-[#0a6c72] rounded text-white text-[12px] font-semibold no-underline text-center w-full">
                        Link Pembayaran
                      </Button>
                    </a>
                  </>
                )}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default RegistrationSuccessModal;
