<template>
  <div class="card border-0 p-4" v-if="showtime">
    <h2 class="p-4">Chi tiết suất chiếu</h2>
    <div class="d-flex gap-4 align-items-start ps-4 pe-4">
      <img
        :src="`http://localhost:3000/uploads/${posterList[currentPosterIndex]?.duongDan}`"
        class="poster rounded shadow-sm"
        :alt="`Poster ${currentPosterIndex + 1}`"
      />
      <div class="flex-grow-1">
        <h5 class="mb-1 fw-semibold text-primary">{{ showtime.Phim.ten }}</h5>
        <p class="text-muted fs-6 mb-0">{{ showtime.Phim.moTa }}</p>
      </div>
    </div>

    <hr class="my-3" />

    <div class="row gy-3">
      <div class="col-md-6">
        <label class="form-label fw-semibold">Phòng chiếu</label>
        <select
          v-model="form.phongChieuId"
          class="form-control"
          :disabled="!canEdit"
          required
        >
          <optgroup
            v-for="branch in branches"
            :key="branch.id"
            :label="branch.ten"
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

      <div class="col-md-6">
        <label class="form-label fw-semibold">Giá vé</label>
        <input
          type="number"
          :value="form.giaVe"
          class="form-control"
          disabled
        />
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold">Bắt đầu</label>
        <input
          type="datetime-local"
          v-model="form.batDau"
          class="form-control"
          :disabled="!canEdit"
        />
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold">Kết thúc</label>
        <input
          type="datetime-local"
          v-model="form.ketThuc"
          class="form-control"
          :disabled="!canEdit"
        />
      </div>
    </div>

    <div class="text-end mt-4" v-if="canEdit">
      <button class="btn btn-primary px-4" @click="updateShowtime">
        Cập nhật
      </button>
    </div>
  </div>

  <div v-else class="text-muted text-center">Chưa chọn suất chiếu nào.</div>
</template>

<script setup>
import { ref, watch, computed, onBeforeUnmount, onMounted } from "vue";
import Swal from "sweetalert2";
import { updateShowtimeById, getNameBranch } from "@/services/showtimeCombo";

const props = defineProps({ showtime: Object });
const emit = defineEmits(["updated"]);
const branches = ref([]);

onMounted(async () => {
  const res = await getNameBranch();
  branches.value = res.data.data;
});

const form = ref({ batDau: "", ketThuc: "", giaVe: "", phongChieuId: null });

const formatInputDate = (isoStr) => {
  const d = new Date(isoStr);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const posterList = computed(() => {
  return (
    props.showtime?.Phim?.PhuongTienMedia?.filter((p) => p.loai === "poster") ||
    []
  );
});

const currentPosterIndex = ref(0);
let posterInterval = null;
watch(
  () => props.showtime,
  (val) => {
    if (!val) return;
    form.value = {
      batDau: formatInputDate(val.batDau),
      ketThuc: formatInputDate(val.ketThuc),
      giaVe: Number(val.giaVe),
      phongChieuId: val.PhongChieu.id,
    };
  },
  { immediate: true }
);

watch(
  posterList,
  (list) => {
    clearInterval(posterInterval);
    currentPosterIndex.value = 0;

    if (list.length > 1) {
      posterInterval = setInterval(() => {
        currentPosterIndex.value = (currentPosterIndex.value + 1) % list.length;
      }, 3000);
    }
  },
  { immediate: true }
);

const canEdit = computed(() => {
  if (!props.showtime || props.showtime.daXoa) return false;
  const now = new Date();
  const batDau = new Date(props.showtime.batDau);
  return batDau > now;
});

const toISOString = (datetimeLocalStr) => {
  const d = new Date(datetimeLocalStr);
  return d.toISOString();
};
const updateShowtime = async () => {
  try {
    const payload = {
      phongChieuId: form.value.phongChieuId,
      batDau: toISOString(form.value.batDau),
      ketThuc: toISOString(form.value.ketThuc),
    };
    await updateShowtimeById(props.showtime.id, payload);
    Swal.fire("Thành công", "Cập nhật suất chiếu thành công", "success");
    emit("updated");
  } catch (err) {
    console.error(err);
    Swal.fire(
      "Lỗi",
      err.response?.data?.message || "Không thể cập nhật",
      "error"
    );
  }
};
</script>

<style scoped>
.poster {
  width: 120px;
  height: 160px;
  object-fit: cover;
  flex-shrink: 0;
}
</style>
