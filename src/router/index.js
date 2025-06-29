import { createRouter, createWebHistory } from "vue-router";
import login from "@/views/auth/login.vue";
import adminRap from "@/views/admin/rap.vue";
import adminMovie from "@/views/admin/movie.vue";
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
    path: "/admin/movie",
    name: "adminMovie",
    component: adminMovie,
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
