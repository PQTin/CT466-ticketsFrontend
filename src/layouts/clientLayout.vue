<template>
  <div class="layout-wrapper">
    <Navbar />
    <main :class="mainClass">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/client/navbar.vue";
import Footer from "@/components/client/footer.vue";
const route = useRoute();

const mainClass = computed(() =>
  route.name === "home" ? "client-main home-page" : "client-main default-page"
);
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.client-main {
  flex-grow: 1;
  width: 100%;
  background-color: #121212;
}

.client-main::-webkit-scrollbar {
  display: none;
}

.home-page {
  margin-top: 0;
}

.default-page {
  padding-top: 60px;
}
</style>
