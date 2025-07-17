<template>
  <footer class="footer bg-dark text-white py-3">
    <div class="container">
      <div class="row text-center text-lg-start align-items-start">
        <div class="col-lg-3 mb-4">
          <h1 class="logo mb-2">🎟 TicketMovie</h1>
          <p class="mb-0">© 2025 Đại học Cần Thơ</p>
        </div>

        <div class="col-lg-3 mb-4">
          <h6 class="section-title">Liên hệ</h6>
          <ul class="list-unstyled mb-0 lh-lg">
            <li>📧 tinb2111867@student.ctu.edu.vn</li>
            <li>📞 0921 212 276</li>
            <li>📍 Khu II, Đường 3/2, Cần Thơ</li>
          </ul>
        </div>

        <div class="col-lg-3 mb-4">
          <h6 class="section-title">Liên kết</h6>
          <ul class="list-unstyled mb-0 lh-lg">
            <li>
              <RouterLink to="/" class="footer-link">Trang chủ</RouterLink>
            </li>
            <li>
              <RouterLink to="/promotion" class="footer-link"
                >Khuyến mãi</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/branch" class="footer-link"
                >Chi nhánh</RouterLink
              >
            </li>
          </ul>
        </div>

        <div class="col-lg-3 mb-4">
          <h6 class="section-title">Thông tin</h6>
          <ul class="list-unstyled mb-0 lh-lg">
            <li>Đặt vé online nhanh chóng</li>
            <li>Thanh toán tại rạp</li>
            <li>Giữ vé 15 phút trước giờ chiếu</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.footer {
  font-size: 15px;
  background-color: #212529;
  line-height: 1.6;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffc107;
}

.section-title {
  font-size: 1.05rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #ffc107;
  margin-bottom: 0.6rem;
}

.footer-link {
  color: #ffffff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #ffc107;
  text-decoration: underline;
}
</style>
