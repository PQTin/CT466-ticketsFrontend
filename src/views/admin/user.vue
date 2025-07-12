<template>
  <div class="p-4">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2 class="text-xl font-bold mb-0">Quản Người Dùng</h2>
      <button class="btn btn-outline-primary" @click="showModal = true">
        Thêm
      </button>
    </div>
    <user ref="userRef" />

    <userForm
      v-if="showModal"
      @created="handleUserCreated"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import user from "@/components/admin/user/userCard.vue";
import userForm from "@/components/admin/user/userForm.vue";

const userRef = ref(null);
const showModal = ref(false);

const handleUserCreated = () => {
  userRef.value?.fetchUsers();
  showModal.value = false;
};
</script>
