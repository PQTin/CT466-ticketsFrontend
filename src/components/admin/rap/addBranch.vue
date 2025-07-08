<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h4 class="mb-3">Thêm Chi Nhánh Mới</h4>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Tên Chi Nhánh</label>
          <input
            type="text"
            v-model="branchData.ten"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Địa Chỉ</label>
          <input
            type="text"
            v-model="branchData.diaChi"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Số Điện Thoại</label>
          <input
            type="tel"
            v-model="branchData.soDienThoai"
            class="form-control"
            required
          />
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
import { ref } from "vue";
import Swal from "sweetalert2";
import { createBranch } from "@/services/rap";

const emits = defineEmits(["close", "branch-added"]);

const branchData = ref({
  ten: "",
  diaChi: "",
  soDienThoai: "",
});

const submitForm = async () => {
  try {
    await createBranch(branchData.value);
    Swal.fire("Thành công", "Đã tạo chi nhánh mới!", "success");
    emits("branch-added");
    emits("close");
  } catch (error) {
    Swal.fire(
      "Lỗi",
      error.response?.data?.message || "Tạo chi nhánh thất bại",
      "error"
    );
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fdfdfd;
  padding: 24px;
  border-radius: 10px;
  width: 450px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
