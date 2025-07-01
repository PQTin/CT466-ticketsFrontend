import api from "./api";

export const createShowtime = (data) => {
  return api.post("/showtime", data);
};

export const getAllShowtimesAdmin = () => {
  return api.get("/showtime/admin");
};

export const getAllShowtimesClient = () => {
  return api.get("/showtime/client");
};

export const getShowtimeById = (id) => {
  return api.get(`/showtime/byId/${id}`);
};

export const updateShowtimeById = (id, data) => {
  return api.put(`/showtime/${id}`, data);
};

export const deleteShowtime = (id) => {
  return api.delete(`/showtime/${id}`);
};

export const getSeatsByShowtime = (lichChieuId) => {
  return api.get(`/showtime/seats/by-Showtime/${lichChieuId}`);
};

export const createCombo = (formData) => {
  return api.post("/showtime/combo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllCombos = () => {
  return api.get("/showtime/combo");
};

export const deleteCombo = (id) => {
  return api.delete(`/showtime/combo/${id}`);
};

export const getNameMovie = () => {
  return api.get("/showtime/movie/all");
};

export const getNameBranch = () => {
  return api.get("/showtime/branch/all");
};
