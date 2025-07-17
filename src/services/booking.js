import api from "./api";
export const bookTicket = (data) => api.post("/bookTicket", data);

export const addComboToTicket = (data) =>
  api.post("/bookTicket/addCombo", data);

export const paymentCalculator = (data) =>
  api.post("/bookTicket/calculate-payment", data);

export const calculateComboTotal = (data) =>
  api.post("/bookTicket/calculate-combo", data);
