<template>
  <div class="card p-4 shadow-sm">
    <h4 class="mb-4">Quản lý loại ghế</h4>

    <div class="row g-4">
      <div class="col-md-5">
        <div class="border rounded p-3 h-100 bg-light">
          <h5 class="mb-3 text-success">Thêm loại ghế mới</h5>
          <form @submit.prevent="addSeatType">
            <div class="mb-3">
              <label class="form-label">Tên loại ghế</label>
              <input
                v-model="form.ten"
                type="text"
                class="form-control"
                placeholder="Ví dụ: VIP, Thường"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Giá phụ (VNĐ)</label>
              <input
                v-model.number="form.giaPhu"
                type="number"
                class="form-control"
                min="0"
                placeholder="0"
                required
              />
            </div>
            <button type="submit" class="btn btn-outline-success w-100">
              Thêm
            </button>
          </form>
        </div>
      </div>

      <!-- Danh sách loại ghế -->
      <div class="col-md-7">
        <div class="border rounded p-3 h-100">
          <h5 class="mb-3 text-primary">Danh sách loại ghế</h5>
          <ul class="list-group">
            <li
              v-for="type in seatTypes"
              :key="type.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{{ type.ten }}</strong>
                <span class="text-muted">
                  - phụ thu {{ type.giaPhu.toLocaleString() }}đ</span
                >
              </div>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(type.id, type.ten)"
              >
                Xóa
              </button>
            </li>
          </ul>
          <div
            v-if="seatTypes.length === 0"
            class="text-muted text-center py-3"
          >
            Chưa có loại ghế nào.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import {
  getAllSeatType,
  createSeatType,
  deleteSeatType as softDeleteSeatType,
} from "@/services/rap";

const seatTypes = ref([]);
const form = ref({ ten: "", giaPhu: 0 });

const fetchTypes = async () => {
  const res = await getAllSeatType();
  seatTypes.value = res.data.data.filter((item) => !item.daXoa);
};

const addSeatType = async () => {
  try {
    await createSeatType(form.value);
    Swal.fire("Thành công", "Đã thêm loại ghế", "success");
    form.value = { ten: "", giaPhu: 0 };
    fetchTypes();
  } catch (err) {
    Swal.fire("Lỗi", "Không thêm được loại ghế", "error");
  }
};

const confirmDelete = async (id, name) => {
  const result = await Swal.fire({
    title: "Xác nhận xóa?",
    text: `Xóa loại ghế "${name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (!result.isConfirmed) return;

  try {
    await softDeleteSeatType(id);
    Swal.fire("Đã xóa", "Loại ghế đã bị ẩn", "success");
    fetchTypes();
  } catch (err) {
    Swal.fire("Lỗi", "Xóa loại ghế thất bại", "error");
  }
};

onMounted(fetchTypes);
</script>
