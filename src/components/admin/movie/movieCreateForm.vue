<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Thêm Phim</h3>

      <form @submit.prevent="submitForm">
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Tên Phim</label>
            <input
              v-model="form.ten"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Ngày Phát Hành</label>
            <input
              v-model="form.ngayKhoiChieu"
              type="date"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-4">
            <label class="form-label">Thời Lượng (phút)</label>
            <input
              v-model.number="form.thoiLuong"
              type="number"
              class="form-control"
              required
            />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Thể Loại</label>
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
          <div class="col-md-6">
            <label class="form-label">Mô Tả</label>
            <textarea
              v-model="form.moTa"
              class="form-control"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Trailer URL</label>
            <input v-model="form.trailers" type="url" class="form-control" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Poster</label>
            <input
              type="file"
              @change="handleFileUpload"
              class="form-control"
              accept="image/*"
              multiple
            />
            <div class="poster-preview mt-2">
              <div
                v-for="(url, index) in posterPreviews"
                :key="'poster-' + index"
                class="poster-item"
              >
                <img
                  :src="url"
                  alt="Preview"
                  @dblclick="removePoster(index)"
                  title="Double click để xóa"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Thêm</button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { createMovie, getAllGenres } from "@/services/movie";
import Swal from "sweetalert2";

const emit = defineEmits(["close", "submitted"]);

const allGenres = ref([]);
const posters = ref([]);
const posterPreviews = ref([]);

const form = reactive({
  ten: "",
  ngayKhoiChieu: "",
  moTa: "",
  thoiLuong: 90,
  trailers: "",
  theLoaiIds: [],
});

const handleFileUpload = (e) => {
  const files = Array.from(e.target.files);
  posters.value.push(...files);
  posterPreviews.value.push(...files.map((f) => URL.createObjectURL(f)));
};

const removePoster = (index) => {
  posters.value.splice(index, 1);
  posterPreviews.value.splice(index, 1);
};

const toggleGenre = (id) => {
  const index = form.theLoaiIds.indexOf(id);
  if (index === -1) form.theLoaiIds.push(id);
  else form.theLoaiIds.splice(index, 1);
};

const submitForm = async () => {
  const formData = new FormData();
  Object.entries(form).forEach(([key, val]) => {
    if (Array.isArray(val)) val.forEach((v) => formData.append(`${key}[]`, v));
    else formData.append(key, val);
  });
  posters.value.forEach((file) => formData.append("posters", file));

  try {
    await createMovie(formData);
    await Swal.fire({
      icon: "success",
      title: "Thêm phim thành công",
      showConfirmButton: false,
      timer: 1500,
    });
    emit("submitted");
    emit("close");
  } catch (err) {
    console.error("Lỗi thêm phim", err);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể thêm phim. Vui lòng thử lại.",
    });
  }
};

onMounted(async () => {
  const res = await getAllGenres();
  allGenres.value = res.data.data;
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-content {
  background: #fdfdfd;
  padding: 20px;
  border-radius: 8px;
  width: 800px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
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
}
.poster-preview {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.poster-preview img {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
