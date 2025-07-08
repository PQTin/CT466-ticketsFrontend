<template>
  <div class="d-flex" style="height: calc(100vh - 100px); overflow: hidden">
    <div style="width: 380px; display: flex; flex-direction: column">
      <div class="p-3 pt-0">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Mã, phần trăm giảm, ngày phát, trạng thái"
        />
      </div>

      <div style="flex: 1; overflow-y: auto" class="p-3 sidebar-scroll">
        <div v-if="promotions.length === 0" class="text-center text-muted py-4">
          Chưa có khuyến mãi nào.
        </div>

        <div
          v-else-if="filteredPromotions.length === 0"
          class="text-center text-muted py-4"
        >
          Không tìm thấy khuyến mãi phù hợp.
        </div>

        <div v-else class="promo-scroll-container">
          <div
            v-for="promo in filteredPromotions"
            :key="promo.id"
            class="promo-card"
            :class="{ active: selectedPromo?.id === promo.id }"
            @click="selectPromo(promo)"
          >
            <div class="card shadow-sm border-0">
              <div class="card-body p-2 d-flex align-items-center gap-2">
                <img
                  :src="getImage(promo)"
                  alt="Banner"
                  class="promo-img"
                  loading="lazy"
                />
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ promo.ma }}</h6>
                  <small class="text-muted" style="font-size: 12px">
                    {{ getLoaiApDungText(promo.loaiApDung) }} -
                    {{ promo.phanTramGiam }}%
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade-expand" mode="out-in">
      <div v-if="selectedPromo" class="expanded-view" :key="selectedPromo.id">
        <h5 class="mb-4 text-primary">Thông tin khuyến mãi</h5>

        <div class="row gx-5 gy-4">
          <div class="col-md-5 text-center">
            <img
              :src="getImage(selectedPromo)"
              alt="Banner"
              class="promo-banner"
            />
          </div>

          <div class="col-md-7 d-flex flex-column gap-3">
            <div class="detail-row">
              <div class="label">Mã:</div>
              <div class="value">{{ selectedPromo.ma }}</div>
            </div>
            <div class="detail-row">
              <div class="label">Mô tả:</div>
              <div class="value">{{ selectedPromo.moTa }}</div>
            </div>
            <div class="detail-row">
              <div class="label">Giảm:</div>
              <div class="value">{{ selectedPromo.phanTramGiam }}%</div>
            </div>
            <div class="detail-row">
              <div class="label">Thời gian:</div>
              <div class="value">
                {{ formatDate(selectedPromo.ngayBatDau) }} -
                {{ formatDate(selectedPromo.ngayKetThuc) }}
              </div>
            </div>
          </div>
        </div>

        <div class="row row-cols-2 mt-4 gx-5">
          <div class="detail-row">
            <div class="label">Áp dụng:</div>
            <div class="value">
              {{ getLoaiApDungText(selectedPromo.loaiApDung) }}
            </div>
          </div>
          <div class="detail-row">
            <div class="label">Trạng thái:</div>
            <div class="value">
              <span
                :class="selectedPromo.hoatDong ? 'text-success' : 'text-danger'"
              >
                {{
                  selectedPromo.hoatDong ? "Đang hoạt động" : "Ngưng hoạt động"
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-3 mt-4 flex-wrap">
          <button class="btn btn-outline-primary" @click="toggleStatus">
            {{ selectedPromo.hoatDong ? "Ngưng hoạt động" : "Kích hoạt lại" }}
          </button>

          <button class="btn btn-success" @click="phatHanhTatCa">
            Phát hành mã cho tất cả
          </button>
        </div>
        <groupRelease
          :khuyenMaiId="selectedPromo.id"
          :maPrefix="selectedPromo.ma"
          @done="onGroupDone"
        />
        <h5 class="mb-4 text-primary mt-4">Danh sách mã đã phát hành</h5>
        <discountCodeTable :khuyenMaiId="selectedPromo.id" ref="codeTableRef" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import {
  getAllPromotions,
  updatePromotionStatus,
  issueCodesToAllUsers,
} from "@/services/promotion";
import discountCodeTable from "./discountCodeTable.vue";
import groupRelease from "./groupRelease.vue";
import Swal from "sweetalert2";

const promotions = ref([]);
const selectedPromo = ref(null);
const searchQuery = ref("");
const codeTableRef = ref(null);

const onGroupDone = () => {
  nextTick(() => {
    codeTableRef.value?.fetchCodes?.();
  });
};

const fetchPromotions = async () => {
  try {
    const res = await getAllPromotions();
    promotions.value = res.data.data;
    if (promotions.value.length > 0) {
      selectedPromo.value = promotions.value[0];
    }
  } catch (err) {
    console.error("Lỗi khi tải khuyến mãi:", err);
  }
};

const getImage = (promo) => {
  return promo.duongDanAnh
    ? `http://localhost:3000/uploads/${promo.duongDanAnh}`
    : "/default-banner.jpg";
};

const getLoaiApDungText = (loai) => {
  if (loai === "ve") return "Vé";
  if (loai === "combo") return "Combo";
  return "Tất cả";
};

const selectPromo = (promo) => {
  selectedPromo.value = promo;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
};

const filteredPromotions = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return promotions.value;

  const keywords = q
    .split(/[,;|]+/)
    .map((k) => k.trim())
    .filter(Boolean);

  return promotions.value.filter((promo) => {
    const combined = [
      promo.ma,
      `${promo.phanTramGiam}%`,
      formatDate(promo.ngayBatDau),
      promo.hoatDong ? "đang hoạt động" : "ngưng hoạt động",
    ]
      .join(" ")
      .toLowerCase();

    return keywords.every((kw) => combined.includes(kw));
  });
});

