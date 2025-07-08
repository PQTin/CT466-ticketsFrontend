<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Thêm Suất Chiếu</h3>

      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label class="form-label">Chọn Phim</label>
          <select v-model="form.phimId" class="form-control" required>
            <option v-for="movie in movies" :key="movie.id" :value="movie.id">
              {{ movie.ten }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Chọn Phòng</label>
          <select v-model="form.phongChieuId" class="form-control" required>
            <optgroup
              v-for="branch in branches"
              :label="branch.ten"
              :key="branch.id"
            >
              <option
                v-for="room in branch.PhongChieus"
                :key="room.id"
                :value="room.id"
              >
                {{ room.ten }}
              </option>
            </optgroup>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Thời gian bắt đầu</label>
          <input
            type="datetime-local"
            v-model="form.batDau"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Thời gian kết thúc</label>
          <input
            type="datetime-local"
            v-model="form.ketThuc"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Giá vé</label>
          <input
            type="number"
            class="form-control"
            v-model.number="form.giaVe"
            required
            min="0"
            step="1000"
          />
        </div>

        <div class="modal-footer">
          <button type="submit" class="btn btn-success">Thêm</button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import {
  getNameMovie,
  getNameBranch,
  createShowtime,
} from "@/services/showtimeCombo";

const emit = defineEmits(["close", "created"]);

const form = ref({
  phimId: "",
  phongChieuId: "",
  batDau: "",
  ketThuc: "",
  giaVe: 0,
});

const movies = ref([]);
const branches = ref([]);

onMounted(async () => {
  const [movieRes, branchRes] = await Promise.all([
    getNameMovie(),
    getNameBranch(),
  ]);
  movies.value = movieRes.data.data;
  branches.value = branchRes.data.data;
});

const toISOString = (datetimeLocalStr) => {
  const d = new Date(datetimeLocalStr);
  return d.toISOString();
};

const submitForm = async () => {
  try {
    const payload = {
      phimId: form.value.phimId,
      phongChieuId: form.value.phongChieuId,
      batDau: toISOString(form.value.batDau),
      ketThuc: toISOString(form.value.ketThuc),
      giaVe: form.value.giaVe,
    };
    await createShowtime(payload);
    Swal.fire("Thành công", "Thêm lịch chiếu thành công", "success");
    emit("created");
    emit("close");
  } catch (err) {
    console.error(err);
    Swal.fire(
      "Lỗi",
      err.response?.data?.message || "Không thể thêm suất chiếu",
      "error"
    );
  }
};
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
  z-index: 1000;
}
.modal-content {
  background: #fdfdfd;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 100vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}
.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
