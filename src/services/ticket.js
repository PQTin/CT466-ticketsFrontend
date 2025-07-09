import api from "./api";

export const getMyTickets = () => {
  return api.get("/ticket/my-tickets");
};

export const getAllTicketsAdmin = () => {
  return api.get("/ticket");
};

export const getTicketByQR = (qr) => {
  return api.get(`/ticket/qr/${qr}`);
};

export const checkInTicket = (qr) => {
  return api.put(`/ticket/check-in/${qr}`);
};

export const confirmPaymentAtCounter = (qr) => {
  return api.put(`/ticket/confirm/${qr}`);
};

export const cancelTicket = (veId) => {
  return api.put(`/ticket/cancel/${veId}`);
};

export const getCombosByTicketId = (veId) => {
  return api.get(`/ticket/combo-by-id/${veId}`);
};
