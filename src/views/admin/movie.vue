<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2 class="text-xl font-bold mb-0">Quản lý Phim</h2>
      <button class="btn btn-outline-primary" @click="openAddForm">
        Thêm Phim
      </button>
    </div>
    <movieCard ref="movieCardRef" />

    <movieCreateForm
      v-if="showAddForm"
      @submitted="handleAddedMovie"
      @close="showAddForm = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import movieCard from "@/components/admin/movie/movieCard.vue";
import movieCreateForm from "@/components/admin/movie/movieCreateForm.vue";
const movieCardRef = ref(null);
const showAddForm = ref(false);

const openAddForm = () => {
  showAddForm.value = true;
};
const handleAddedMovie = () => {
  showAddForm.value = false;
  movieCardRef.value?.fetchMovies();
};
</script>
