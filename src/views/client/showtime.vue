<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-white flex-grow-1">Danh sách Suất Chiếu</h2>
    </div>

    <!-- Danh sách suất chiếu dạng card -->
    <div class="row justify-content-center">
      <div
        v-for="item in paginatedShowtimes"
        :key="item.id"
        class="col-md-6 col-lg-3 mb-4"
      >
        <div
          class="card showtime-card"
          :class="{ 'expanded-card': selectedShowtimeId === item.id }"
        >
          <transition name="fade-height">
            <div
              class="showtime-content-wrapper"
              v-show="selectedShowtimeId === item.id || true"
            >
              <div
                class="showtime-content"
                :class="{ expanded: selectedShowtimeId === item.id }"
              >
                <div class="showtime-image">
                  <img
                    :src="`http://localhost:3000/uploads/${getPosterPath(item.Phim?.PhuongTienMedia)}`"
                    class="card-img-top"
                    alt="Poster phim"
                  />
                </div>
                <div
                  v-show="selectedShowtimeId === item.id"
                  class="showtime-details"
                >
                  <p>
                    <strong>Chi nhánh:</strong><br />
                    {{ item.PhongChieu?.ChiNhanh?.ten }}
                  </p>
                  <p>
                    <strong>Phòng:</strong><br />
                    {{ item.PhongChieu?.ten }}
                  </p>
                  <p>
                    <strong>Giá vé:</strong> <br />{{
                      formatCurrency(item.giaVe)
                    }}
                  </p>
                  <p>
                    <strong>Bắt đầu:</strong> <br />{{
                      formatDate(item.batDau)
                    }}
                  </p>
                  <button
                    class="btn btn-outline-light btn-sm"
                    @click="goToDetail(item.Phim.id)"
                  >
                    Chi tiết phim
                  </button>
                </div>
              </div>
            </div>
          </transition>
          <div class="card-body text-center">
            <h4 class="movie-title">{{ item.Phim.ten }}</h4>
            <div v-if="item.soGheTrong === 0" style="color: red">Hết vé.</div>
            <div v-else style="color: green">Còn {{ item.soGheTrong }} vé.</div>
            <button
              class="btn btn-outline-light btn-sm mt-2 me-2"
              @click="toggleDetails(item.id)"
            >
              {{ selectedShowtimeId === item.id ? "Thu gọn" : "Chi tiết" }}
            </button>
            <button
              v-if="item.soGheTrong > 0"
              class="btn btn-outline-light btn-sm mt-2"
              @click="goToBooking(item.id)"
            >
              Đặt vé
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">
            Trước
          </button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="changePage(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">
            Sau
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getShowtimesWithFilters } from "@/services/showtimeCombo";

const showtimes = ref([]);
const selectedShowtimeId = ref(null);
const currentPage = ref(1);
const perPage = 8;
const router = useRouter();

const fetchShowtimes = async () => {
  try {
    const res = await getShowtimesWithFilters({});
    if (res.data.success) {
      showtimes.value = res.data.data;
    }
  } catch (err) {
    console.error("Lỗi khi lấy suất chiếu:", err);
  }
};

onMounted(fetchShowtimes);

const toggleDetails = (id) => {
  selectedShowtimeId.value = selectedShowtimeId.value === id ? null : id;
};

const getPosterPath = (media) => {
  const poster = media?.find((m) => m.loai === "poster");
  return poster ? poster.duongDan : "";
};

const formatDate = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleString("vi-VN");
};

const formatCurrency = (num) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

const totalPages = computed(() => Math.ceil(showtimes.value.length / perPage));

const paginatedShowtimes = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return showtimes.value.slice(start, start + perPage);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goToDetail = (movieId) => {
  router.push(`/movieDetail/${movieId}`);
};

const goToBooking = (showtimeId) => {
  router.push(`/booking/${showtimeId}`);
};
</script>

<style scoped>
.container-fluid {
  background-color: #121212;
  padding-top: 20px;
}
.showtime-card {
  min-height: 530px;
  max-height: 530px;
  border-radius: 12px;
  overflow: hidden;
  background: #222;
  color: white;
  padding: 10px;
  box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
}
.expanded-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  max-width: 100%;
}
.showtime-content-wrapper {
  overflow: hidden;
  transition: max-height 0.4s ease;
}
.showtime-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
}
.showtime-content.expanded {
  flex-direction: row;
  align-items: flex-start;
  gap: 15px;
}
.showtime-image img {
  width: 250px;
  height: 360px;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}
.expanded-card .showtime-image img {
  width: 180px;
  height: 300px;
}
.movie-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #f8f9fa;
}
.showtime-details {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease-in-out;
  opacity: 0;
}
.expanded-card .showtime-details {
  opacity: 1;
}
.showtime-details button {
  display: block;
  margin: 10px auto 0;
}
.pagination .page-link {
  background: #333;
  color: white;
  border: none;
}
.pagination .active .page-link {
  background: #007bff;
}
.fade-height-enter-active,
.fade-height-leave-active {
  transition:
    max-height 0.4s ease,
    opacity 0.4s ease;
}
.fade-height-enter-from,
.fade-height-leave-to {
  max-height: 0;
  opacity: 0;
}
.fade-height-enter-to,
.fade-height-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
