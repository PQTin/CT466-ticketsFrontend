<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Thêm Combo</h3>

      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Tên Combo</label>
          <input v-model="form.ten" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Mô Tả</label>
          <textarea
            v-model="form.moTa"
            class="form-control"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Giá</label>
          <input
            v-model.number="form.gia"
            type="number"
            class="form-control"
            min="0"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Ảnh Combo</label>
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
import { createCombo } from "@/services/showtimeCombo";

const emit = defineEmits(["close", "created"]);

const form = reactive({
  ten: "",
  moTa: "",
  gia: 0,
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
  formData.append("ten", form.ten);
  formData.append("moTa", form.moTa);
  formData.append("gia", form.gia);
  formData.append("combo", file.value);

  try {
    await createCombo(formData);
    await Swal.fire({
      icon: "success",
      title: "Thêm combo thành công",
      showConfirmButton: false,
      timer: 1500,
    });
    emit("created");
    emit("close");
  } catch (err) {
    console.error("Lỗi thêm combo", err);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: err.response?.data?.message || "Không thể thêm combo",
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
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-content {
  background: #fdfdfd;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 95%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
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
