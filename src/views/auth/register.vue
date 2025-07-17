<template>
  <div
    class="container d-flex justify-content-center align-items-center vh-100"
  >
    <div class="card register-card p-4 shadow-lg text-light">
      <h3 class="text-center mb-3">Đăng ký tài khoản</h3>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">Tên đăng nhập</label>
          <input
            v-model="form.tenDangNhap"
            class="form-control dark-input"
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control dark-input"
            placeholder="Nhập email"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Số điện thoại</label>
          <input
            v-model="form.soDienThoai"
            type="tel"
            class="form-control dark-input"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="form.matKhau"
            type="password"
            class="form-control dark-input"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Xác nhận mật khẩu</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="form-control dark-input"
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>

        <button class="btn btn-primary w-100" type="submit" :disabled="loading">
          {{ loading ? "Đang đăng ký..." : "Đăng ký" }}
        </button>

        <p class="text-center mt-3">
          Bạn đã có tài khoản?
          <router-link to="/login" class="text-decoration-underline text-info">
            Đăng nhập ngay
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { register } from "@/services/auth";

const router = useRouter();
const loading = ref(false);

const form = ref({
  tenDangNhap: "",
  email: "",
  soDienThoai: "",
  matKhau: "",
});
const confirmPassword = ref("");

const handleRegister = async () => {
  loading.value = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.value.email)) {
    Swal.fire({
      icon: "warning",
      title: "Email không hợp lệ",
      text: "Vui lòng nhập đúng định dạng email.",
    });
    loading.value = false;
    return;
  }
  const phonePattern = /^0\d{9}$/;
  if (!phonePattern.test(form.value.soDienThoai)) {
    Swal.fire({
      icon: "warning",
      title: "Số điện thoại không hợp lệ",
      text: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.",
    });
    loading.value = false;
    return;
  }
  if (form.value.matKhau.length < 6) {
    Swal.fire({
      icon: "warning",
      title: "Mật khẩu quá ngắn",
      text: "Mật khẩu phải có ít nhất 6 ký tự.",
    });
    loading.value = false;
    return;
  }

  if (form.value.matKhau !== confirmPassword.value) {
    Swal.fire({
      icon: "warning",
      title: "Mật khẩu không khớp",
      text: "Xác nhận mật khẩu không đúng.",
    });
    loading.value = false;
    return;
  }

  try {
    const payload = {
      ...form.value,
      vaiTro: "client",
    };

    const res = await register(payload);

    Swal.fire({
      icon: "success",
      title: "Đăng ký thành công!",
      text: res.message || "Bạn sẽ được chuyển đến trang đăng nhập.",
    });

    router.push("/login");
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Đăng ký thất bại",
      text: err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-card {
  width: 100%;
  max-width: 420px;
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
