<template>
  <div class="container-fluid">
    <div class="row g-4">
      <div
        v-for="combo in combos"
        :key="combo.id"
        class="col-6 col-md-4 col-lg-3"
      >
        <div class="card combo-card h-100 border-0 shadow-sm position-relative">
          <div class="combo-image-container">
            <img
              :src="getImage(combo.duongDanAnh)"
              class="card-img-top combo-img"
              alt="Ảnh combo"
            />
          </div>
          <div class="card-body text-center">
            <h6 class="card-title fw-semibold">{{ combo.ten }}</h6>
            <p class="text-muted small mb-1">{{ combo.moTa }}</p>
            <div class="fw-bold text-primary">{{ formatPrice(combo.gia) }}</div>
          </div>
          <button
            class="btn btn-outline-danger btn-sm position-absolute top-0 end-0 m-2"
            @click="confirmDelete(combo.id)"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { getAllCombos, deleteCombo } from "@/services/showtimeCombo";

const combos = ref([]);

const fetchCombos = async () => {
  try {
    const res = await getAllCombos();
    combos.value = res.data.data;
  } catch (err) {
    console.error("Lỗi khi tải combo:", err);
  }
};

const getImage = (path) => {
  return path ? `http://localhost:3000/uploads/${path}` : "/default-combo.png";
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: "Xác nhận xoá?",
    text: "Bạn có chắc muốn xoá combo này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Không",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteCombo(id);
    Swal.fire("Đã xoá", "Combo đã được ẩn.", "success");
    fetchCombos();
  } catch (err) {
    Swal.fire("Lỗi", err.response?.data?.message || "Không thể xoá", "error");
  }
};

onMounted(fetchCombos);

defineExpose({ fetchCombos });
</script>

<style scoped>
.combo-card {
  transition: all 0.3s ease;
  background-color: #fdfdfd;
  border-radius: 1rem;
  overflow: hidden;
}
.combo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}
.combo-image-container {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}
.combo-img {
  max-height: 160px;
  object-fit: contain;
  transition: transform 0.3s ease;
}
.combo-card:hover .combo-img {
  transform: scale(1.05);
}
</style>
