<template>
  <div class="card bg-dark text-white">
    <div class="card-body">
      <!-- Phần ghế và giá vé -->
      <div v-if="selectedSeat" class="mb-4 border-bottom pb-3">
        <h5 class="fw-bold mb-2">Ghế đã chọn</h5>
        <div class="d-flex justify-content-between">
          <span>Ghế: {{ selectedSeat.hang + selectedSeat.cot }}</span>
          <span>{{ formatPrice(giaVeGoc) }} VNĐ</span>
        </div>
      </div>

      <!-- Danh sách combo đã chọn -->
      <div v-if="selectedCombos.length > 0" class="mb-4 border-bottom pb-3">
        <h5 class="fw-bold mb-3">Combo đã chọn</h5>
        <div class="combo-list-scroll">
          <div
            v-for="combo in selectedCombos"
            :key="combo.id"
            class="d-flex mb-3 align-items-center gap-3"
          >
            <img
              :src="`http://localhost:3000/uploads/${combo.duongDanAnh}`"
              class="rounded shadow-sm"
              style="width: 100px; height: 60px; object-fit: cover"
            />
            <div class="flex-grow-1">
              <div class="fw-semibold">{{ combo.ten }}</div>
              <div class="text-danger fw-bold">
                {{ formatPrice(combo.gia * (combo.soLuong || 1)) }} VNĐ
              </div>
            </div>
            <div class="d-flex flex-column align-items-end">
              <input
                type="number"
                min="1"
                class="form-control form-control-sm combo-input w-100 mb-1"
                v-model.number="combo.soLuong"
                @input="calculateLocalTotal"
              />
              <button
                class="btn btn-sm btn-outline-danger"
                @click="emit('remove-combo', combo)"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nhập mã giảm giá -->
      <div class="mb-4 border-bottom pb-3">
        <h5 class="fw-bold mb-2">Mã khuyến mãi</h5>
        <div class="d-flex gap-2">
          <input
            v-model="promotionCode"
            type="text"
            class="form-control form-control-sm"
            placeholder="Nhập mã..."
          />
          <button class="btn btn-sm btn-primary" @click="applyPromotion">
            Áp dụng
          </button>
        </div>
        <div v-if="discount > 0" class="text-success mt-2">
          Đã áp dụng giảm {{ formatPrice(discount) }} VNĐ
        </div>
      </div>

      <!-- Tổng tiền -->
      <div class="d-flex flex-column align-items-end mt-3">
        <div class="fw-bold fs-5 mb-2">
          Tổng tiền: {{ formatPrice(totalPrice) }} VNĐ
        </div>
        <button class="btn btn-outline-success" @click="handleBooking">
          Đặt vé
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { paymentCalculator, bookTicket } from "@/services/booking";
import Swal from "sweetalert2";

// Props
const props = defineProps({
  selectedSeat: Object,
  basePrice: Number,
  selectedCombos: Array,
  showtimeId: Number,
});

// Emit
const emit = defineEmits(["remove-combo", "booking-success"]);

// State
const promotionCode = ref("");
const discount = ref(0);
const totalPrice = ref(0);
const giaVeGoc = ref(0);
const comboTotal = ref(0);

// Helper
const formatPrice = (value) => Number(value).toLocaleString("vi-VN");

// Watch selectedCombos và selectedSeat để tính lại
watch(
  () => [props.selectedCombos, props.selectedSeat],
  () => calculateLocalTotal(),
  { deep: true }
);

// Hàm tính tổng tiền (local)
function calculateLocalTotal() {
  if (!props.selectedSeat) return;

  const seatFee = Number(props.selectedSeat.giaPhu || 0);
  const seatTotal = Number(props.basePrice || 0) + seatFee;
  giaVeGoc.value = seatTotal;

  comboTotal.value = props.selectedCombos.reduce((acc, combo) => {
    return acc + combo.gia * (combo.soLuong || 1);
  }, 0);

  totalPrice.value = seatTotal + comboTotal.value;
  discount.value = 0;
}

// Áp mã giảm giá
async function applyPromotion() {
  if (!props.selectedSeat || !props.showtimeId) return;

  try {
    const comboList = props.selectedCombos.map((c) => ({
      comboId: c.id,
      soLuong: c.soLuong || 1,
    }));

    const res = await paymentCalculator({
      lichChieuId: props.showtimeId,
      gheId: props.selectedSeat.id,
      comboList,
      maGiamGia: promotionCode.value.trim(),
    });

    if (!res.data.success) throw new Error("Response not success");

    const result = res.data.data;
    giaVeGoc.value = result.giaVeGoc;
    totalPrice.value = result.tongSauGiam;
    discount.value = result.giamGia || 0;

    if (result.trangThaiMa === "valid") {
      Swal.fire({
        icon: "success",
        title: "Áp dụng thành công!",
        text: `Đã giảm ${formatPrice(discount.value)} VNĐ`,
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Không có mã khuyến mãi",
        text: "Tổng tiền được tính theo giá gốc.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: err.response?.data?.message || "Không thể áp dụng mã khuyến mãi.",
    });
  }
}

// Đặt vé
async function handleBooking() {
  if (!props.selectedSeat || !props.showtimeId) {
    Swal.fire({
      icon: "warning",
      title: "Chưa chọn ghế",
      text: "Vui lòng chọn ghế trước khi đặt vé.",
    });
    return;
  }
  try {
    const comboList = props.selectedCombos.map((c) => ({
      comboId: c.id,
      soLuong: c.soLuong || 1,
    }));

    const res = await bookTicket({
      lichChieuId: props.showtimeId,
      gheId: props.selectedSeat.id,
      daThanhToan: false,
      comboList,
      maGiamGia: promotionCode.value.trim() || null,
    });

    if (res.data.success) {
      Swal.fire({
        icon: "success",
        title: "Đặt vé thành công!",
        text: "Vui lòng đến rạp thanh toán trước giờ chiếu 15 phút.",
        timer: 2500,
        showConfirmButton: false,
      });

      emit("booking-success", res.data.data);
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: err.response?.data?.message || "Không thể đặt vé.",
    });
  }
}

onMounted(() => {
  calculateLocalTotal();
});
</script>

<style scoped>
.combo-list-scroll {
  max-height: 220px;
  overflow-y: auto;
  padding-right: 6px;
}
.combo-list-scroll::-webkit-scrollbar {
  width: 6px;
}
.combo-list-scroll::-webkit-scrollbar-thumb {
  background-color: #777;
  border-radius: 3px;
}
.combo-input {
  background-color: #2c2c2c;
  color: white;
  border: 1px solid #555;
}
</style>
