<template>
  <div
    class="p-4 pb-0 header-sticky d-flex justify-content-between align-items-center mb-2"
  >
    <h2 class="text-xl font-bold mb-0">
      {{ isComboMode ? "Quản lý Combo" : "Quản lý Suất Chiếu" }}
    </h2>
    <div class="d-flex gap-2">
      <button
        class="btn"
        :class="isComboMode ? 'btn-outline-primary' : 'btn-outline-secondary'"
        @click="toggleMode"
      >
        {{ isComboMode ? "Quản lý Suất Chiếu" : "Quản lý Combo" }}
      </button>
      <button
        v-if="!isComboMode"
        class="btn btn-outline-primary"
        @click="openAddForm"
      >
        Thêm Suất Chiếu
      </button>
      <button v-else class="btn btn-outline-primary" @click="openAddCombo">
        Thêm Combo
      </button>
    </div>
  </div>
  <div class="p-4 pt-0">
    <!-- Quản lý suất chiếu -->
    <div v-if="!isComboMode">
      <showtimeCard ref="cardRef" />
      <showtimeForm
        v-if="showForm"
        @close="showForm = false"
        @created="handleCreated"
      />
    </div>

    <!-- Quản lý combo -->
    <div v-else>
      <comboCard ref="comboRef" />
      <comboForm
        v-if="showComboForm"
        @close="showComboForm = false"
        @created="handleComboCreated"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import showtimeCard from "@/components/admin/showtimeCombo/showtimeCard.vue";
import showtimeForm from "@/components/admin/showtimeCombo/showtimeForm.vue";
import comboCard from "@/components/admin/showtimeCombo/ComboCard.vue";
import comboForm from "@/components/admin/showtimeCombo/comboForm.vue";

const isComboMode = ref(false);
const showForm = ref(false);
const showComboForm = ref(false);

const cardRef = ref(null);
const comboRef = ref(null);

const toggleMode = () => {
  isComboMode.value = !isComboMode.value;
};

const openAddForm = () => {
  showForm.value = true;
};

const openAddCombo = () => {
  showComboForm.value = true;
};

const handleCreated = () => {
  showForm.value = false;
  cardRef.value?.fetchShowtimes();
};

const handleComboCreated = () => {
  showComboForm.value = false;
  comboRef.value?.fetchCombos();
};
</script>
<style scoped>
.header-sticky {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;

  padding-bottom: 8px;
}
</style>
