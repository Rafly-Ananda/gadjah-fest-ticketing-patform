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

interface BookingDetailsRespond {
  invoiceUrl: string;
  bookingCode: string;
}

interface ComponentProps {
  isOpen: boolean;
  onOpenChange: () => void;
  bookingObj: BookingDetailsRespond;
}

const BookingConfirmationModal: FC<ComponentProps> = ({
  isOpen,
  onOpenChange,
  bookingObj,
}) => {
  console.log("==================");
  console.log(bookingObj);
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
              <ModalHeader className="flex flex-col gap-1">
                Booking Success
              </ModalHeader>
              <ModalBody className="flex items-center">
                <p className="text-justify">
                  Kamu baru saja melakukan pemesanan tiket dengan booking ID
                  <strong> {bookingObj.bookingCode}</strong> untuk acara Gadjah
                  Fest 2023, segera lakukan pembayaran dengan menekan tombol
                  link pembayaran dibawah ini. Atau cek email kamu!.
                </p>
                <a href={bookingObj.invoiceUrl} className="w-full">
                  <Button className="bg-[#0a6c72] rounded text-white text-[12px] font-semibold no-underline text-center w-full">
                    Link Pembayaran
                  </Button>
                </a>
              </ModalBody>
              <ModalFooter>
                {/* <Button
                  color="primary"
                  onPress={async () => {
                    await handleBooking();
                    onClose();
                  }}
                  isLoading={isBooking ? true : false}
                >
                  Pesan
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookingConfirmationModal;
