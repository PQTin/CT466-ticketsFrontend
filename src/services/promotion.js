import api from "./api";

export const getAllPromotions = () => {
  return api.get("/promotion");
};

export const createPromotion = (formData) => {
  return api.post("/promotion", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePromotionStatus = (id, hoatDong) => {
  return api.put(`/promotion/status/${id}`, { hoatDong });
};

export const issueCodesToAllUsers = (khuyenMaiId, maPrefix) => {
  return api.post("/promotion/issue/all", { khuyenMaiId, maPrefix });
};

export const issueCodesToUserGroup = (nguoiDungIds, khuyenMaiId, maPrefix) => {
  return api.post("/promotion/issue/group", {
    nguoiDungIds,
    khuyenMaiId,
    maPrefix,
  });
};

export const getUserDiscountCodes = () => {
  return api.get("/promotion/my-codes");
};

export const getAllCodesByPromotionId = (khuyenMaiId) => {
  return api.get(`/promotion/codesbyIdPromotion/${khuyenMaiId}`);
};

export const getUsersByType = (loai, khuyenMaiId) => {
  return api.get(`/promotion/userType/${loai}/${khuyenMaiId}`);
};
