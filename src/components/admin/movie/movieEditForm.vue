<template>
  <div class="movie-form">
    <h5 class="mb-3">Chi tiết phim</h5>

    <form @submit.prevent="submitForm">
      <div class="form-columns">
        <div class="form-column">
          <div class="form-group">
            <label>Tên phim</label>
            <input
              v-model="form.ten"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label>Ngày khởi chiếu</label>
            <input
              v-model="form.ngayKhoiChieu"
              type="date"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label>Thể loại</label>
            <div class="genre-badges">
              <span
                v-for="tl in allGenres"
                :key="tl.id"
                class="badge"
                :class="
                  form.theLoaiIds.includes(tl.id)
                    ? 'bg-primary text-white'
                    : 'bg-light text-dark'
                "
                @click="toggleGenre(tl.id)"
              >
                {{ tl.ten }}
              </span>
            </div>
          </div>
        </div>

        <div class="form-column">
          <div class="form-group">
            <label>Thời lượng (phút)</label>
            <input
              v-model.number="form.thoiLuong"
              type="number"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label>Mô tả</label>
            <textarea
              v-model="form.moTa"
              rows="3"
              class="form-control"
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label>Trailer (URL)</label>
            <div class="d-flex gap-2 align-items-center">
              <input v-model="form.trailers" type="url" class="form-control" />
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="showTrailer = true"
                :disabled="!form.trailers"
              >
                Xem
              </button>
            </div>
          </div>
          <trailerModal
            v-if="showTrailer"
            :show="showTrailer"
            :url="form.trailers"
            :ten="form.ten"
            @close="showTrailer = false"
          />
        </div>
      </div>

      <div class="form-group full-width">
        <label>Poster</label>
        <input
          type="file"
          multiple
          accept="image/*"
          @change="handleFileUpload"
          class="form-control"
        />
        <div class="poster-preview">
          <img
            v-for="(media, index) in oldPosters"
            :key="'old-' + index"
            :src="getOldPosterUrl(media.duongDan)"
            alt="Poster"
          />
          <div
            v-for="(url, index) in posterPreviews"
            :key="'new-' + index"
            class="poster-item"
          >
            <img
              :src="url"
              alt="Preview"
              @dblclick="removeNewPoster(index)"
              title="Double click để xóa"
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-outline-success">Cập nhật</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { updateMovie, getAllGenres } from "@/services/movie";
import trailerModal from "@/components/admin/movie/trailer.vue";
import Swal from "sweetalert2";
const showTrailer = ref(false);

const props = defineProps({
  movie: { type: Object, required: true },
});
const emit = defineEmits(["submitted"]);

const allGenres = ref([]);
const posters = ref([]);
const posterPreviews = ref([]);
const oldPosters = ref([]);

const form = reactive({
  ten: "",
  moTa: "",
  thoiLuong: 90,
  ngayKhoiChieu: "",
  trailers: "",
  theLoaiIds: [],
});

const getOldPosterUrl = (filename) =>
  `http://localhost:3000/uploads/${filename}`;

const toggleGenre = (id) => {
  const index = form.theLoaiIds.indexOf(id);
  if (index === -1) form.theLoaiIds.push(id);
  else form.theLoaiIds.splice(index, 1);
};

const handleFileUpload = (e) => {
  const newFiles = Array.from(e.target.files);
  posters.value.push(...newFiles);
  posterPreviews.value.push(
    ...newFiles.map((file) => URL.createObjectURL(file))
  );
};
const removeNewPoster = (index) => {
  posters.value.splice(index, 1);
  posterPreviews.value.splice(index, 1);
};

const formChanged = () => {
  const original = props.movie;
  return !(
    form.ten === original.ten &&
    form.moTa === original.moTa &&
    form.thoiLuong === original.thoiLuong &&
    form.ngayKhoiChieu === original.ngayKhoiChieu?.split("T")[0] &&
    form.trailers ===
      original?.PhuongTienMedia?.find((m) => m.loai === "trailer")?.duongDan &&
    JSON.stringify(form.theLoaiIds.sort()) ===
      JSON.stringify((original.TheLoais || []).map((tl) => tl.id).sort()) &&
    posters.value.length === 0
  );
};

const submitForm = async () => {
  if (!formChanged()) {
    Swal.fire({
      icon: "info",
      title: "Không có thay đổi",
      text: "Bạn chưa thay đổi nội dung nào để cập nhật.",
    });
    return;
  }

  const formData = new FormData();
  Object.entries(form).forEach(([key, val]) => {
    if (Array.isArray(val)) val.forEach((v) => formData.append(`${key}[]`, v));
    else formData.append(key, val);
  });
  posters.value.forEach((file) => formData.append("posters", file));

  try {
    await updateMovie(props.movie.id, formData);
    await Swal.fire({
      icon: "success",
      title: "Cập nhật thành công",
      timer: 1500,
      showConfirmButton: false,
    });
    emit("submitted");
  } catch (err) {
    console.error("Lỗi cập nhật phim", err);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể cập nhật phim. Vui lòng thử lại.",
    });
  }
};

onMounted(async () => {
  const res = await getAllGenres();
  allGenres.value = res.data.data;
});

watch(
  () => props.movie,
  (newMovie) => {
    if (!newMovie) return;
    form.ten = newMovie.ten || "";
    form.moTa = newMovie.moTa || "";
    form.thoiLuong = newMovie.thoiLuong || 90;
    form.ngayKhoiChieu = newMovie.ngayKhoiChieu?.split("T")[0] || "";
    form.trailers =
      newMovie?.PhuongTienMedia?.find((m) => m.loai === "trailer")?.duongDan ||
      "";
    form.theLoaiIds = newMovie.TheLoais?.map((tl) => tl.id) || [];
    oldPosters.value =
      newMovie?.PhuongTienMedia?.filter((m) => m.loai === "poster") || [];
    posterPreviews.value = [];
    posters.value = [];
  },
  { immediate: true }
);
</script>
<style scoped>
.movie-form {
  max-width: 100%;
  font-size: 14px;
}
.form-columns {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}
.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.genre-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.badge {
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}
.poster-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 0.5rem;
}
.poster-preview img {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}
.form-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.full-width {
  margin-top: 1rem;
}
</style>
