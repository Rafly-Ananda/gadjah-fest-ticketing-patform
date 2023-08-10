import { NextResponse } from "next/server";
import { prismaClientInstance } from "@/_base";
import XLSX from "xlsx";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const bookingData = await prismaClientInstance.booking.findMany({
    where: {
      bookingStatus: "PAID",
    },
    select: {
      generatedBookingCode: true,
      bookingStatus: true,
      paidMethod: true,
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          mobileNumber: true,
        },
      },
    },

    orderBy: [{
      paidMethod: "asc",
    }],
  });

  const mergeReponse = bookingData.map((e) => {
    return {
      ...e.user,
      generatedBookingCode: e.generatedBookingCode,
      paidMethod: e.paidMethod,
      bookingStatus: e.bookingStatus,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(mergeReponse);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
  XLSX.writeFile(workbook, "DataSheet.xlsx");
  return NextResponse.json(mergeReponse, { status: 200 });
}
