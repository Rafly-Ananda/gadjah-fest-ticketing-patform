export interface IBuyerData {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

export interface IBookingDetailsResponse {
  invoiceUrl: string;
  bookingCode: string;
}

export interface ITicketDetailsType {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
  };
  details: ITicketDetailsItemsType[];
}

interface ITicketDetailsItemsType {
  ticketId: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
}

export interface ITicketAvailibilityType {
  ticketId: string;
  available: boolean;
}

export interface INavbarInteface {
  name: string;
  href: string;
}
