<template>
  <div class="d-flex" style="height: calc(100vh - 100px); overflow: hidden">
    <div style="width: 320px; display: flex; flex-direction: column">
      <div class="p-3 pt-0">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="tên phim, phòng, chi nhánh, ngày"
        />
      </div>
      <div style="flex: 1; overflow-y: auto" class="p-3 sidebar-scroll">
        <div
          v-if="filteredShowtimes.length === 0"
          class="text-center text-muted py-4"
        >
          Không tìm thấy suất chiếu nào.
        </div>

        <div v-else class="movie-scroll-container flex-column">
          <div
            v-for="showtime in filteredShowtimes"
            :key="showtime.id"
            class="movie-card"
            :class="{ active: selectedShowtime?.id === showtime.id }"
            @click="selectShowtime(showtime)"
          >
            <div class="card h-100 shadow-sm border-0">
              <div class="card-body p-2 d-flex align-items-center gap-2">
                <img
                  :src="getPoster(showtime.Phim)"
                  alt="Poster"
                  class="poster-img"
                />
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ showtime.Phim.ten }}</h6>
                  <div class="small text-muted">
                    {{ formatTime(showtime.batDau) }}<br />
                    {{ showtime.PhongChieu.ten }} -
                    {{ showtime.PhongChieu.ChiNhanh.ten }}
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center mt-1"
                  >
                    <span :class="getStatusClass(showtime)" class="badge">{{
                      getStatusText(showtime)
                    }}</span>
                    <button
                      v-if="canCancel(showtime)"
                      class="btn btn-sm btn-outline-danger"
                      @click.stop="confirmCancel(showtime)"
                    >
                      Huỷ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="expanded-view">
      <showtimeEdit :showtime="selectedShowtime" @updated="fetchShowtimes" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { getAllShowtimesAdmin, deleteShowtime } from "@/services/showtimeCombo";
import showtimeEdit from "./showtimeEdit.vue";

const showtimes = ref([]);
const selectedShowtime = ref(null);
const searchQuery = ref("");

const getPoster = (phim) => {
  const poster = phim.PhuongTienMedia?.find((m) => m.loai === "poster");
  return poster
    ? `http://localhost:3000/uploads/${poster.duongDan}`
    : "/default-poster.jpg";
};

const fetchShowtimes = async () => {
  try {
    const res = await getAllShowtimesAdmin();
    showtimes.value = res.data.data;
  } catch (err) {
    console.error("Lỗi tải lịch chiếu:", err);
  }
};

const formatTime = (isoTime) => {
  const date = new Date(isoTime);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getStatusText = (showtime) => {
  const now = new Date();
  const batDau = new Date(showtime.batDau);
  const ketThuc = new Date(showtime.ketThuc);
  if (showtime.daXoa) return "Đã huỷ";
  if (ketThuc < now) return "Đã chiếu";
  if (batDau > now) return "Sắp chiếu";
  return "Đang chiếu";
};

const getStatusClass = (showtime) => {
  const status = getStatusText(showtime);
  return {
    "bg-secondary": status === "Đã chiếu",
    "bg-success": status === "Đang chiếu",
    "bg-warning": status === "Sắp chiếu",
    "bg-danger": status === "Đã huỷ",
  };
};

const canCancel = (showtime) => {
  const status = getStatusText(showtime);
  return status === "Sắp chiếu";
};

const confirmCancel = async (showtime) => {
  const result = await Swal.fire({
    title: "Xác nhận huỷ?",
    text: `Bạn có chắc muốn huỷ suất chiếu phim '${showtime.Phim.ten}'?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Huỷ suất",
    cancelButtonText: "Không",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteShowtime(showtime.id);
    Swal.fire("Đã huỷ", "Suất chiếu đã được huỷ thành công.", "success");
    await fetchShowtimes();
  } catch (err) {
    Swal.fire("Lỗi", err.response?.data?.message || "Không thể huỷ", "error");
    console.error(err);
  }
};

const filteredShowtimes = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return showtimes.value;

  // Tách theo phẩy, chấm phẩy, hoặc gạch đứng thành các cụm nguyên
  const keywords = q
    .split(/[,;|]+/)
    .map((k) => k.trim())
    .filter(Boolean);

  return showtimes.value.filter((item) => {
    const combined = [
      item.Phim.ten,
      item.PhongChieu.ten,
      item.PhongChieu.ChiNhanh.ten,
      new Date(item.batDau).toLocaleDateString("vi-VN"),
    ]
      .join(" ")
      .toLowerCase();

    // Mỗi keyword nguyên cụm phải xuất hiện trong đoạn text tổng
    return keywords.every((kw) => combined.includes(kw));
  });
});

const selectShowtime = (showtime) => {
  selectedShowtime.value = showtime;
};

onMounted(async () => {
  await fetchShowtimes();
  if (showtimes.value.length > 0) {
    selectedShowtime.value = showtimes.value[0];
  }
});
defineExpose({ fetchShowtimes });
</script>

<style scoped>
.movie-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.movie-card {
  cursor: pointer;
  transition: all 0.3s ease;
}
.movie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.movie-card.active {
  outline: 2px solid #0d6efd;
  background: #f0f8ff;
  border-radius: 8px;
}
.poster-img {
  width: 25%;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
}
.card-body {
  height: 120px;
}
.expanded-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  border: 1px solid #ddd;
  border-radius: 12px;
}
.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}
.movie-scroll-container::-webkit-scrollbar,
.expanded-view::-webkit-scrollbar,
.sidebar-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
