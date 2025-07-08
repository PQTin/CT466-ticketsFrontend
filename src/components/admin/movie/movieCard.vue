<template>
  <div class="d-flex" style="height: calc(100vh - 100px); overflow: hidden">
    <div style="width: 320px; display: flex; flex-direction: column">
      <div class="p-3 pt-0">
        <input
          type="text"
          class="form-control"
          style="max-width: 300px"
          v-model="searchQuery"
          placeholder="Nhập từ khoá (phim, thể loại)"
        />
      </div>
      <div style="flex: 1; overflow-y: auto" class="p-3 sidebar-scroll">
        <div v-if="movies.length === 0" class="text-center text-muted py-4">
          Chưa có phim nào.
        </div>

        <div
          v-else-if="filteredMovies.length === 0"
          class="text-center text-muted py-4"
        >
          Không tìm thấy phim nào phù hợp với từ khoá.
        </div>

        <div v-else class="movie-scroll-container flex-column">
          <div
            v-for="movie in filteredMovies"
            :key="movie.id"
            class="movie-card"
            :class="{ active: selectedMovie?.id === movie.id }"
            @click="selectMovie(movie)"
          >
            <div class="card h-100 shadow-sm border-0">
              <div class="card-body p-2 d-flex align-items-center gap-2">
                <img :src="getPoster(movie)" alt="Poster" class="poster-img" />
                <div
                  class="flex-grow-1 d-flex flex-column justify-content-between h-100"
                >
                  <h6 :title="movie.ten">{{ movie.ten }}</h6>
                  <button
                    class="btn btn-sm btn-outline-danger align-self-end"
                    @click.stop="confirmDelete(movie)"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade-expand" mode="out-in">
      <!-- Expanded view -->
      <div v-if="selectedMovie" class="expanded-view" :key="selectedMovie?.id">
        <div class="scroll-container">
          <!-- Section 1: movieForm -->
          <div class="snap-section">
            <div class="card p-4 border-0 shadow-sm">
              <movieForm
                :movie="selectedMovie"
                :modal="false"
                @submitted="fetchMovies"
                @close="selectedMovie = null"
              />
            </div>
          </div>

          <!-- Section 2: Đánh giá -->
          <div class="snap-section">
            <div class="card border-0 shadow-sm">
              <comments v-if="selectedMovie" :movie-id="selectedMovie.id" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { getAllMovies, softDeleteMovie } from "@/services/movie";
import movieForm from "@/components/admin/movie/movieEditForm.vue";
import comments from "@/components/admin/movie/comments.vue";
const movies = ref([]);
const selectedMovie = ref(null);
const searchQuery = ref("");

const getPoster = (movie) => {
  const poster = movie.PhuongTienMedia?.find((m) => m.loai === "poster");
  return poster
    ? `http://localhost:3000/uploads/${poster.duongDan}`
    : "/default-poster.jpg";
};

const selectMovie = (movie) => {
  selectedMovie.value = movie;
};

const confirmDelete = async (movie) => {
  const result = await Swal.fire({
    title: "Xác nhận xoá?",
    text: `Bạn có chắc muốn xoá phim "${movie.ten}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xoá",
    cancelButtonText: "Huỷ",
  });

  if (!result.isConfirmed) return;

  try {
    await softDeleteMovie(movie.id);
    Swal.fire("Đã xoá", `Phim "${movie.ten}" đã bị xoá.`, "success");
    await fetchMovies();
  } catch (err) {
    Swal.fire("Lỗi", "Không thể xoá phim", "error");
    console.error(err);
  }
};

const fetchMovies = async () => {
  try {
    const res = await getAllMovies();
    movies.value = res.data.data;
    if (movies.value.length > 0) {
      selectMovie(movies.value[0]);
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách phim", err);
  }
};

const filteredMovies = computed(() => {
  if (!searchQuery.value.trim()) return movies.value;

  const keywords = searchQuery.value
    .split(",")
    .map((kw) => kw.trim().toLowerCase())
    .filter((kw) => kw);

  return movies.value.filter((movie) => {
    const tenPhim = movie.ten.toLowerCase();
    const theLoais = (movie.TheLoais || []).map((tl) => tl.ten.toLowerCase());

    return keywords.every(
      (kw) => tenPhim.includes(kw) || theLoais.some((tl) => tl.includes(kw))
    );
  });
});

onMounted(fetchMovies);

defineExpose({ fetchMovies });
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
  height: 100px;
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

.scroll-container {
  display: flex;
  flex-direction: column;
}

.snap-section {
  scroll-snap-align: start;
  height: calc(100vh - 100px);
  padding: 1rem;
  box-sizing: border-box;
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

/* Ẩn scrollbar trình duyệt WebKit (Chrome, Edge, Safari) */
.movie-scroll-container::-webkit-scrollbar,
.expanded-view::-webkit-scrollbar,
.sidebar-scroll::-webkit-scrollbar {
  width: 0;
  height: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
