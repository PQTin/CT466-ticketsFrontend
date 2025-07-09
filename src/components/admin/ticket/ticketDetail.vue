<template>
  <div class="expanded-view overflow-auto">
    <div class="card p-4 border-0 shadow-sm">
      <h5 class="mb-4">Thông tin chi tiết vé</h5>
      <div class="row g-4">
        <!-- Cột 1 -->
        <div class="col-md-4">
          <div class="mb-2">
            <strong>Phim:</strong> {{ selectedTicket.LichChieu?.Phim?.ten }}
          </div>
          <div class="mb-2">
            <strong>Thời gian chiếu:</strong>
            {{ formatTime(selectedTicket.LichChieu?.batDau) }}
          </div>
          <div class="mb-2">
            <strong>Ghế:</strong> {{ selectedTicket.Ghe?.hang
            }}{{ selectedTicket.Ghe?.cot }}
          </div>
          <div class="mb-2">
            <strong>Giá vé:</strong> {{ selectedTicket.gia }}₫
          </div>
        </div>

        <!-- Cột 2 -->
        <div class="col-md-4">
          <div class="mb-2">
            <strong>Phòng:</strong>
            {{ selectedTicket.LichChieu?.PhongChieu?.ten }}
          </div>
          <div class="mb-2">
            <strong>Chi nhánh:</strong>
            {{ selectedTicket.LichChieu?.PhongChieu?.ChiNhanh?.ten }}
          </div>
          <div class="mb-2">
            <strong>Người đặt:</strong>
            {{ selectedTicket.NguoiDung?.tenDangNhap }}
          </div>
          <div class="mb-2">
            <strong>Mã giảm giá:</strong>
            {{ selectedTicket.maGiamGiaSuDung || "Không" }}
          </div>
          <div class="mb-2">
            <strong>Trạng thái:</strong>
            <span class="badge" :class="statusColor(selectedTicket.trangThai)">
              {{ selectedTicket.trangThai }}
            </span>
          </div>
        </div>

        <!-- Cột 3: QR -->
        <div class="col-md-4 d-flex flex-column align-items-center">
          <qrcode-vue
            :value="selectedTicket.maQR"
            :size="160"
            level="M"
            class="shadow-sm border rounded p-2"
          />
          <div class="mt-2 small text-muted">QR: {{ selectedTicket.maQR }}</div>
        </div>
      </div>

      <!-- Combo -->
      <div class="card mb-0 border-0 shadow-sm">
        <h5 class="mb-3">Combo đi kèm</h5>
        <div v-if="comboList.length === 0" class="text-muted">
          Không có combo nào cho vé này.
        </div>
        <div v-else class="combo-scroll d-flex gap-3">
          <div
            v-for="comboVe in comboList"
            :key="comboVe.id"
            class="card combo-card border-0 shadow-sm"
          >
            <img
              :src="`http://localhost:3000/uploads/${comboVe.Combo?.duongDanAnh}`"
              class="combo-img"
            />
            <div class="p-2">
              <strong>{{ comboVe.Combo?.ten }}</strong>
              <div class="text-muted small">{{ comboVe.thanhTien }}₫</div>
              <span
                class="badge mt-1"
                :class="
                  comboVe.daThanhToanCombo ? 'bg-success' : 'bg-secondary'
                "
              >
                {{
                  comboVe.daThanhToanCombo ? "Đã thanh toán" : "Chưa thanh toán"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tổng tiền + nút hành động -->
      <div
        v-if="showActions"
        class="d-flex justify-content-between align-items-center border-top mt-2"
      >
        <div>
          <button class="btn btn-outline-danger me-2" @click="handleCancel">
            Hủy vé
          </button>

          <button class="btn btn-outline-success" @click="handleCheckIn">
            Check-in
          </button>
        </div>
        <div
          v-if="totalAmount > 0"
          class="d-flex align-items-center gap-3 mt-2"
        >
          <button class="btn btn-outline-primary" @click="handlePayment">
            Thanh toán
          </button>
          <h5 class="m-0">
            Tổng tiền cần thu:
            <span class="text-primary">
              {{ totalAmount.toLocaleString("vi-VN") }}₫
            </span>
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import QrcodeVue from "qrcode.vue";
import {
  getCombosByTicketId,
  cancelTicket,
  confirmPaymentAtCounter,
  checkInTicket,
} from "@/services/ticket";
import Swal from "sweetalert2";

const props = defineProps({
  selectedTicket: Object,
  formatTime: Function,
  statusColor: Function,
});

const comboList = ref([]);
const emit = defineEmits(["updated"]);
watch(
  () => props.selectedTicket,
  async (ticket) => {
    if (ticket) {
      try {
        const res = await getCombosByTicketId(ticket.id);
        comboList.value = res.data.data;
      } catch (e) {
        console.error("Lỗi khi lấy combo:", e);
        comboList.value = [];
      }
    }
  },
  { immediate: true }
);

const totalAmount = computed(() => {
  const ticketAmount = props.selectedTicket.daThanhToan
    ? 0
    : Number(props.selectedTicket.gia || 0);
  const comboAmount = comboList.value
    .filter((c) => !c.daThanhToanCombo)
    .reduce((sum, c) => sum + Number(c.thanhTien || 0), 0);
  return ticketAmount + comboAmount;
});

const showActions = computed(() => {
  const status = props.selectedTicket.trangThai;
  return status === "pending" || status === "unused";
});

const handleCancel = async () => {
  try {
    await cancelTicket(props.selectedTicket.id);
    Swal.fire("Thành công", "Đã hủy vé thành công.", "success");
    emit("updated", props.selectedTicket.id);
  } catch (err) {
    Swal.fire(
      "Lỗi",
      err?.response?.data?.message || "Lỗi khi hủy vé.",
      "error"
    );
  }
};

const handlePayment = async () => {
  try {
    await confirmPaymentAtCounter(props.selectedTicket.maQR);
    Swal.fire("Thành công", "Xác nhận thanh toán thành công.", "success");
    emit("updated", props.selectedTicket.id);
  } catch (err) {
    Swal.fire(
      "Lỗi",
      err?.response?.data?.message || "Lỗi khi xác nhận thanh toán.",
      "error"
    );
  }
};

const handleCheckIn = async () => {
  try {
    await checkInTicket(props.selectedTicket.maQR);
    Swal.fire("Thành công", "Check-in thành công.", "success");
    emit("updated", props.selectedTicket.id);
  } catch (err) {
    Swal.fire(
      "Lỗi",
      err?.response?.data?.message || "Lỗi khi check-in.",
      "error"
    );
  }
};
</script>

<style scoped>
.expanded-view {
  flex: 1;
  background-color: #fafafa;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  scrollbar-width: none;
}
.card {
  min-height: 300px;
}
.expanded-view::-webkit-scrollbar {
  display: none;
}
.combo-scroll {
  overflow-x: auto;
}
.combo-scroll::-webkit-scrollbar {
  display: none;
}
.combo-card {
  min-width: 180px;
  width: 180px;
  min-height: 200px;
  max-height: 200px;
  border-radius: 10px;
  overflow: hidden;
}
.combo-img {
  width: 70%;
  height: 120px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
}
</style>
