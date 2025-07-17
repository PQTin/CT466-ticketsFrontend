<template>
  <div class="expanded-view overflow-auto">
    <div class="card p-4 border-0 shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="text-warning m-0">Thêm Combo cho Vé</h5>
        <button class="btn btn-sm btn-outline-light" @click="emit('close')">
          Quay lại
        </button>
      </div>

      <!-- Tổng hợp combo + mã giảm giá -->
      <div class="card p-3 border-0 shadow-sm mb-4 bg-dark text-light">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="m-0">Combo đã chọn</h6>
        </div>

        <div v-if="selectedCombos.length === 0" class="text-muted">
          Bạn chưa chọn combo nào.
        </div>

        <div v-else class="combo-summary-scroll d-flex gap-3 py-2 px-1">
          <div
            v-for="(item, index) in selectedCombos"
            :key="index"
            class="combo-summary-card d-flex"
          >
            <div class="combo-image-wrapper me-2">
              <img
                :src="`http://localhost:3000/uploads/${item.duongDanAnh}`"
                alt="Combo Image"
              />
            </div>
            <div class="flex-grow-1 d-flex flex-column justify-content-between">
              <div>
                <div class="fw-semibold combo-name">{{ item.ten }}</div>
                <div class="d-flex align-items-center mb-1">
                  <input
                    v-model.number="item.soLuong"
                    type="number"
                    min="1"
                    class="form-control form-control-sm me-2"
                    style="width: 50px"
                    @input="calculateTotal"
                  />
                  <span class="small">× {{ formatPrice(item.gia) }}₫</span>
                </div>
              </div>
              <div class="text-end small fw-bold text-light">
                {{ formatPrice(item.soLuong * item.gia) }}₫
              </div>
            </div>
          </div>
        </div>

        <!-- Mã giảm giá & Nút xác nhận -->
        <div class="d-flex mt-3 gap-2 align-items-center flex-wrap">
          <input
            v-model="discountCode"
            class="form-control form-control-sm"
            placeholder="Mã giảm giá..."
            style="max-width: 200px"
          />
          <button class="btn btn-sm btn-outline-info" @click="calculateTotal">
            Áp dụng
          </button>
          <button
            class="btn btn-sm btn-primary ms-auto"
            :disabled="!selectedCombos.length"
            @click="submitCombo"
          >
            Thêm
          </button>
        </div>

        <!-- Hiển thị tổng tiền sau giảm giá -->
        <div class="text-end mt-3 fw-bold">
          <template v-if="discountPercent > 0">
            <div>
              Tổng tiền:
              <span class="text-muted text-decoration-line-through">
                {{ formatPrice(originalTotal) }}₫
              </span>
              <span class="text-success ms-2"
                >{{ formatPrice(totalPrice) }}₫</span
              >
            </div>
          </template>
          <template v-else>
            <div>Tổng tiền: {{ formatPrice(totalPrice) }}₫</div>
          </template>
        </div>

        <div v-if="discountPercent > 0" class="text-success small mt-2">
          Đã áp dụng giảm {{ discountPercent }}%
        </div>
      </div>

      <!-- Danh sách combo -->
      <div>
        <h6 class="mb-2">Danh sách combo</h6>
        <comboCard
          class="compact-combo"
          :selectedComboIds="selectedCombos.map((c) => c.id)"
          @add-combo="addCombo"
          @remove-combo="removeCombo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import comboCard from "@/components/client/booking/comboCard.vue";
import { addComboToTicket, calculateComboTotal } from "@/services/booking";
import Swal from "sweetalert2";

const props = defineProps({
  veId: Number,
});
const emit = defineEmits(["added", "close"]);

const selectedCombos = ref([]);
const discountCode = ref("");
const discountPercent = ref(0);
const totalPrice = ref(0);
const originalTotal = ref(0);

const formatPrice = (v) => Number(v).toLocaleString("vi-VN");

const addCombo = (combo) => {
  const exists = selectedCombos.value.find((c) => c.id === combo.id);
  if (!exists) {
    selectedCombos.value.push({ ...combo, soLuong: 1 });
    calculateTotal();
  }
};

