<template>
  <div v-if="showtimes.length" class="showtime-scroll d-flex gap-3">
    <div
      v-for="item in showtimes"
      :key="item.id"
      class="card text-white flex-shrink-0"
      style="min-width: 300px; max-width: 320px; background-color: #121212"
    >
      <div class="card-body d-flex flex-column justify-content-between h-100">
        <div class="mb-2">
          <h6 class="card-title mb-1">
            <strong>{{ item.chiNhanh }}</strong>
          </h6>
          <p class="card-text mb-1">Phòng: {{ item.phong }}</p>
          <p class="card-text text-white-50">
            {{ formatDateTime(item.batDauLuc) }}
          </p>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-2">
          <span
            class="badge"
            :class="{
              'bg-success': item.trangThai === 'Đang chiếu',
              'bg-warning text-dark': item.trangThai === 'Sắp chiếu',
            }"
          >
            {{ item.trangThai }}
          </span>
          <button
            class="btn btn-outline-light btn-sm"
            @click="router.push(`/booking/${item.id}`)"
          >
            Mua vé ngay
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-white-50 fst-italic px-2">
    Hiện chưa có suất chiếu nào cho phim này.
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getShowtimesByMovieId } from "@/services/movie";

const props = defineProps({
  movieId: { type: Number, required: true },
});

const router = useRouter();
const showtimes = ref([]);

const formatDateTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
};

const fetchShowtimes = async () => {
  try {
    const res = await getShowtimesByMovieId(props.movieId);
    showtimes.value = res.data.data;
  } catch (err) {
    console.error("Lỗi khi lấy suất chiếu:", err);
  }
};

onMounted(fetchShowtimes);
</script>

<style scoped>
.showtime-scroll {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.showtime-scroll::-webkit-scrollbar {
  display: none; /* Chrome */
}
.card {
  border-radius: 0.75rem;
}
</style>
