export interface TicketDetailsType {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
  };
  details: TicketDetailsItemsType[];
}

interface TicketDetailsItemsType {
  ticketId: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
}

export interface TicketAvailibilityType {
  ticketId: string;
  available: boolean;
}

export interface buyerDataType {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export interface bookingTicketPayload {
  ticketId: string;
  quantity: number;
}
