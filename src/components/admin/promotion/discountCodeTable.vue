<template>
  <div v-if="loading" class="text-center py-3 text-muted">Đang tải...</div>

  <div v-else-if="codes.length === 0" class="text-center py-3 text-muted">
    Chưa có mã nào được phát hành cho chương trình này.
  </div>

  <div v-else class="table-responsive">
    <table class="table table-bordered table-striped">
      <thead class="table-light">
        <tr>
          <th>Mã</th>
          <th>Người dùng</th>
          <th>Đã dùng</th>
          <th>Ngày tạo</th>
          <th>Ngày dùng</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ma in codes" :key="ma.id">
          <td>{{ ma.ma }}</td>
          <td>
            {{ ma.nguoiDung?.tenDangNhap || "Ẩn danh" }}
            <br />
            <small class="text-muted">{{ ma.nguoiDung?.email || "" }}</small>
          </td>
          <td>
            <span :class="ma.daDung ? 'text-success' : 'text-danger'">
              {{ ma.daDung ? "Đã dùng" : "Chưa dùng" }}
            </span>
          </td>
          <td>{{ formatDate(ma.taoLuc) }}</td>
          <td>{{ ma.suDungLuc ? formatDate(ma.suDungLuc) : "-" }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { getAllCodesByPromotionId } from "@/services/promotion";

const props = defineProps({
  khuyenMaiId: {
    type: Number,
    required: true,
  },
});

const codes = ref([]);
const loading = ref(false);

const fetchCodes = async () => {
  if (!props.khuyenMaiId) return;
  loading.value = true;
  try {
    const res = await getAllCodesByPromotionId(props.khuyenMaiId);
    codes.value = res.data.data;
  } catch (err) {
    console.error("Lỗi khi lấy mã:", err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (d) => {
  return new Date(d).toLocaleString("vi-VN");
};

watch(() => props.khuyenMaiId, fetchCodes, { immediate: true });
onMounted(fetchCodes);
defineExpose({ fetchCodes });
</script>
