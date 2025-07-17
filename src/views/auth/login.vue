<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="card login-card p-4 shadow-lg text-light">
      <h3 class="text-center mb-4">Đăng nhập</h3>

      <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
      <p v-if="successMessage" class="text-success text-center mt-3">
        {{ successMessage }}
      </p>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            class="form-control dark-input"
            id="username"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            class="form-control dark-input"
            id="password"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
        <div class="text-center mt-3 mb-2">
          <span>Bạn chưa có tài khoản?</span>
          <a @click.prevent="goToRegister" href="#" class="text-primary ms-1"
            >Đăng ký ngay</a
          >
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);
const successMessage = ref(null);

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  error.value = null;
  successMessage.value = null;
  loading.value = true;
  try {
    await authStore.login({
      tenDangNhap: username.value,
      matKhau: password.value,
    });
    successMessage.value = "Đăng nhập thành công. Đang chuyển trang...";

    setTimeout(() => {
      if (authStore.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }, 2000);
  } catch (err) {
    error.value = err;
    setTimeout(() => {
      error.value = null;
    }, 3000);
  } finally {
    loading.value = false;
  }
};
const goToRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  background-color: #1e1e1e;
  border: none;
  color: #eee;
}

.dark-input {
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
}

.dark-input::placeholder {
  color: #aaa;
}

.form-label {
  color: #ccc;
}
</style>
