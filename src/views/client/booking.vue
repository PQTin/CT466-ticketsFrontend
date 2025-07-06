<template>
  <div
    v-if="isAuthorized"
    class="booking-wrapper container-fluid py-4 text-white"
  >
    <div class="d-flex gap-4">
      <!-- Cột trái: ghế + thông tin -->
      <div class="left-panel">
        <div v-if="showtime" class="mb-3 text-muted lh-sm">
          <div class="fs-5 fw-bold text-white mb-1">
            {{ showtime.tenPhim }} – {{ formatPrice(showtime.giaVe) }} VNĐ –
            {{ formatDateTime(showtime.batDau) }}
          </div>
          <div class="mb-2 fw-bold text-white">
            {{ showtime.tenChiNhanh }} – {{ showtime.tenPhong }}
          </div>
          <div class="text-uppercase fw-semibold text-light mb-2">
            🎟 Chọn ghế
          </div>
        </div>
        <seat-table
          v-if="showtime"
          :idLichChieu="showtime.idLichChieu"
          @select-seat="handleSelectSeat"
        />
      </div>

      <!-- Cột phải: thanh toán -->
      <div class="right-panel flex-grow-1">
        <div class="card bg-dark text-white mb-4" style="min-height: 500px">
          <div class="card-body">
            <payment-info
              :showtime-id="showtime?.idLichChieu || 12"
              :selected-seat="selectedSeat"
              :base-price="Number(showtime?.giaVe || 0)"
              :selected-combos="selectedCombos"
              @remove-combo="handleRemoveCombo"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Combo: full width dưới cùng -->
    <div class="combo-section bg-dark text-white mt-4 w-100">
      <h5 class="fw-bold mb-3 px-2">🍿 Chọn combo</h5>
      <combo-card
        :selectedComboIds="selectedCombos.map((c) => c.id)"
        @add-combo="handleAddCombo"
        @remove-combo="handleRemoveCombo"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import Swal from "sweetalert2";

import { getShowtimeById } from "@/services/showtimeCombo";
import seatTable from "@/components/client/booking/seatTable.vue";
import comboCard from "@/components/client/booking/comboCard.vue";
import paymentInfo from "@/components/client/booking/paymentInfo.vue";

// Biến
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const showtime = ref(null);
const selectedCombos = ref([]);
const selectedSeat = ref(null);

const isAuthorized = ref(false);

const fetchShowtime = async () => {
  try {
    const id = route.params.idLichChieu;
    const res = await getShowtimeById(id);
    showtime.value = res.data.data;
  } catch (err) {
    console.error("Lỗi khi tải lịch chiếu:", err);
  }
};

const handleSelectSeat = (seat) => {
  selectedSeat.value = seat;
};

const handleAddCombo = (combo) => {
  if (!selectedCombos.value.find((c) => c.id === combo.id)) {
    selectedCombos.value.push({ ...combo, soLuong: 1 });
  }
};

const handleRemoveCombo = (combo) => {
  selectedCombos.value = selectedCombos.value.filter((c) => c.id !== combo.id);
};

const formatPrice = (value) => {
  return Number(value).toLocaleString("vi-VN");
};

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Kiểm tra đăng nhập và load dữ liệu
onMounted(async () => {
  if (!auth.isLoggedIn) {
    const result = await Swal.fire({
      title: "Bạn chưa đăng nhập",
      text: "Vui lòng đăng nhập để đặt vé.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng nhập",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      router.push("/login");
    } else {
      router.push("/home");
    }
    return;
  }
  isAuthorized.value = true;
  await fetchShowtime();
});
</script>

<style scoped>
.booking-wrapper {
  background-color: #1e1e1e;
  min-height: 100vh;
}

.left-panel {
  max-width: 700px;
  width: 100%;
}

.right-panel {
  min-width: 300px;
}

.combo-section {
  padding: 1rem 0;
}
</style>
