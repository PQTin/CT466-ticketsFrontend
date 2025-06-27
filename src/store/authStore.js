import { defineStore } from "pinia";
import * as authService from "@/services/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAdmin: (state) => state.user?.vaiTro === "admin",
    isLoggedIn: (state) => !!state.token,
    userId: (state) => state.user?.id,
  },

  actions: {
    async login(credentials) {
      try {
        const { user, token } = await authService.login(credentials);

        this.user = user;
        this.token = token;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      } catch (error) {
        throw error.response?.data?.message || "Lỗi đăng nhập";
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
