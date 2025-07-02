<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Thêm Khuyến Mãi</h3>

      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Mã khuyến mãi</label>
          <input v-model="form.ma" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Mô tả</label>
          <textarea
            v-model="form.moTa"
            class="form-control"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Phần trăm giảm</label>
          <input
            v-model.number="form.phanTramGiam"
            type="number"
            class="form-control"
            min="1"
            max="100"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Loại áp dụng</label>
          <select v-model="form.loaiApDung" class="form-control" required>
            <option value="tatca">Tất cả</option>
            <option value="ve">Chỉ vé</option>
            <option value="combo">Chỉ combo</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Ngày bắt đầu</label>
          <input
            v-model="form.ngayBatDau"
            type="date"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Ngày kết thúc</label>
          <input
            v-model="form.ngayKetThuc"
            type="date"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Ảnh khuyến mãi</label>
          <input
            type="file"
            @change="handleFileUpload"
            class="form-control"
            accept="image/*"
            required
          />
          <div v-if="preview" class="mt-2 text-center">
            <img :src="preview" alt="Preview" class="img-preview" />
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Thêm</button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import Swal from "sweetalert2";
import { createPromotion } from "@/services/promotion";

const emit = defineEmits(["close", "created"]);

const form = reactive({
  ma: "",
  moTa: "",
  phanTramGiam: 10,
  loaiApDung: "all",
  ngayBatDau: "",
  ngayKetThuc: "",
});

const file = ref(null);
const preview = ref(null);

const handleFileUpload = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  file.value = f;
  preview.value = URL.createObjectURL(f);
};

const submitForm = async () => {
  if (!file.value) return;

  const formData = new FormData();
  formData.append("ma", form.ma);
  formData.append("moTa", form.moTa);
  formData.append("phanTramGiam", form.phanTramGiam);
  formData.append("loaiApDung", form.loaiApDung);
  formData.append("ngayBatDau", form.ngayBatDau);
  formData.append("ngayKetThuc", form.ngayKetThuc);
  formData.append("promotion", file.value);

  try {
    await createPromotion(formData);
    await Swal.fire({
      icon: "success",
      title: "Tạo khuyến mãi thành công",
      showConfirmButton: false,
      timer: 1500,
    });
    emit("created");
    emit("close");
  } catch (err) {
    console.error("Lỗi tạo khuyến mãi", err);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: err.response?.data?.message || "Không thể tạo khuyến mãi",
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 95%;
}
.img-preview {
  max-width: 160px;
  max-height: 160px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
