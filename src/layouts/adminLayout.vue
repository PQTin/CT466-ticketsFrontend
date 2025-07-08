<template>
  <div class="admin-layout">
    <AdminNavbar />

    <div class="admin-content-wrapper">
      <div class="scaled-inner">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminNavbar from "@/components/admin/navbar.vue";
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navbar mặc định cao 56px */
.admin-content-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: start;
  height: calc(100vh - 56px); /* Trừ chiều cao navbar */
}

/* scale lại nhưng tăng chiều cao thực để bù lại phần bị co */
.scaled-inner {
  transform: scale(0.9);
  transform-origin: top center;
  width: 100%;
  height: calc(100% / 0.9); /* ~111% để khớp scale */
}
</style>
