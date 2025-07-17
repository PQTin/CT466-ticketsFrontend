<template>
  <div class="container py-4">
    <h2 class="text-white mb-4">Hệ thống chi nhánh</h2>
    <div class="row g-4">
      <div v-for="cn in chiNhanhs" :key="cn.id" class="col-md-4">
        <div
          class="card h-100 shadow-sm branch-card"
          @click="goToShowtimes(cn.ten)"
        >
          <div class="card-body">
            <h5 class="card-title text-warning">{{ cn.ten }}</h5>
            <p class="card-text text-white small mb-1">
              <i class="bi bi-geo-alt-fill text-secondary me-1"></i
              >{{ cn.diaChi }}
            </p>
            <p class="card-text text-white small">
              <i class="bi bi-telephone-fill text-secondary me-1"></i
              >{{ cn.soDienThoai }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllBranch } from "@/services/rap";

const chiNhanhs = ref([]);
const router = useRouter();

onMounted(async () => {
  const res = await getAllBranch();
  if (res.data.success) {
    chiNhanhs.value = res.data.data;
  }
});

function goToShowtimes(ten) {
  router.push({
    name: "showtime",
    query: {
      ten,
    },
  });
}
</script>

<style scoped>
.branch-card {
  cursor: pointer;
  background-color: #2c2f36;
  border: 1px solid #444;
  transition: transform 0.2s;
}
.branch-card:hover {
  transform: scale(1.02);
}
</style>