const toggleStatus = async () => {
  if (!selectedPromo.value) return;

  const promo = selectedPromo.value;
  const newStatus = !promo.hoatDong;

  const result = await Swal.fire({
    title: newStatus
      ? "Kích hoạt lại khuyến mãi?"
      : "Ngưng hoạt động khuyến mãi?",
    text: newStatus
      ? "Bạn có chắc muốn kích hoạt lại khuyến mãi này?"
      : "Bạn có chắc muốn ngưng hoạt động khuyến mãi này?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: newStatus ? "Kích hoạt" : "Ngưng",
    cancelButtonText: "Huỷ",
  });

  if (result.isConfirmed) {
    try {
      await updatePromotionStatus(promo.id, newStatus);
      promo.hoatDong = newStatus;

      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật trạng thái thành công!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể cập nhật trạng thái. Vui lòng thử lại.",
      });
    }
  }
};

const phatHanhTatCa = async () => {
  if (!selectedPromo.value) return;

  const result = await Swal.fire({
    title: "Phát hành mã cho tất cả người dùng?",
    text: `Mỗi người dùng sẽ nhận mã bắt đầu với '${selectedPromo.value.ma}'`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Phát hành",
    cancelButtonText: "Huỷ",
  });

  if (result.isConfirmed) {
    try {
      await issueCodesToAllUsers(
        selectedPromo.value.id,
        selectedPromo.value.ma
      );

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Mã đã được phát cho tất cả người dùng.",
        timer: 2000,
        showConfirmButton: false,
      });
      codeTableRef.value?.fetchCodes?.();
    } catch (err) {
      console.error("Lỗi khi phát hành:", err);
      Swal.fire("Lỗi", "Không thể phát hành mã. Vui lòng thử lại.", "error");
    }
  }
};

onMounted(fetchPromotions);
defineExpose({ fetchPromotions });
</script>

<style scoped>
.promo-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.promo-card {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border-radius: 8px;
  will-change: transform;
}

.promo-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.promo-card.active {
  outline: 2px solid #0d6efd;
  background: #f0f8ff;
}

.promo-img {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.promo-banner {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  background-color: #fff;
}

.expanded-view {
  flex: 1;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow-y: auto;
  padding: 2rem;
  font-size: 17px;
}

.detail-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 17px;
  line-height: 1.6;
}

.detail-row .label {
  min-width: 110px;
  font-weight: 600;
  color: #333;
  flex-shrink: 0;
}

.detail-row .value {
  flex: 1;
  word-break: break-word;
  white-space: pre-line;
}

.fade-expand-enter-active,
.fade-expand-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-expand-enter-from,
.fade-expand-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-expand-enter-to,
.fade-expand-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.sidebar-scroll::-webkit-scrollbar,
.expanded-view::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
