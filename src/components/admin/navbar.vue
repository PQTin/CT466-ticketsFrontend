<template>
  <nav
    class="admin-navbar navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4 py-2"
  >
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <div class="fw-bold fs-4 text-primary">Admin Panel</div>

      <ul class="navbar-nav d-flex flex-row gap-3">
        <li class="nav-item">
          <RouterLink
            to="/admin"
            class="nav-link"
            active-class=""
            exact-active-class="active"
          >
            Rạp
          </RouterLink>
        </li>
        <RouterLink
          to="/admin/movie"
          class="nav-link"
          active-class=""
          exact-active-class="active"
        >
          Phim
        </RouterLink>

        <RouterLink
          to="/admin/showtime"
          class="nav-link"
          active-class=""
          exact-active-class="active"
        >
          Suất chiếu
        </RouterLink>

        <RouterLink
          to="/admin/promotion"
          class="nav-link"
          active-class=""
          exact-active-class="active"
        >
          Khuyến mãi
        </RouterLink>

        <RouterLink
          to="/admin/ticket"
          class="nav-link"
          active-class=""
          exact-active-class="active"
        >
          vé
        </RouterLink>
      </ul>

      <div
        class="d-flex align-items-center gap-2 position-relative user-dropdown"
      >
        <span class="text-muted small">
          Xin chào, {{ user?.tenDangNhap || "Admin" }}!</span
        >
        <img
          :src="`http://localhost:3000/uploads/${user?.duongDanAvatar}`"
          alt="avatar"
          class="avatar rounded-circle border"
          @click="toggleDropdown"
        />

        <div v-if="showMenu" class="dropdown-menu show">
          <button class="dropdown-item text-danger" @click="logout">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const router = useRouter();
const auth = useAuthStore();
const user = auth.user;

const showMenu = ref(false);
const toggleDropdown = () => {
  showMenu.value = !showMenu.value;
};

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<style scoped>
.nav-link.active {
  font-weight: bold;
  color: #0d6efd;
  border-bottom: 2px solid #0d6efd;
}

/* Avatar */
.avatar {
  width: 36px;
  height: 36px;
  object-fit: cover;
  cursor: pointer;
}

/* Dropdown menu */
.user-dropdown {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  z-index: 999;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  font-size: 14px;
  white-space: nowrap;
}
</style>
