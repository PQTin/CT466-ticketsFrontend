import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3001, // frontend chạy cổng 3001
    proxy: {
      "/api": {
        target: "http://localhost:3000", // backend chạy cổng 3000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
