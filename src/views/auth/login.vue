<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px">
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
            class="form-control"
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
            class="form-control"
            id="password"
            placeholder="Nhập mật khẩu"
            required
          />
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
  } catch (err) {
    error.value = err;
    setTimeout(() => {
      error.value = null;
    }, 3000);
  } finally {
    loading.value = false;
  }
};
</script>
