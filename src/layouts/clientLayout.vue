<template>
  <div>
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
.client-main {
  min-height: 100vh;
  width: 100%;
}

.home-page {
  margin-top: 0;
}

.default-page {
  margin-top: 50px;
}
</style>
