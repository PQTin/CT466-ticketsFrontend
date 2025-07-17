<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark px-4 py-2 fixed-top custom-navbar"
  >
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <RouterLink to="/" class="fw-bold fs-4 text-white text-decoration-none">
        TicketMovie
      </RouterLink>

      <ul class="navbar-nav d-flex flex-row gap-3">
        <li class="nav-item">
          <RouterLink to="/" class="nav-link" exact-active-class="active"
            >Trang chủ</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink
            to="/showtime"
            class="nav-link"
            exact-active-class="active"
            >Suất chiếu</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink to="/movie" class="nav-link" exact-active-class="active"
            >Phim</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink
            to="/promotion"
            class="nav-link"
            exact-active-class="active"
            >Khuyến mãi</RouterLink
          >
        </li>
        <li v-if="auth.isLoggedIn" class="nav-item">
          <RouterLink
            to="/userTicket"
            class="nav-link"
            exact-active-class="active"
            >Vé đã đặt</RouterLink
          >
        </li>
      </ul>

      <div class="d-flex align-items-center gap-3 position-relative">
        <!-- Thông báo -->
        <div class="position-relative" v-if="auth.isLoggedIn">
          <button class="notif-btn" @click="toggleNotifications">
            🔔
            <span v-if="unreadCount > 0" class="notif-badge">{{
              unreadCount
            }}</span>
          </button>
          <div v-if="showNotifications" class="notif-dropdown">
            <notification />
          </div>
        </div>

        <!-- Avatar + tên -->
        <template v-if="auth.isLoggedIn">
          <span class="text-light small">{{
            auth.user?.tenDangNhap || "Khách"
          }}</span>
          <img
            :src="`http://localhost:3000/uploads/${auth.user?.duongDanAvatar}`"
            alt="avatar"
            class="avatar rounded-circle border"
            @click="toggleDropdown"
          />
          <div v-if="showMenu" class="dropdown-menu show">
            <RouterLink to="/profile" class="dropdown-item">
              Thông tin cá nhân
            </RouterLink>
            <button class="dropdown-item text-danger" @click="logout">
              Đăng xuất
            </button>
          </div>
        </template>

        <!-- Chưa đăng nhập -->
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
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import notification from "@/components/client/notification.vue";
import { getUnreadNotificationCount } from "@/services/user";

const auth = useAuthStore();
const router = useRouter();

const showMenu = ref(false);
const showNotifications = ref(false);
const unreadCount = ref(0);

const refreshUnreadCount = async () => {
  if (!auth.isLoggedIn) return;
  try {
    const res = await getUnreadNotificationCount();
    if (res.data.success) {
      unreadCount.value = res.data.data;
    }
  } catch (err) {
    console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", err);
  }
};
// khi thay đổi tài khoảng
watch(
  () => auth.isLoggedIn,
  (newVal) => {
    if (newVal) {
      refreshUnreadCount();
    }
  }
);

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (!showNotifications.value) {
    refreshUnreadCount();
  }
};

const toggleDropdown = () => {
  showMenu.value = !showMenu.value;
};

const handleClickOutside = (e) => {
  if (!e.target.closest(".notif-dropdown") && !e.target.closest(".notif-btn")) {
    if (showNotifications.value) {
      showNotifications.value = false;
      setTimeout(() => {
        refreshUnreadCount();
      }, 2000);
    }
  }
  if (!e.target.closest(".dropdown-menu") && !e.target.closest(".avatar")) {
    showMenu.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  refreshUnreadCount();
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});

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

.notif-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  position: relative;
  cursor: pointer;
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}

.notif-dropdown {
  position: absolute;
  right: 40px;
  top: 45px;
  z-index: 999;
  width: 320px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
