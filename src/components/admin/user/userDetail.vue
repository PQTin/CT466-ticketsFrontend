<template>
  <div class="card p-4 border-0 shadow-sm">
    <h5 class="mb-3">Thông tin người dùng</h5>

    <form @submit.prevent="handleSubmit">
      <div class="row g-3 align-items-center">
        <!-- Avatar -->
        <div class="col-md-4 text-center">
          <img
            :src="avatarPreview"
            class="rounded-circle shadow"
            style="width: 120px; height: 120px; object-fit: cover"
            alt="avatar"
          />
          <input type="file" class="form-control mt-2" @change="handleFile" />
          <div class="mt-4 d-flex gap-2">
            <button class="btn btn-outline-primary" type="submit">
              Lưu thay đổi
            </button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              @click="resetForm"
            >
              Đặt lại
            </button>
          </div>
        </div>

        <!-- Thông tin -->
        <div class="col-md-8">
          <div class="mb-3">
            <label class="form-label">Tên đăng nhập</label>
            <input v-model="form.tenDangNhap" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Số điện thoại</label>
            <input v-model="form.soDienThoai" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Vai trò</label>
            <select v-model="form.vaiTro" class="form-select">
              <option value="admin">Quản trị</option>
              <option value="client">Khách hàng</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Trạng thái</label>
            <select v-model="form.trangThai" class="form-select">
              <option value="good">Bình thường</option>
              <option value="bad">Bị khoá</option>
            </select>
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
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import Swal from "sweetalert2";
import { updateUserByAdmin } from "@/services/user";

const props = defineProps({
  user: Object,
});
const emit = defineEmits(["updated"]);

const form = ref({ ...props.user });
const avatarFile = ref(null);
const isLoading = ref(false);

// Khi props.user thay đổi, reset form theo
watch(
  () => props.user,
  (newUser) => {
    form.value = { ...newUser };
    avatarFile.value = null;
  }
);

const avatarPreview = computed(() => {
  if (avatarFile.value) {
    return URL.createObjectURL(avatarFile.value);
  }
  return form.value.duongDanAvatar
    ? `http://localhost:3000/uploads/${form.value.duongDanAvatar}`
    : "/default-avatar.png";
});

const handleFile = (e) => {
  const file = e.target.files[0];
  if (file) avatarFile.value = file;
};

const resetForm = () => {
  form.value = { ...props.user };
  avatarFile.value = null;
};

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    for (const key in form.value) {
      if (form.value[key] !== null && form.value[key] !== undefined) {
        formData.append(key, form.value[key]);
      }
    }
    if (avatarFile.value) {
      formData.append("avatar", avatarFile.value);
    }
    if (form.value.matKhau) {
      formData.append("matKhau", form.value.matKhau);
    }
    const response = await updateUserByAdmin(form.value.id, formData);
    const message = response.data.message;
    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: message,
    });

    emit("updated", form.value.id);
  } catch (err) {
    console.error("Lỗi khi cập nhật:", err);
    Swal.fire({
      icon: "error",
      title: "Cập nhật thất bại",
      text: err.response?.data?.message,
    });
    resetForm();
  } finally {
    isLoading.value = false;
  }
};
</script>
