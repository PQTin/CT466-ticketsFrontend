import { createRouter, createWebHistory } from "vue-router";
import login from "@/views/auth/login.vue";
import adminRap from "@/views/admin/rap.vue";
const routes = [
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/admin",
    name: "adminRap",
    component: adminRap,
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
