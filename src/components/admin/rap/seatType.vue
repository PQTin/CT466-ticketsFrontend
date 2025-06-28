<template>
  <div class="card shadow-sm">
    <div class="card-header bg-light">
      <strong>Thông tin ghế</strong>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <div><strong>Mã ghế:</strong> {{ seat.hang + seat.cot }}</div>
        <div>
          <strong>Loại hiện tại:</strong> {{ seat.LoaiGhe?.ten || "Không có" }}
        </div>
      </div>

      <div class="mb-3">
        <label for="seat-type-select" class="form-label">
          Chọn loại ghế mới
        </label>
        <select
          id="seat-type-select"
          class="form-select"
          v-model="selectedLoaiGhe"
        >
          <option :value="null" disabled>-- Chọn loại ghế --</option>
          <option v-for="type in seatTypes" :key="type.id" :value="type.id">
            {{ type.ten }}
          </option>
        </select>
      </div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-outline-secondary" @click="$emit('close')">
          Đóng
        </button>
        <button
          class="btn btn-outline-primary"
          :disabled="selectedLoaiGhe === seat.loaiGhe?.id || loading"
          @click="handleUpdate"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Cập nhật
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { updateSeatTypeForSeat } from "@/services/rap";
import Swal from "sweetalert2";

const props = defineProps({
  seat: {
    type: Object,
    required: true,
  },
  seatTypes: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits(["close", "updated"]);
const selectedLoaiGhe = ref(props.seat.loaiGhe?.id || null);
const loading = ref(false);

watch(
  () => props.seat,
  (newSeat) => {
    selectedLoaiGhe.value = newSeat.loaiGhe?.id || null;
  }
);

const handleUpdate = async () => {
  if (!selectedLoaiGhe.value) {
    return Swal.fire("Cảnh báo", "Vui lòng chọn loại ghế mới", "warning");
  }

  loading.value = true;
  try {
    await updateSeatTypeForSeat(props.seat.id, selectedLoaiGhe.value);
    await Swal.fire("Thành công", "Cập nhật loại ghế thành công", "success");
    emits("updated");
    emits("close");
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Cập nhật thất bại", "error");
  } finally {
    loading.value = false;
  }
};
</script>