const removeCombo = (combo) => {
  selectedCombos.value = selectedCombos.value.filter((c) => c.id !== combo.id);
  calculateTotal();
};

const calculateTotal = async () => {
  if (!selectedCombos.value.length) {
    totalPrice.value = 0;
    originalTotal.value = 0;
    discountPercent.value = 0;
    return;
  }

  try {
    const payload = {
      veId: props.veId,
      comboList: selectedCombos.value.map((combo) => ({
        comboId: combo.id,
        soLuong: combo.soLuong,
      })),
      maGiamGia: discountCode.value.trim() || null,
    };

    const res = await calculateComboTotal(payload);

    if (res.data.success) {
      const data = res.data.data;
      const calculatedOriginal = selectedCombos.value.reduce(
        (sum, c) => sum + c.gia * c.soLuong,
        0
      );

      totalPrice.value = data.thanhToanCuoi;
      originalTotal.value =
        data.phanTramGiam > 0 ? calculatedOriginal : data.thanhToanCuoi;
      discountPercent.value = data.phanTramGiam || 0;

      if (discountCode.value && data.phanTramGiam > 0) {
        Swal.fire({
          icon: "success",
          title: "Áp dụng thành công!",
          text: `Đã giảm ${data.phanTramGiam}%`,
          timer: 1500,
          showConfirmButton: false,
        });
      } else if (discountCode.value && data.phanTramGiam === 0) {
        Swal.fire({
          icon: "info",
          title: "Không hợp lệ",
          text: "Mã giảm giá không hợp lệ hoặc không áp dụng được.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  } catch (err) {
    originalTotal.value = selectedCombos.value.reduce(
      (sum, c) => sum + c.gia * c.soLuong,
      0
    );
    totalPrice.value = originalTotal.value;
    discountPercent.value = 0;
    Swal.fire(
      "Lỗi",
      err?.response?.data?.message || "Không thể tính tổng tiền combo.",
      "error"
    );
  }
};

const submitCombo = async () => {
  try {
    const payload = {
      veId: props.veId,
      comboList: selectedCombos.value.map((combo) => ({
        comboId: combo.id,
        soLuong: combo.soLuong,
        daThanhToanCombo: false,
      })),
      maGiamGia: discountCode.value || null,
    };

    await addComboToTicket(payload);

    Swal.fire("Thành công", "Đã thêm combo vào vé", "success");
    emit("added");
    emit("close");
  } catch (err) {
    Swal.fire(
      "Lỗi",
      err?.response?.data?.message || "Không thể thêm combo",
      "error"
    );
  }
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

input.form-control {
  background-color: #2a2a2a;
  color: white;
  border: 1px solid #444;
}
input.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  border-color: #0d6efd;
}

.text-primary {
  color: #0d6efd !important;
}
.text-muted {
  color: #aaa !important;
}

.combo-summary-scroll {
  white-space: nowrap;
  overflow-x: auto;
  padding-bottom: 4px;
}
.combo-summary-scroll::-webkit-scrollbar {
  display: none;
}

.combo-summary-card {
  min-width: 250px;
  max-width: 260px;
  background-color: #2b2b2b;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #f1f1f1;
  display: flex;
  gap: 0.75rem;
}

.combo-image-wrapper {
  width: 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #444;
  flex-shrink: 0;
}
.combo-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.combo-name {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

:deep(.compact-combo) .combo-card-item {
  min-width: 150px;
  max-width: 170px;
}

:deep(.compact-combo) .card-img-top {
  height: 100px !important;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

:deep(.compact-combo) .card-body {
  padding: 0.5rem !important;
}

:deep(.compact-combo) h5 {
  font-size: 0.95rem !important;
  margin-bottom: 0.4rem !important;
  line-height: 1.2;
}

:deep(.compact-combo) p {
  font-size: 0.75rem !important;
  margin-bottom: 0.5rem !important;
}

:deep(.compact-combo) .btn {
  padding: 0.25rem 0.5rem !important;
  font-size: 0.75rem !important;
}
</style>
