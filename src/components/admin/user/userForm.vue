<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3 class="mb-3">Thêm Người Dùng</h3>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">Tên đăng nhập</label>
          <input v-model="form.tenDangNhap" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="form.matKhau"
            type="password"
            class="form-control"
            required
          />
        </div>

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
          <label class="form-label">Số điện thoại</label>
          <input v-model="form.soDienThoai" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Vai trò</label>
          <select v-model="form.vaiTro" class="form-select" required>
            <option value="client">Khách hàng</option>
            <option value="admin">Quản trị</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-outline-success">Thêm</button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="$emit('close')"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import Swal from "sweetalert2";
import { registerUserByAdmin } from "@/services/user";

const emit = defineEmits(["created", "close"]);

const form = reactive({
  tenDangNhap: "",
  matKhau: "",
  email: "",
  soDienThoai: "",
  vaiTro: "client",
});

const handleSubmit = async () => {
  try {
    await registerUserByAdmin(form);
    await Swal.fire({
      icon: "success",
      title: "Thêm người dùng thành công",
      timer: 1500,
      showConfirmButton: false,
    });
    emit("created");
    emit("close");
  } catch (err) {
    console.error("Lỗi thêm người dùng:", err);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: err.response?.data?.message || "Không thể thêm người dùng.",
    });
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 500px;
  max-width: 95%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
</style>
