import api from "./api";

export const getAllBranch = () => api.get("/rap/branch/getAll");
export const createBranch = (data) => api.post("/rap/branch", data);
export const deleteBranch = (id) => api.delete(`/rap/branch/${id}`);

export const getRoomsByBranch = (chiNhanhId) =>
  api.get(`/rap/room/by-branch/${chiNhanhId}`);
export const createRoom = (data) => api.post("/rap/room", data);
export const deleteRoom = (id) => api.delete(`/rap/room/${id}`);

export const getAllSeatType = () => api.get("/rap/seatType/getAll");
export const createSeatType = (data) => api.post("/rap/seatType", data);
export const updateSeatType = (id, data) =>
  api.put(`/rap/seatType/${id}`, data);
export const deleteSeatType = (id) => api.delete(`/rap/seatType/${id}`);

export const getSeatsByRoom = (phongChieuId) =>
  api.get(`/rap/seat/by-room/${phongChieuId}`);
export const updateSeatTypeForSeat = (gheId, loaiGheId) =>
  api.put(`/rap/seat/${gheId}`, { loaiGheId });
