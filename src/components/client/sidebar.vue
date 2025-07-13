<template>
  <div class="sidebar-container">
    <!-- Video nền -->
    <div class="video-background position-relative">
      <iframe
        :src="selectedMovie ? selectedMovie.duongDanTrailer : defaultTrailer"
        frameborder="0"
        allowfullscreen
        class="video-frame"
      ></iframe>
      <div class="overlay"></div>
    </div>

    <!-- Nội dung phim -->
    <div v-if="selectedMovie" class="movie-info text-white">
      <h1 class="fw-bold">{{ selectedMovie.ten }}</h1>
      <p class="text-light">{{ selectedMovie.moTa }}</p>
      <p>
        <strong>Chi Nhánh:</strong> {{ selectedMovie.chiNhanh }} -
        <strong>Giờ chiếu:</strong>
        {{ formatDateTime(selectedMovie.batDau) }}
      </p>
      <p>
        <strong>Phòng:</strong> {{ selectedMovie.tenPhong }} -
        <strong>Giá:</strong> {{ selectedMovie.giaVe }} VNĐ
      </p>
      <div v-if="selectedMovie.soGheTrong === 0" style="color: red">
        Hết vé.
      </div>
      <div v-else style="color: green">
        Còn {{ selectedMovie.soGheTrong }} vé.
      </div>
      <button
        @click="router.push(`/movieDetail/${selectedMovie.idPhim}`)"
        class="btn btn-outline-light btn-sm mt-2 me-2"
      >
        Chi tiết
      </button>
      <button
        v-if="selectedMovie.soGheTrong > 0"
        class="btn btn-outline-light btn-sm mt-2"
        @click="router.push(`/booking/${selectedMovie.idLichChieu}`)"
      >
        Mua vé ngay
      </button>
    </div>

    <!-- Carousel danh sách phim -->
    <div class="movie-list">
      <div class="carousel-container">
        <div class="carousel-track">
          <div
            v-for="(movie, index) in loopedMovies"
            :key="index"
            class="movie-item"
            @click="onPlayMovie(movie)"
            :class="{
              selected: selectedMovie?.idLichChieu === movie.idLichChieu,
            }"
            :style="{ flex: `0 0 25%` }"
          >
            <img
              :src="movie.duongDanPoster"
              :alt="movie.ten"
              class="movie-poster img-fluid rounded-3"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getShowtimesWithFilters } from "@/services/showtimeCombo";

const router = useRouter();

const movies = ref([]);
const selectedMovie = ref(null);
const currentIndex = ref(4);

const defaultTrailer =
  "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1";

const loopedMovies = computed(() => {
  return movies.value.length < 4
    ? movies.value
    : [...movies.value, ...movies.value];
});

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const fetchMovies = async () => {
  try {
    const response = await getShowtimesWithFilters({ trong24h: true });
    const data = response.data.data;

    if (!data || data.length === 0) {
      movies.value = [];
      selectedMovie.value = null;
      return;
    }

    movies.value = data.map((item) => {
      const trailer = item.Phim?.PhuongTienMedia?.find(
        (m) => m.loai === "trailer"
      )?.duongDan;
      const poster = item.Phim?.PhuongTienMedia?.find(
        (m) => m.loai === "poster"
      )?.duongDan;

      return {
        idLichChieu: item.id,
        idPhim: item.Phim?.id || 0,
        ten: item.Phim?.ten || "Không rõ tên",
        moTa: item.Phim?.moTa || "Không có mô tả",
        duongDanTrailer: trailer || defaultTrailer,
        duongDanPoster: poster
          ? `http://localhost:3000/uploads/${poster}`
          : "/default-poster.jpg",
        batDau: item.batDau,
        tenPhong: item.PhongChieu?.ten || "Không rõ phòng",
        giaVe: item.giaVe || "Chưa có giá",
        tongSoGhe: item.PhongChieu?.tongSoGhe || 0,
        soGheTrong: item.soGheTrong || 0,
        chiNhanh: item.PhongChieu?.ChiNhanh?.ten || "không rõ tên",
      };
    });

    if (movies.value.length > 0) {
      onPlayMovie(movies.value[0]);
    }
  } catch (error) {
    console.error("Lỗi khi tải suất chiếu:", error);
  }
};

const onPlayMovie = (movie) => {
  let videoId = "";
  if (movie.duongDanTrailer.includes("youtu.be")) {
    videoId = movie.duongDanTrailer.split("youtu.be/")[1].split("?")[0];
  } else if (movie.duongDanTrailer.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(
      new URL(movie.duongDanTrailer).search
    );
    videoId = urlParams.get("v");
  }

  selectedMovie.value = {
    ...movie,
    duongDanTrailer: videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=${videoId}`
      : defaultTrailer,
  };
};

const prevSlide = () => {
  if (currentIndex.value <= 0) {
    currentIndex.value = Math.max(0, movies.value.length - 1);
  } else {
    currentIndex.value--;
  }
};

const nextSlide = () => {
  currentIndex.value++;
  const limit =
    movies.value.length >= 4
      ? movies.value.length * 2 - 4
      : movies.value.length;
  if (currentIndex.value >= limit) {
    currentIndex.value = 0;
  }
};

onMounted(() => {
  fetchMovies();
});
</script>

<style scoped>
.sidebar-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: black;
}

.video-background {
  position: absolute;
  width: 100%;
  height: 100%;
}

.video-frame {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
}

.movie-info {
  position: absolute;
  top: 25%;
  left: 5%;
  max-width: 40vw;
  z-index: 2;
  color: white;
}

.movie-list {
  position: absolute;
  bottom: 0%;
  right: 5%;
  max-width: 45vw;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.carousel-container {
  height: 360px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.carousel-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.carousel-track {
  display: flex;
  gap: 10px;
  padding: 10px;
  height: 100%;
}

.movie-item {
  flex: 0 0 25%;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s,
    border 0.3s;
  border: 2px solid transparent;
  border-radius: 8px;
  flex-shrink: 0;
}

.movie-item:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 100%;
  height: 270px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
