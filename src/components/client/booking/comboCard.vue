<template>
  <div v-if="combos.length === 0" class="text-center text-secondary py-4">
    Hiện chưa có combo nào.
  </div>

  <div v-else class="combo-layout-container">
    <div class="combo-scroll-list">
      <div v-for="combo in combos" :key="combo.id" class="combo-card-item">
        <div class="card h-100 border-0 rounded-3">
          <div class="combo-img-wrapper">
            <img
              :src="`http://localhost:3000/uploads/${combo.duongDanAnh}`"
              alt="Combo Image"
              class="combo-img"
            />
          </div>
          <div class="card-body d-flex flex-column p-3">
            <h5 class="fw-semibold text-white mb-2">{{ combo.ten }}</h5>
            <p class="text-secondary small flex-grow-1 mb-3">
              {{ combo.moTa }}
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="fw-bold text-danger">
                {{ formatPrice(combo.gia) }} VNĐ
              </div>
              <button
                class="btn btn-outline-light btn-sm"
                @click="toggleCombo(combo)"
              >
                {{ isSelected(combo.id) ? "Hủy" : "Thêm" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllCombos } from "@/services/showtimeCombo";

// Props
const props = defineProps({
  selectedComboIds: {
    type: Array,
    default: () => [],
  },
});

// Emit
const emit = defineEmits(["add-combo", "remove-combo"]);

// State
const combos = ref([]);

// Fetch combo từ backend
const fetchCombos = async () => {
  try {
    const response = await getAllCombos();
    combos.value = response.data.data || [];
  } catch (error) {
    console.error("Lỗi khi tải combo:", error);
  }
};

// Format tiền tệ
const formatPrice = (value) => Number(value).toLocaleString("vi-VN");

// Kiểm tra combo đã chọn chưa
const isSelected = (comboId) => props.selectedComboIds.includes(comboId);

// Thêm / hủy combo
const toggleCombo = (combo) => {
  const payload = {
    id: combo.id,
    ten: combo.ten,
    gia: combo.gia,
    duongDanAnh: combo.duongDanAnh,
  };

  if (isSelected(combo.id)) {
    emit("remove-combo", payload);
  } else {
    emit("add-combo", payload);
  }
};

onMounted(fetchCombos);
</script>

<style scoped>
.combo-layout-container {
  padding: 1rem;
  background: #1e1e1e;
  border-radius: 12px;
  min-height: 45vh;
}

.combo-scroll-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
  scroll-padding-left: 1rem;
  -webkit-overflow-scrolling: touch;
}

.combo-scroll-list::-webkit-scrollbar {
  height: 0;
}

.combo-card-item {
  min-width: 220px;
  max-width: 240px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.combo-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.05);
}

.card {
  height: 100%;
  background-color: #2a2a2a;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
}

.card-body {
  display: flex;
  flex-direction: column;
}
.combo-img-wrapper {
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
}

.combo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
