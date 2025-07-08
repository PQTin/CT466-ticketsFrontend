<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h4 class="mb-3">Thêm Phòng Mới</h4>
      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Tên Phòng</label>
          <input
            type="text"
            v-model="roomData.name"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Số Ghế</label>
          <input
            type="number"
            v-model="roomData.total_seats"
            class="form-control"
            min="1"
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
import { createRoom } from "@/services/rap";

const props = defineProps({
  chiNhanhId: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(["close", "room-added"]);

const roomData = ref({
  name: "",
  total_seats: 40,
});

const submitForm = async () => {
  try {
    await createRoom({
      chiNhanhId: props.chiNhanhId,
      ten: roomData.value.name,
      tongSoGhe: roomData.value.total_seats,
    });

    Swal.fire("Thành công", "Đã tạo phòng mới!", "success");
    emits("room-added");
    emits("close");
  } catch (error) {
    Swal.fire(
      "Lỗi",
      error.response?.data?.message || "Tạo phòng thất bại",
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
  width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
