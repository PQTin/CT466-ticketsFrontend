<template>
  <div class="layout-wrapper">
    <Navbar />
    <main :class="mainClass">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/client/navbar.vue";

const route = useRoute();

const mainClass = computed(() =>
  route.name === "home" ? "client-main home-page" : "client-main default-page"
);
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.client-main {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  overflow: auto;

  scrollbar-width: none;
  -ms-overflow-style: none;
}
.client-main::-webkit-scrollbar {
  display: none;
}

.home-page {
  margin-top: 0;
}

.default-page {
  margin-top: 50px;
}
</style>
