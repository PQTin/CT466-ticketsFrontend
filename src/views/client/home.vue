<template>
  <div class="page-scroll">
    <promotionOverlay />

    <section class="section full-height">
      <sidebar />
    </section>

    <section class="section auto-height">
      <showtime />
    </section>

    <section class="section auto-height">
      <movie />
    </section>
  </div>
</template>

<script setup>
import sidebar from "@/components/client/sidebar.vue";
import showtime from "@/views/client/showtime.vue";
import movie from "@/views/client/movie.vue";
import promotionOverlay from "@/components/client/promotionOverlay.vue";
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
  transition: transform 0.6s ease;
}

.full-height {
  height: 100vh;
  overflow: hidden;
}

.auto-height {
  min-height: 100vh;
  padding-top: 50px;
  background-color: #121212;
  box-sizing: border-box;
}
</style>
