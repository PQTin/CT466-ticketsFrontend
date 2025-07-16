<template>
  <div class="movie-list-container">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h2 class="text-white flex-grow-1">Danh Sách Phim</h2>
      <input
        type="text"
        class="form-control form-control-sm w-25 ms-auto bg-dark text-white border-secondary"
        placeholder="Tìm kiếm theo tên phim, thể loại"
        v-model="searchQuery"
      />
    </div>
    <div class="movie-scroll-wrapper">
      <div class="movie-scroll">
        <div
          v-for="(phim, index) in filteredMovies"
          :key="phim.id"
          class="movie-card"
        >
          <!-- Poster slideshow -->
          <div class="poster-wrapper">
            <img
              v-if="posterUrls(phim).length"
              :src="
                posterUrls(phim)[
                  currentPosterIndex[index] % posterUrls(phim).length
                ]
              "
              alt="Poster phim"
              class="poster-img"
            />
          </div>

          <div class="movie-info">
            <div class="movie-title">{{ phim.ten }}</div>
            <div class="movie-rating text-light small">
              ⭐ {{ phim.diemTrungBinh }} ({{ phim.soDanhGia }} đánh giá)
            </div>

            <div class="d-flex justify-content-center mt-2">
              <button
                class="btn btn-outline-light btn-sm me-2"
                @click="goToDetail(phim.id)"
              >
                Chi tiết
              </button>
              <button
                class="btn btn-outline-light btn-sm"
                @click="watchTrailer(phim)"
              >
                Trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <trailler
    :show="showTrailer"
    :url="trailerUrl"
    :ten="trailerTen"
    @close="showTrailer = false"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAllMovies } from "@/services/movie";
import { useRouter } from "vue-router";
import trailler from "@/components/client/trailer.vue";

const movies = ref([]);
const currentPosterIndex = ref([]);
const searchQuery = ref("");
const router = useRouter();

const showTrailer = ref(false);
const trailerUrl = ref("");
const trailerTen = ref("");

onMounted(async () => {
  const res = await getAllMovies();
  if (res.data.success) {
    movies.value = res.data.data;
    currentPosterIndex.value = res.data.data.map(() => 0);
    setInterval(() => {
      currentPosterIndex.value = currentPosterIndex.value.map((val) => val + 1);
    }, 3000);
  }
});

const filteredMovies = computed(() => {
  if (!searchQuery.value.trim()) return movies.value;

  const keywords = searchQuery.value
    .split(",")
    .map((kw) => kw.trim().toLowerCase())
    .filter((kw) => kw);

  return movies.value.filter((movie) => {
    const tenPhim = movie.ten.toLowerCase();
    const theLoais = (movie.TheLoais || []).map((tl) => tl.ten.toLowerCase());

    return keywords.every((kw) => {
      return tenPhim.includes(kw) || theLoais.some((tl) => tl.includes(kw));
    });
  });
});

const posterUrls = (phim) => {
  return phim.PhuongTienMedia.filter((m) => m.loai === "poster").map(
    (poster) =>
      poster.duongDan.startsWith("http")
        ? poster.duongDan
        : `http://localhost:3000/uploads/${poster.duongDan}`
  );
};

const goToDetail = (movieId) => {
  router.push(`/movieDetail/${movieId}`);
};

const watchTrailer = (movie) => {
  const trailer = movie.PhuongTienMedia.find((m) => m.loai === "trailer");
  if (trailer) {
    trailerUrl.value = trailer.duongDan;
    trailerTen.value = movie.ten;
    showTrailer.value = true;
  } else {
    alert("Phim chưa có trailer.");
  }
};
</script>

<style scoped>
.movie-list-container {
  padding: 32px 16px;
  background-color: #121212;
}

.movie-scroll-wrapper {
  height: 500px;
  display: flex;
  align-items: center;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 0 24px;
}

.movie-scroll {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  overflow-y: visible;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  height: 100%;
  scrollbar-width: none;
}

.movie-scroll::-webkit-scrollbar {
  display: none;
}

.movie-card {
  flex: 0 0 auto;
  width: 220px;
  height: 400px;
  scroll-snap-align: start;
  background-color: #222;
  border-radius: 12px;
  overflow: visible;
  transition: transform 0.3s;
  transform-origin: center bottom;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  margin-top: 24px;
}

.movie-card:hover {
  transform: scale(1.05);
}

.poster-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.poster-img {
  width: 100%;
  max-width: 180px;
  height: 270px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.movie-info {
  text-align: center;
  width: 100%;
  color: #fff;
}

.movie-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.movie-rating {
  font-size: 13px;
  color: #ccc;
}
input.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.25);
}
input::placeholder {
  color: #ccc !important;
  opacity: 1;
}
</style>
