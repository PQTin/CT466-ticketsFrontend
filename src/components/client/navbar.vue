<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark px-4 py-2 fixed-top custom-navbar"
  >
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <RouterLink
        to="/home"
        class="fw-bold fs-4 text-white text-decoration-none"
      >
        TicketMovie
      </RouterLink>
      <ul class="navbar-nav d-flex flex-row gap-3">
        <li class="nav-item">
          <RouterLink to="/home" class="nav-link" exact-active-class="active">
            Trang chủ
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            to="/showtime"
            class="nav-link"
            exact-active-class="active"
          >
            suất chiếu
          </RouterLink>
        </li>
        <li v-if="auth.isLoggedIn" class="nav-item">
          <RouterLink
            to="/userTicket"
            class="nav-link"
            exact-active-class="active"
          >
            Vé đã đặt
          </RouterLink>
        </li>
      </ul>

      <div
        class="d-flex align-items-center gap-2 position-relative user-dropdown"
      >
        <template v-if="auth.isLoggedIn">
          <span class="text-light small">
            {{ auth.user?.tenDangNhap || "Khách" }}
          </span>
          <img
            :src="`http://localhost:3000/uploads/${auth.user?.duongDanAvatar}`"
            alt="avatar"
            class="avatar rounded-circle border"
            @click="toggleDropdown"
          />
          <div v-if="showMenu" class="dropdown-menu show">
            <button class="dropdown-item text-danger" @click="logout">
              Đăng xuất
            </button>
          </div>
        </template>
        <template v-else>
          <button class="btn btn-outline-light btn-sm" @click="goLogin">
            Đăng nhập
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const auth = useAuthStore();
const router = useRouter();

const showMenu = ref(false);
const toggleDropdown = () => {
  showMenu.value = !showMenu.value;
};

const logout = () => {
  auth.logout();
  router.push("/login");
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.custom-navbar {
  background: rgba(18, 18, 18, 0.85);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  z-index: 1000;
}

.nav-link {
  color: #e0e0e0 !important;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link.active,
.nav-link:hover {
  color: #ffcc00 !important;
  border-bottom: 2px solid #ffcc00;
}

.avatar {
  width: 36px;
  height: 36px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid #ffcc00;
  box-shadow: 0 0 4px #ffcc00;
  transition: transform 0.2s;
}
.avatar:hover {
  transform: scale(1.05);
}

.user-dropdown {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  z-index: 999;
  background-color: #222;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  padding: 0.5rem 0;
  min-width: 150px;
}

.dropdown-item {
  color: #f0f0f0;
  font-size: 14px;
  padding: 0.5rem 1rem;
}

.dropdown-item:hover {
  background-color: #333;
  color: #ffcc00;
}

.btn-outline-light.btn-sm {
  border-color: #ffcc00;
  color: #ffcc00;
}
.btn-outline-light.btn-sm:hover {
  background-color: #ffcc00;
  color: #000;
}
</style>
