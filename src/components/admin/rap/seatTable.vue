<template>
  <div v-if="phongChieuId" class="mt-4">
    <div class="d-flex gap-4 align-items-start flex-wrap">
      <!-- Ghế + màn hình -->
      <div class="card shadow-sm seat-layout">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Danh sách ghế – {{ roomName }}</h5>
        </div>
        <div class="card-body">
          <div class="screen mb-4 text-center text-muted fw-bold">MÀN HÌNH</div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else class="d-flex flex-column align-items-center">
            <div
              v-for="(row, rowIndex) in seatMatrix"
              :key="rowIndex"
              class="d-flex justify-content-center mb-3 seat-row"
            >
              <button
                v-for="seat in row"
                :key="seat.id"
                type="button"
                :class="[
                  'btn mx-1 seat-btn',
                  seat.id === selectedSeat?.id
                    ? 'selected-seat'
                    : seat.loaiGhe?.ten === 'VIP'
                      ? 'btn-danger'
                      : 'btn-outline-primary',
                ]"
                @click="selectSeat(seat)"
              >
                {{ seat.hang + seat.cot }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-grow-1 flex-basis-0">
        <seatType
          v-if="selectedSeat"
          :seat="selectedSeat"
          :seat-types="seatTypes"
          @close="selectedSeat = null"
          @updated="handleSeatUpdated"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { getSeatsByRoom, getAllSeatType } from "@/services/rap";
import seatType from "./seatType.vue";

const props = defineProps({
  phongChieuId: Number,
  roomName: String,
});

const loading = ref(false);
const seats = ref([]);
const seatTypes = ref([]);
const selectedSeat = ref(null);

const seatMatrix = ref([]);

const loadSeats = async () => {
  if (!props.phongChieuId) return;
  loading.value = true;
  try {
    const res = await getSeatsByRoom(props.phongChieuId);
    seats.value = res.data.data;
    buildSeatMatrix();
    if (seats.value.length > 0) {
      selectedSeat.value = seats.value[0];
    }
  } finally {
    loading.value = false;
  }
};

const buildSeatMatrix = () => {
  const grouped = {};
  for (const seat of seats.value) {
    if (!grouped[seat.hang]) grouped[seat.hang] = [];
    grouped[seat.hang].push(seat);
  }
  seatMatrix.value = Object.keys(grouped)
    .sort()
    .map((hang) => grouped[hang].sort((a, b) => a.cot - b.cot).slice(0, 10));
};

const loadSeatTypes = async () => {
  const res = await getAllSeatType();
  seatTypes.value = res.data.data;
};

const selectSeat = (seat) => {
  selectedSeat.value = seat;
};

const handleSeatUpdated = async () => {
  await loadSeats();
};

watch(
  () => props.phongChieuId,
  () => {
    loadSeats();
  }
);

onMounted(() => {
  loadSeatTypes();
  loadSeats();
});
</script>

<style scoped>
.seat-layout {
  flex-grow: 1;
  flex-basis: 0;
  min-width: 650px;
  max-width: 650px;
  width: 100%;
}

.seat-btn {
  margin-top: 2px;
  min-width: 42px;
  height: 40px;
  width: 52px;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s;
}

.seat-btn:hover {
  transform: translateY(-2px);
  border: 2px solid #007bff;
  box-shadow: 0 6px 18px rgba(0, 123, 255, 0.2);
}

.selected-seat {
  background-color: #198754 !important;
  color: white !important;
  border: 2px solid #198754 !important;
  box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.4);
}

.seat-row {
  flex-wrap: nowrap;
  overflow-x: auto;
}

.screen {
  height: 30px;
  background: linear-gradient(135deg, #ddd, #fff);
  border-top-left-radius: 80% 30px;
  border-top-right-radius: 80% 30px;
  border-bottom: 4px solid #ccc;
  line-height: 30px;
  font-size: 14px;
  color: #555;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
