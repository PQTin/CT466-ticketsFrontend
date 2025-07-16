import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";

import login from "@/views/auth/login.vue";

import adminLayout from "@/layouts/adminLayout.vue";
import adminRap from "@/views/admin/rap.vue";
import adminMovie from "@/views/admin/movie.vue";
import adminShowtime from "@/views/admin/showtimeCombo.vue";
import adminPromotion from "@/views/admin/promotion.vue";
import adminTicket from "@/views/admin/ticket.vue";
import adminUser from "@/views/admin/user.vue";
import dashboard from "@/views/admin/dashboard.vue";

import clientLayout from "@/layouts/clientLayout.vue";
import home from "@/views/client/home.vue";
import booking from "@/views/client/booking.vue";
import movieDetail from "@/views/client/movieDetail.vue";
import userTicket from "@/views/client/userTicket.vue";
import showtime from "@/views/client/showtime.vue";
import movie from "@/views/client/movie.vue";
import promotion from "@/views/client/promotion.vue";
const routes = [
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/admin",
    component: adminLayout,
    children: [
      { path: "", name: "dashboard", component: dashboard },
      {
        path: "rap",
        name: "adminRap",
        component: adminRap,
      },
      {
        path: "movie",
        name: "adminMovie",
        component: adminMovie,
      },
      {
        path: "showtime",
        name: "adminShowtime",
        component: adminShowtime,
      },
      {
        path: "promotion",
        name: "adminPromotion",
        component: adminPromotion,
      },
      {
        path: "ticket",
        name: "adminTicket",
        component: adminTicket,
      },
      {
        path: "user",
        name: "adminUser",
        component: adminUser,
      },
    ],
  },
  {
    path: "/",
    component: clientLayout,
    children: [
      {
        path: "",
        name: "home",
        component: home,
      },
      {
        path: "booking/:idLichChieu",
        name: "booking",
        component: booking,
        props: true,
      },
      {
        path: "movieDetail/:idPhim",
        name: "movieDetail",
        component: movieDetail,
      },
      {
        path: "userTicket",
        name: "userTicket",
        component: userTicket,
      },
      {
        path: "showtime",
        name: "showtime",
        component: showtime,
      },
      { path: "movie", name: "movie", component: movie },
      { path: "promotion", name: "promotion", component: promotion },
    ],
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

// kiểm tra quyền admin
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.path.startsWith("/admin")) {
    if (!auth.isLoggedIn) {
      return next("/login");
    }
    if (!auth.isAdmin) {
      return next("/home");
    }
  }

  next();
});

export default router;
