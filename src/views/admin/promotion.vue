<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2 class="text-xl font-bold mb-0">Quản lý chương trình khuyến mãi</h2>
      <button class="btn btn-outline-primary" @click="openAddForm">
        Thêm khuyến mãi
      </button>
    </div>

    <promotionCard ref="cardRef" />

    <promotionForm
      v-if="showForm"
      @close="showForm = false"
      @created="handleCreated"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import promotionCard from "@/components/admin/promotion/promotionCard.vue";
import promotionForm from "@/components/admin/promotion/promotionForm.vue";

const showForm = ref(false);
const cardRef = ref(null);

const openAddForm = () => {
  showForm.value = true;
};

const handleCreated = () => {
  cardRef.value?.fetchPromotions?.();
};
</script>
