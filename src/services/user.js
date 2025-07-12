import api from "./api";

export const getCurrentUser = () => {
  return api.get("/user/me");
};

export const getAllUsers = () => {
  return api.get("/user");
};

export const getUserNotifications = () => {
  return api.get("/user/notifications");
};

export const sendNotification = (data) => {
  return api.post("/user/sendNotification", data);
};

export const updateProfile = (formData) => {
  return api.put("/auth/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateUserByAdmin = (id, formData) => {
  return api.put(`/auth/update-admin/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const registerUserByAdmin = (data) => {
  return api.post("/auth/register-admin", data);
};
