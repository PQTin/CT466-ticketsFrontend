<template>
  <div class="notification-container">
    <div class="notification-header p-3 border-bottom">
      <h5 class="text-warning mb-0">Thông báo</h5>
    </div>

    <div class="notification-body p-3">
      <div v-if="notifications.length" class="list-group">
        <div
          v-for="noti in notifications"
          :key="noti.id"
          class="notification-card"
          :class="{ unread: !noti.daDoc }"
          @click="handleNotificationClick(noti)"
        >
          <div class="noti-header">
            <h6 class="mb-1 text-light">{{ noti.tieuDe }}</h6>
            <small class="text-secondary">{{ formatDate(noti.taoLuc) }}</small>
          </div>
          <p class="mb-0 text-light small">{{ noti.noiDung }}</p>
        </div>
      </div>
      <div v-else class="text-secondary">Bạn chưa có thông báo nào.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from "vue";
import { getUserNotifications, markNotificationsAsRead } from "@/services/user";
import { useAuthStore } from "@/store/authStore";

const notifications = ref([]);
const authStore = useAuthStore();
const toMarkAsRead = ref(new Set());

const handleNotificationClick = (noti) => {
  if (!noti.daDoc) {
    noti.daDoc = true;
    toMarkAsRead.value.add(noti.id);
  }
};

onMounted(async () => {
  if (!authStore.isLoggedIn) return;

  const res = await getUserNotifications();
  if (res.data.success) {
    notifications.value = res.data.data;
    const unreadCount = notifications.value.filter((n) => !n.daDoc).length;
  }
});

onUnmounted(async () => {
  if (toMarkAsRead.value.size > 0) {
    await markNotificationsAsRead({ ids: Array.from(toMarkAsRead.value) });
  }
});

const formatDate = (isoStr) => {
  const d = new Date(isoStr);
  return d.toLocaleString("vi-VN");
};
</script>

<style scoped>
.notification-container {
  background-color: #1a1a1a;
  color: #fff;
  border-radius: 12px;
  width: 320px;
  max-height: 400px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.notification-header {
  background-color: #1a1a1a;
  position: sticky;
  top: 0;
  z-index: 1;
}

.notification-body {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.notification-body::-webkit-scrollbar {
  display: none;
}

.notification-card {
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  transition: background 0.3s;
  border-left: 4px solid transparent;
  cursor: pointer;
}

.notification-card:hover {
  background-color: #333;
}

.notification-card.unread {
  border-left-color: #ffcc00;
  background-color: #3a3a3a;
}

.noti-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
