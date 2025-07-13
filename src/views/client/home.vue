<template>
  <div class="page-scroll">
    <!-- Section 1 -->
    <section class="section full-height">
      <sidebar />
    </section>

    <!-- Section 2 -->
    <section class="section auto-height">
      <showtime />
    </section>
  </div>
</template>

<script setup>
import sidebar from "@/components/client/sidebar.vue";
import showtime from "@/views/client/showtime.vue";
</script>

<style scoped>
.page-scroll {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;

  /* Ẩn thanh cuộn */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}
.page-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.full-height {
  height: 100vh;
  overflow: hidden;
}

.auto-height {
  min-height: 100vh;
  padding-top: 55px; /* Tránh bị navbar che */
  background-color: #121212; /* Màu nền đen cho khoảng trống */
  box-sizing: border-box;
}
</style>
