<template>
  <div class="movie-detail-wrapper container-fluid py-4 text-white">
    <div class="d-flex gap-4">
      <!-- Cột trái: Thông tin phim -->
      <div class="left-panel">
        <div v-if="movie" class="card bg-dark text-white p-3 rounded">
          <div class="d-flex gap-3">
            <!-- Poster -->
            <img
              :src="currentPoster"
              class="rounded shadow"
              style="width: 250px; height: 375px; object-fit: cover"
            />

            <!-- Thông tin -->
            <div class="flex-grow-1">
              <h3 class="fw-bold">{{ movie.ten }}</h3>
              <p>{{ movie.moTa }}</p>
              <p><strong>Thời lượng:</strong> {{ movie.thoiLuong }} phút</p>
              <p>
                <strong>Thể loại:</strong>
                {{ movie.theLoai?.join(", ") || "Không rõ" }}
              </p>
              <p>
                <strong>Khởi chiếu:</strong>
                {{ formatDate(movie.ngayKhoiChieu) }}
              </p>
              <p>
                <button
                  v-if="movie.trailer"
                  class="btn btn-outline-light btn-sm mt-2"
                  @click="showTrailer = true"
                >
                  Xem trailer
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải: placeholder bình luận-->
      <div class="right-panel flex-grow-1">
        <comments v-if="movie" :movie-id="movie.id" />
      </div>
    </div>

    <!-- suất chiếu -->
    <div class="comment-section bg-dark text-white mt-4 w-100 p-3 rounded-2">
      <h5 class="fw-bold mb-3 px-2">Suất chiếu</h5>
      <showtimeById v-if="movie" :movie-id="movie.id" />
    </div>
  </div>
  <trailer
    v-if="movie"
    :show="showTrailer"
    :url="movie.trailer"
    :ten="movie.ten"
    @close="showTrailer = false"
  />
</template>

<script setup>
import { ref, onMounted, watchEffect, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { getMovieById } from "@/services/movie";
import comments from "@/components/client/movieDetail/comments.vue";
import showtimeById from "@/components/client/movieDetail/showtimesById.vue";
import trailer from "@/components/client/trailer.vue";
const movie = ref(null);
const currentPoster = ref("");
let intervalId = null;

const showTrailer = ref(false);
const route = useRoute();
const fetchMovie = async () => {
  try {
    const id = route.params.idPhim;
    const res = await getMovieById(id);
    movie.value = res.data.data;
  } catch (err) {
    console.error("Lỗi khi tải phim:", err);
  }
};

watchEffect(() => {
  if (movie.value?.posters?.length) {
    const posters = movie.value.posters;
    let index = 0;
    currentPoster.value = `http://localhost:3000/uploads/${posters[0]}`;

    clearInterval(intervalId);
    intervalId = setInterval(() => {
      index = (index + 1) % posters.length;
      currentPoster.value = `http://localhost:3000/uploads/${posters[index]}`;
    }, 3000);
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
};

onMounted(fetchMovie);
</script>

<style scoped>
.movie-detail-wrapper {
  background-color: #1e1e1e;
  min-height: 100vh;
}

.left-panel {
  max-width: 700px;
  width: 100%;
}
.left-panel .card {
  min-height: 670px;
  max-height: 670px;
  overflow: hidden;
}

.right-panel {
  min-width: 300px;
}

.comment-section {
  padding: 1rem 0;
}
</style>
