<template>
  <div class="d-flex" style="height: calc(100vh - 100px); overflow: hidden">
    <!-- Sidebar người dùng -->
    <div style="width: 320px; display: flex; flex-direction: column">
      <div class="p-3 pt-0">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Tìm theo ND, email, V.Trò, T.Thái"
        />
      </div>
      <div style="flex: 1; overflow-y: auto" class="p-3 sidebar-scroll">
        <div v-if="users.length === 0" class="text-center text-muted py-4">
          Chưa có người dùng nào.
        </div>

        <div
          v-else-if="filteredUsers.length === 0"
          class="text-center text-muted py-4"
        >
          Không tìm thấy người dùng phù hợp.
        </div>

        <div v-else class="user-scroll-container flex-column">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="user-card"
            :class="[
              { active: selectedUser?.id === user.id },
              user.trangThai === 'bad' ? 'bg-light text-muted' : '',
            ]"
            @click="selectedUser = user"
          >
            <div class="card h-100 shadow-sm border-0">
              <div class="card-body p-2 d-flex align-items-center gap-2">
                <img :src="getAvatar(user)" alt="Avatar" class="avatar-img" />
                <div class="flex-grow-1">
                  <h6 class="mb-1" :title="user.tenDangNhap">
                    {{ user.tenDangNhap }}
                  </h6>
                  <small class="text-muted">{{ user.email }}</small>
                  <div class="d-flex gap-2 mt-1 flex-wrap">
                    <span class="badge" :class="getRoleBadge(user.vaiTro)">
                      {{ user.vaiTro }}
                    </span>
                    <span class="badge" :class="getStatusBadge(user.trangThai)">
                      {{ user.trangThai }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phần chi tiết người dùng -->
    <Transition name="fade-expand" mode="out-in">
      <div v-if="selectedUser" class="expanded-view" :key="selectedUser.id">
        <div class="scroll-container">
          <div class="snap-section">
            <UserDetail :user="selectedUser" @updated="fetchUsers" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAllUsers } from "@/services/user";
import UserDetail from "./userDetail.vue";
const users = ref([]);
const selectedUser = ref(null);
const searchQuery = ref("");

const getAvatar = (user) => {
  return user.duongDanAvatar
    ? `http://localhost:3000/uploads/${user.duongDanAvatar}`
    : "/default-avatar.png";
};

const fetchUsers = async (updatedId = null) => {
  try {
    const res = await getAllUsers();
    users.value = res.data.data;
    if (updatedId) {
      const found = users.value.find((u) => u.id === updatedId);
      if (found) selectedUser.value = found;
    } else if (!selectedUser.value && users.value.length > 0)
      selectedUser.value = users.value[0];
  } catch (err) {
    console.error("Lỗi khi lấy danh sách người dùng:", err);
  }
};

const filteredUsers = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return users.value;

  const keywords = q
    .split(/[,;|]+/)
    .map((k) => k.trim())
    .filter(Boolean);

  return users.value.filter((user) => {
    const combined = [user.tenDangNhap, user.email, user.vaiTro, user.trangThai]
      .join(" ")
      .toLowerCase();

    return keywords.every((kw) => combined.includes(kw));
  });
});

// Badge màu cho vai trò
const getRoleBadge = (vaiTro) => {
  switch (vaiTro) {
    case "admin":
      return "bg-danger";
    case "client":
      return "bg-primary";
    default:
      return "bg-secondary";
  }
};

// Badge màu cho trạng thái
const getStatusBadge = (trangThai) => {
  switch (trangThai) {
    case "good":
      return "bg-success";
    case "bad":
      return "bg-secondary";
    default:
      return "bg-light text-muted";
  }
};

onMounted(fetchUsers);
defineExpose({
  fetchUsers,
});
</script>

<style scoped>
.user-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.user-card {
  cursor: pointer;
  transition: all 0.3s ease;
}
.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}
.user-card.active {
  outline: 2px solid #0d6efd;
  background: #f0f8ff;
  border-radius: 8px;
}
.avatar-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}
.expanded-view {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  border: 1px solid #ddd;
  border-radius: 12px;
}
.scroll-container {
  display: flex;
  flex-direction: column;
}
.snap-section {
  scroll-snap-align: start;
  height: calc(100vh - 100px);
  padding: 1rem;
  box-sizing: border-box;
}
.fade-expand-enter-active,
.fade-expand-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-expand-enter-from,
.fade-expand-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-expand-enter-to,
.fade-expand-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.sidebar-scroll::-webkit-scrollbar,
.expanded-view::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
