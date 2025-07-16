<template>
  <div class="promotion-list-container container py-4">
    <h2 class="text-white text-center mb-4">Danh sách Khuyến Mãi</h2>

    <div class="row g-4 justify-content-center">
      <div
        class="col-md-6 col-lg-4"
        v-for="promo in promotions"
        :key="promo.id"
      >
        <div class="promo-card p-3">
          <img
            :src="`http://localhost:3000/uploads/${promo.duongDanAnh}`"
            alt="Khuyến mãi"
            class="promo-image"
          />

          <div class="promo-info mt-3">
            <h5 class="text-light">{{ promo.ma }}</h5>
            <p class="promo-description text-light opacity-75 small mb-2">
              {{ promo.moTa }}
            </p>
            <p class="text-light">
              Giảm: <strong>{{ promo.phanTramGiam }}%</strong>
            </p>
            <p class="text-light small mb-2">
              Hạn: {{ formatDate(promo.ngayKetThuc) }}
              <span
                class="badge ms-2"
                :class="
                  new Date(promo.ngayKetThuc) >= new Date()
                    ? 'bg-success'
                    : 'bg-danger'
                "
              >
                {{
                  new Date(promo.ngayKetThuc) >= new Date()
                    ? "Còn hiệu lực"
                    : "Đã kết thúc"
                }}
              </span>
            </p>

            <div class="mt-2">
              <div v-if="promo.userCode" class="badge bg-success w-100 py-2">
                Mã của bạn: <strong>{{ promo.userCode.ma }}</strong>
                <span
                  class="badge"
                  :class="
                    promo.userCode.daDung
                      ? 'bg-secondary'
                      : 'bg-warning text-dark'
                  "
                >
                  {{ promo.userCode.daDung ? "Đã dùng" : "Chưa dùng" }}
                </span>
              </div>
              <div
                v-else
                class="text-center text-secondary border rounded py-2"
              >
                Bạn chưa nhận mã
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!promotions.length" class="text-center text-muted mt-4">
      Không có khuyến mãi nào để hiển thị.
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAllPromotions, getUserDiscountCodes } from "@/services/promotion";
import { useAuthStore } from "@/store/authStore";

const promotions = ref([]);
const authStore = useAuthStore();

onMounted(async () => {
  const [promoRes, codeRes] = await Promise.all([
    getAllPromotions(),
    authStore.isLoggedIn
      ? getUserDiscountCodes()
      : Promise.resolve({ data: { data: [] } }),
  ]);

  const codeMap = {};
  codeRes.data.data.forEach((code) => {
    codeMap[code.khuyenMaiId] = code;
  });

  promotions.value = promoRes.data.data.map((promo) => ({
    ...promo,
    userCode: codeMap[promo.id] || null,
  }));
});

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
};
</script>

<style scoped>
.promotion-list-container {
  background-color: #121212;
  min-height: 100vh;
}

.promo-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease;
  height: 100%;
}

.promo-card:hover {
  transform: translateY(-4px);
}

.promo-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.promo-description {
  line-height: 1.4;
}
</style>
