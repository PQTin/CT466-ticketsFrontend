import { createRouter, createWebHistory } from "vue-router";
import login from "@/views/auth/login.vue";
import adminRap from "@/views/admin/rap.vue";
import adminMovie from "@/views/admin/movie.vue";
import adminShowtime from "@/views/admin/showtimeCombo.vue";
import adminPromotion from "@/views/admin/promotion.vue";
import home from "@/views/client/home.vue";
import booking from "@/views/client/booking.vue";
import movieDetail from "@/views/client/movieDetail.vue";
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
    path: "/admin/showtime",
    name: "adminShowtime",
    component: adminShowtime,
  },
  {
    path: "/admin/promotion",
    name: "adminPromotion",
    component: adminPromotion,
  },
  {
    path: "/home",
    name: "home",
    component: home,
  },
  {
    path: "/booking/:idLichChieu",
    name: "booking",
    component: booking,
    props: true,
  },
  {
    path: "/movieDetail/:idPhim",
    name: "movieDetail",
    component: movieDetail,
    props: true,
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
