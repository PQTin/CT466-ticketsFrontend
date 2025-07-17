<template>
  <div class="container py-4 text-light">
    <h2 class="mb-4">Thông tin cá nhân</h2>

    <div v-if="user" class="card custom-card">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <div class="row g-4">
            <!-- Avatar -->
            <div class="col-md-4 text-center">
              <img
                :src="avatarPreview || getAvatarUrl(user.duongDanAvatar)"
                class="img-thumbnail mb-3 rounded-circle"
                style="width: 160px; height: 160px; object-fit: cover"
              />
              <input
                type="file"
                class="form-control form-control-sm file-input"
                @change="handleFileChange"
              />
            </div>

            <!-- Cột 1 -->
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input
                  v-model="form.tenDangNhap"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input
                  v-model="form.soDienThoai"
                  type="text"
                  class="form-control"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Vai trò</label>
                <input
                  :value="user.vaiTro"
                  class="form-control read-only"
                  disabled
                />
              </div>
            </div>

            <!-- Cột 2 -->
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Trạng thái</label>
                <input
                  :value="user.trangThai"
                  class="form-control read-only"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu mới</label>
                <input
                  v-model="form.matKhau"
                  type="password"
                  class="form-control"
                  placeholder="Để trống nếu không đổi"
                />
              </div>
              <div class="mb-3" v-if="form.matKhau">
                <label class="form-label">Mật khẩu cũ</label>
                <input
                  v-model="form.matKhauCu"
                  type="password"
                  class="form-control"
                  placeholder="Nhập mật khẩu cũ"
                  required
                />
              </div>
            </div>
          </div>

          <div class="text-end mt-3">
            <button
              type="submit"
              class="btn btn-primary px-4"
              :disabled="loading"
            >
              {{ loading ? "Đang cập nhật..." : "Cập nhật thông tin" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="text-center mt-5">
      <div class="spinner-border text-light" role="status"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCurrentUser } from "@/services/user";
import { updateUser } from "@/services/auth";
import Swal from "sweetalert2";

const user = ref(null);
const form = ref({
  tenDangNhap: "",
  email: "",
  soDienThoai: "",
  matKhau: "",
  matKhauCu: "",
});
const avatarFile = ref(null);
const avatarPreview = ref(null);
const loading = ref(false);

onMounted(async () => {
  try {
    const { data } = await getCurrentUser();
    user.value = data.data;

    form.value = {
      tenDangNhap: data.data.tenDangNhap,
      email: data.data.email,
      soDienThoai: data.data.soDienThoai || "",
      matKhau: "",
      matKhauCu: "",
    };
  } catch (err) {
    Swal.fire("Lỗi", "Không thể tải thông tin người dùng", "error");
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
};

const getAvatarUrl = (path) => {
  return `http://localhost:3000/uploads/${path}`;
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    const formData = new FormData();
    formData.append("tenDangNhap", form.value.tenDangNhap);
    formData.append("email", form.value.email);
    formData.append("soDienThoai", form.value.soDienThoai);
    if (form.value.matKhau) {
      formData.append("matKhau", form.value.matKhau);
      formData.append("matKhauCu", form.value.matKhauCu || "");
    }
    if (avatarFile.value) {
      formData.append("avatar", avatarFile.value);
    }

    const result = await updateUser(formData);
    user.value = result.user;

    // Reset form
    form.value.matKhau = "";
    form.value.matKhauCu = "";
    avatarFile.value = null;
    avatarPreview.value = null;

    Swal.fire("Thành công", "Thông tin đã được cập nhật!", "success");
  } catch (err) {
    Swal.fire(
      "Lỗi",
      err.response?.data?.message || "Cập nhật thất bại",
      "error"
    );
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.custom-card {
  background-color: #1f1f1f;
  border: none;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
}
.form-control {
  background-color: #2b2b2b;
  color: #fff;
  border: 1px solid #444;
}
.form-control::placeholder {
  color: #bbb;
}
.read-only {
  background-color: #444 !important;
  color: #ccc !important;
  cursor: not-allowed;
}
.file-input {
  background-color: #2b2b2b;
  color: #fff;
  border: 1px solid #555;
}
.form-label {
  font-weight: 500;
  color: #eee;
}
</style>
