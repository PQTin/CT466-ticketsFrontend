<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-xl font-bold mb-0">Quản lý Rạp</h2>
      <div class="d-flex gap-2">
        <button
          v-if="currentView === 'branch'"
          class="btn btn-outline-primary"
          @click="showAddBranch = true"
        >
          Thêm Chi Nhánh
        </button>
        <button class="btn btn-outline-secondary" @click="toggleView">
          {{ currentView === "branch" ? "Quản lý Loại Ghế" : "Quay lại" }}
        </button>
      </div>
    </div>

    <branchCard ref="branchCardRef" v-if="currentView === 'branch'" />

    <addBranch
      v-if="showAddBranch && currentView === 'branch'"
      @close="showAddBranch = false"
      @branch-added="handleBranchAdded"
    />
    <seatTypes v-if="currentView === 'seat'" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import branchCard from "@/components/admin/rap/branchCard.vue";
import addBranch from "@/components/admin/rap/addBranch.vue";
import seatTypes from "@/components/admin/rap/seatTypes.vue";
const showAddBranch = ref(false);
const branchCardRef = ref(null);

const currentView = ref("branch");

const toggleView = () => {
  currentView.value = currentView.value === "branch" ? "seat" : "branch";
};

const handleBranchAdded = () => {
  branchCardRef.value?.fetchBranches?.();
};
</script>
