<template>
  <div v-if="rooms.length === 0" class="text-center text-muted py-4">
    Hiện chưa có phòng chiếu nào cho chi nhánh này.
  </div>

  <div v-else class="room-layout-container">
    <div class="room-scroll-list">
      <div
        v-for="room in rooms"
        :key="room.id"
        class="room-card-item"
        :class="{ active: room.id === selectedRoomId }"
        @click="selectRoom(room.id, room.ten)"
      >
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body p-3 d-flex flex-column justify-content-between">
            <div class="d-flex justify-content-between align-items-start">
              <h5 class="mb-2 text-primary fw-semibold">{{ room.ten }}</h5>
              <button
                class="btn btn-sm btn-outline-danger p-0"
                @click.stop="confirmDeleteRoom(room.id, room.ten)"
              >
                Xóa
              </button>
            </div>
            <div class="text-end">
              <span class="badge bg-info text-white"
                >Ghế: {{ room.tongSoGhe }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedRoomId" class="mt-4">
      <transition name="fade" mode="out-in">
        <seat-table
          v-if="selectedRoomId"
          :key="selectedRoomId"
          :phong-chieu-id="selectedRoomId"
          :room-name="selectedRoomName"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getRoomsByBranch, deleteRoom } from "@/services/rap";
import SeatTable from "./seatTable.vue";
import Swal from "sweetalert2";

const props = defineProps({
  chiNhanhId: {
    type: Number,
    required: true,
  },
});

const rooms = ref([]);
const selectedRoomId = ref(null);
const selectedRoomName = ref("");

const fetchRooms = async () => {
  try {
    const res = await getRoomsByBranch(props.chiNhanhId);
    rooms.value = res.data.data;
    if (rooms.value.length > 0) {
      selectedRoomId.value = rooms.value[0].id;
      selectedRoomName.value = rooms.value[0].ten;
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể tải danh sách phòng chiếu", "error");
  }
};

const selectRoom = (roomId, roomName) => {
  selectedRoomId.value = roomId;
  selectedRoomName.value = roomName;
};

const confirmDeleteRoom = async (roomId, roomName) => {
  const result = await Swal.fire({
    title: "Xác nhận xóa phòng?",
    text: `Bạn có chắc muốn xóa phòng "${roomName}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteRoom(roomId);
    Swal.fire("Đã xóa!", `Phòng "${roomName}" đã được xóa.`, "success");
    await fetchRooms();
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Xóa phòng thất bại.", "error");
  }
};

onMounted(fetchRooms);
watch(() => props.chiNhanhId, fetchRooms);

defineExpose({ fetchRooms });
</script>

<style scoped>
.room-layout-container {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  min-height: 65vh;
}

.room-scroll-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  padding-top: 1rem;
  padding-left: 1rem;
  scroll-padding-left: 1rem;
}
.room-scroll-list::-webkit-scrollbar {
  height: 0;
}
.room-scroll-list::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.room-card-item {
  min-width: 220px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.35s ease;
  border-radius: 12px;
}

.room-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.room-card-item.active {
  outline: 2px solid #409eff;
  background: #f0f8ff;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
