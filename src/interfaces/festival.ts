export interface IBookingPasses {
  [key: string]: ITicketData;
}

export interface ITicketData {
  ticketId: string;
  quantity: number;
}
