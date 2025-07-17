<template>
  <div v-if="!showAddCombo" class="expanded-view overflow-auto">
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
              <div class="text-muted small">
                {{ Number(comboVe.thanhTien) / Number(comboVe.soLuong) }}₫ x{{
                  comboVe.soLuong
                }}
              </div>
              <div class="text-muted small">
                Tổng: {{ Number(comboVe.thanhTien).toLocaleString("vi-VN") }}₫
              </div>
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

      <!-- Tổng tiền + Hủy + Thêm combo-->
      <div
        v-if="showActions"
        class="d-flex justify-content-between align-items-center border-top mt-2"
      >
        <div class="d-flex align-items-center gap-3 mt-2">
          <button class="btn btn-outline-danger" @click="handleCancel">
            Hủy vé
          </button>
          <button class="btn btn-outline-light" @click="showAddCombo = true">
            Thêm Combo
          </button>
        </div>

        <!-- Tổng tiền -->
        <div
          v-if="totalAmount > 0"
          class="d-flex align-items-center gap-3 mt-2"
        >
          <h5 class="m-0">
            Tổng tiền:
            <span class="text-primary">
              {{ totalAmount.toLocaleString("vi-VN") }}₫
            </span>
          </h5>
        </div>
      </div>
    </div>
  </div>
  <addCombo
    v-else
    :veId="selectedTicket.id"
    @added="handleComboAdded"
    @close="showAddCombo = false"
  />
</template>

<script setup>
import { ref, watch, computed } from "vue";
import QrcodeVue from "qrcode.vue";
import { getCombosByTicketId, cancelTicket } from "@/services/ticket";
import Swal from "sweetalert2";
import addCombo from "./addCombo.vue";

const props = defineProps({
  selectedTicket: Object,
  formatTime: Function,
  statusColor: Function,
});

const comboList = ref([]);
const showAddCombo = ref(false);
const emit = defineEmits(["updated"]);

watch(
  () => props.selectedTicket,
  async (ticket) => {
    showAddCombo.value = false;

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
const handleComboAdded = () => {
  showAddCombo.value = false;
  emit("updated", props.selectedTicket.id);
};
</script>

<style scoped>
.expanded-view {
  flex: 1;
  background-color: #1e1e1e;
  border-left: 1px solid #333;
  overflow-y: auto;
  color: #f1f1f1;
  scrollbar-width: none;
}
.expanded-view::-webkit-scrollbar {
  display: none;
}

.card {
  background-color: #2a2a2a;
  color: #f1f1f1;
  min-height: 300px;
  border-radius: 12px;
}

.combo-scroll {
  overflow-x: auto;
}
.combo-scroll::-webkit-scrollbar {
  display: none;
}

.combo-card {
  background-color: #343434;
  color: #f1f1f1;
  min-width: 180px;
  width: 180px;
  min-height: 220px;
  max-height: 220px;
  border-radius: 10px;
  overflow: hidden;
}
.combo-img {
  width: 60%;
  height: 120px;
  object-fit: cover;
  border-bottom: 1px solid #444;
}

.badge.bg-success {
  background-color: #28a745 !important;
  color: #fff;
}
.badge.bg-secondary {
  background-color: #6c757d !important;
  color: #fff;
}

.text-muted {
  color: #aaa !important;
}

button.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}
button.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.text-primary {
  color: #0d6efd !important;
}
</style>
