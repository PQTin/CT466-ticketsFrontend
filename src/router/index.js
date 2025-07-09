import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/authStore";

import login from "@/views/auth/login.vue";

import adminLayout from "@/layouts/adminLayout.vue";
import adminRap from "@/views/admin/rap.vue";
import adminMovie from "@/views/admin/movie.vue";
import adminShowtime from "@/views/admin/showtimeCombo.vue";
import adminPromotion from "@/views/admin/promotion.vue";
import adminTicket from "@/views/admin/ticket.vue";

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
    component: adminLayout,
    children: [
      {
        path: "",
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
    ],
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
