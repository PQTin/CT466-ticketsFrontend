import api from "./api";

export const dashboard = () => {
  return api.get("/dashboard");
};
