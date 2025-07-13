<template>
  <div class="p-4 ticket-wrapper">
    <div class="d-flex mb-2 justify-between align-items-center">
      <h2 class="text-xl font-bold mb-0">Vé Đã Đặt</h2>
    </div>
    <ticket />
  </div>
</template>

<script setup>
import ticket from "@/components/client/userTicket/ticketCard.vue";
</script>
<style scoped>
.ticket-wrapper {
  background-color: #1e1e1e;
  min-height: 100vh;
}
.ticket-wrapper h2 {
  color: #ffffff;
}
</style>
