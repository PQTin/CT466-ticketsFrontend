<template>
  <div v-if="seats.length > 0" class="seat-layout-container">
    <div class="screen text-center">MÀN HÌNH</div>

    <div class="seats-grid">
      <div
        v-for="(row, index) in seatMatrix"
        :key="index"
        class="seat-row d-flex justify-content-center mb-3"
      >
        <div
          v-for="seat in row"
          :key="seat.id"
          class="seat-card"
          :class="seatClass(seat)"
          @click="selectSeat(seat)"
        >
          <div class="seat-name">{{ seat.hang + seat.cot }}</div>
          <div class="seat-type small">{{ seat.loaiGhe?.ten }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-white text-center py-5">
    Đang tải ghế hoặc chưa có dữ liệu...
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { getSeatsByShowtime } from "@/services/showtimeCombo";

// Props
const props = defineProps({
  idLichChieu: {
    type: Number,
    required: true,
  },
});

// Emit
const emit = defineEmits(["select-seat"]);

// State
const seats = ref([]);
const seatMatrix = ref([]);
const selectedSeatId = ref(null);

// Watch khi idLichChieu thay đổi để fetch ghế mới
watch(
  () => props.idLichChieu,
  (newVal) => {
    if (newVal) fetchSeats(newVal);
  },
  { immediate: true }
);

// Fetch danh sách ghế từ API
async function fetchSeats(lichChieuId) {
  try {
    const res = await getSeatsByShowtime(lichChieuId);
    seats.value = res.data.data || [];
    buildSeatMatrix();
  } catch (err) {
    console.error("Lỗi khi tải danh sách ghế:", err);
  }
}

// Tạo ma trận ghế theo hàng và cột
function buildSeatMatrix() {
  const grouped = {};
  seats.value.forEach((seat) => {
    if (!grouped[seat.hang]) grouped[seat.hang] = [];
    grouped[seat.hang].push(seat);
  });

  seatMatrix.value = Object.keys(grouped)
    .sort()
    .map((hang) => grouped[hang].sort((a, b) => a.cot - b.cot).slice(0, 10));
}

// Tính class cho ghế (đã đặt / đang chọn / còn trống)
function seatClass(seat) {
  if (seat.trangThai !== "trong") return "seat-booked";
  if (seat.id === selectedSeatId.value) return "seat-selected";
  return "seat-available";
}

// Chọn ghế
function selectSeat(seat) {
  if (seat.trangThai !== "trong") return;
  selectedSeatId.value = seat.id;

  emit("select-seat", {
    id: seat.id,
    hang: seat.hang,
    cot: seat.cot,
    loai: seat.loaiGhe?.ten,
    giaPhu: seat.loaiGhe?.giaPhu,
  });
}
</script>

<style scoped>
.seat-layout-container {
  background: #1e1e1e;
  padding: 1rem;
  border-radius: 12px;
  color: white;
  min-height: 400px;
  min-width: 650px;
  max-width: 650px;
}

.screen {
  background: linear-gradient(to right, #aaa, #ccc);
  border-top-left-radius: 80% 30px;
  border-top-right-radius: 80% 30px;
  padding: 10px 0;
  margin-bottom: 2rem;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 6px rgba(255, 255, 255, 0.1);
}

.seats-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.seat-row {
  display: flex;
  gap: 0.5rem;
}

.seat-card {
  width: 52px;
  height: 60px;
  background: #333;
  border-radius: 8px;
  text-align: center;
  padding: 4px;
  cursor: pointer;
  transition: 0.2s ease;
  font-size: 13px;
}

.seat-card:hover {
  transform: translateY(-2px);
}

.seat-name {
  font-weight: 600;
}

.seat-type {
  font-size: 12px;
  color: #aaa;
}

/* trạng thái */
.seat-available {
  background-color: #444;
  border: 2px solid #777;
}

.seat-booked {
  background-color: #ffd966;
  cursor: not-allowed;
  color: black;
  border: 2px solid #e0c04c;
}

.seat-selected {
  background-color: #28a745;
  color: white;
  border: 2px solid #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.6);
}
</style>
