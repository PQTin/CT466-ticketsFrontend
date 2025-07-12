<template>
  <div class="container py-4">
    <h2 class="mb-4 fw-bold">Thống Kê Hệ Thống</h2>
    <!-- Tổng quan -->
    <div class="row row-cols-1 row-cols-md-4 g-4 mb-4">
      <div class="col" v-for="item in summaryCards" :key="item.label">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body text-center">
            <h6 class="card-title text-muted">{{ item.label }}</h6>
            <h4 class="fw-bold">{{ item.value }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ -->
    <div class="row g-4 mb-4">
      <div class="col-lg-4 col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-header fw-semibold">Tỷ lệ vé thanh toán</div>
          <div
            class="card-body d-flex align-items-center justify-content-center"
          >
            <canvas id="ticketPie" style="max-height: 200px"></canvas>
          </div>
        </div>
      </div>
      <div class="col-lg-8 col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-header fw-semibold">Doanh thu theo ngày</div>
          <div class="card-body">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ doanh thu theo chi nhánh -->
    <div class="row g-4 mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header fw-semibold">Doanh thu theo chi nhánh</div>
          <div class="card-body">
            <canvas id="branchRevenueChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Danh sách -->
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header fw-semibold">Top phim doanh thu cao</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="phim in data.topPhim"
              :key="phim.tenPhim"
              class="list-group-item d-flex justify-content-between"
            >
              <span>{{ phim.tenPhim }}</span>
              <span class="fw-bold">{{ formatCurrency(phim.doanhThu) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-header fw-semibold">Top combo bán chạy</div>
          <ul class="list-group list-group-flush">
            <li
              v-for="combo in data.topCombo"
              :key="combo.tenCombo"
              class="list-group-item d-flex justify-content-between"
            >
              <span>{{ combo.tenCombo }}</span>
              <span class="fw-bold">{{ combo.soLuong }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { dashboard } from "@/services/dashboard";
import Chart from "chart.js/auto";

const data = ref({});
const summaryCards = ref([]);

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));

onMounted(async () => {
  const res = await dashboard();
  data.value = res.data;

  summaryCards.value = [
    { label: "Tổng người dùng", value: data.value.tongNguoiDung },
    { label: "Tổng vé đã bán", value: data.value.veThanhToan },
    { label: "Tổng phim", value: data.value.tongPhim },
    { label: "Tổng doanh thu", value: formatCurrency(data.value.tongDoanhThu) },
    { label: "Tổng chi nhánh", value: data.value.tongChiNhanh },
    { label: "Tổng phòng chiếu", value: data.value.tongPhongChieu },
    { label: "Tổng combo", value: data.value.tongCombo },
    { label: "Tổng khuyến mãi", value: data.value.tongKhuyenMai },
  ];

  drawPieChart();
  drawBarChart();
  drawBranchRevenueChart();
});

const drawPieChart = () => {
  const ctx = document.getElementById("ticketPie");
  const pieData = data.value.soLuongVe || [];
  const labels = pieData.map((i) =>
    i.daThanhToan ? "Đã thanh toán" : "Chưa thanh toán"
  );
  const values = pieData.map((i) => i.soLuong);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#0d6efd", "#6c757d"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

const drawBarChart = () => {
  const ctx = document.getElementById("revenueChart");
  const labels = data.value.doanhThuTheoNgay.map((i) => i.ngay);
  const values = data.value.doanhThuTheoNgay.map((i) => Number(i.doanhThuVe));

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: values,
          backgroundColor: "#198754",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (val) {
              return formatCurrency(val);
            },
          },
        },
      },
    },
  });
};

const drawBranchRevenueChart = () => {
  const ctx = document.getElementById("branchRevenueChart");
  const labels = data.value.doanhThuChiNhanh.map((i) => i.chiNhanh);
  const values = data.value.doanhThuChiNhanh.map((i) => Number(i.doanhThu));

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: values,
          backgroundColor: "#fd7e14",
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function (val) {
              return formatCurrency(val);
            },
          },
        },
      },
    },
  });
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
}
</style>
