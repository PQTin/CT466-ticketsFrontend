<template>
  <div class="branch-room-container" v-if="selectedBranch">
    <!-- Giao diện sau khi chọn -->
    <div class="selected-layout">
      <div class="sidebar">
        <div
          v-for="branch in branches"
          :key="branch.id"
          class="branch-card minimized"
          :class="{ active: branch.id === selectedBranch.id }"
          @click="selectBranch(branch)"
        >
          <div class="card-body">
            <h6>{{ branch.ten }}</h6>
          </div>
        </div>
      </div>
      <transition name="slide-fade" mode="out-in">
        <div class="expanded-view" :key="selectedBranch.id">
          <div class="card expanded-card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <div>
                <h4>{{ selectedBranch.ten }}</h4>
                <p class="text-muted mb-0">
                  📍 {{ selectedBranch.diaChi }}<br />
                  📞 {{ selectedBranch.soDienThoai }}
                </p>
              </div>
              <div class="d-flex flex-column gap-2">
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="handleDeleteBranch"
                >
                  Xóa chi nhánh
                </button>
                <button
                  class="btn btn-outline-success btn-sm"
                  @click="handleAddRoom"
                >
                  Thêm phòng
                </button>
              </div>
            </div>
            <div class="card-body">
              <roomCard ref="roomCardRef" :chiNhanhId="selectedBranch.id" />

              <addRoom
                v-if="showAddRoom"
                :chiNhanhId="selectedBranch.id"
                @close="showAddRoom = false"
                @room-added="handleRoomAdded"
              />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllBranch, deleteBranch } from "@/services/rap";
import addRoom from "./addRoom.vue";
import roomCard from "./roomCard.vue";
import Swal from "sweetalert2";

const roomCardRef = ref(null);
const branches = ref([]);
const selectedBranch = ref(null);
const showAddRoom = ref(false);

const handleAddRoom = () => {
  showAddRoom.value = true;
};

const handleRoomAdded = () => {
  // Gọi reload danh sách phòng từ roomCard thông qua ref
  roomCardRef.value?.fetchRooms?.();
};

const handleDeleteBranch = async () => {
  if (!selectedBranch.value) return;

  const result = await Swal.fire({
    title: "Xác nhận xóa chi nhánh?",
    text: `Bạn có chắc muốn xóa "${selectedBranch.value.ten}"?, sẽ xóa toàn bộ phòng chiếu liên quan!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });
  if (!result.isConfirmed) return;

  try {
    const res = await deleteBranch(selectedBranch.value.id);
    if (res.data.success) {
      await Swal.fire("Đã xóa!", res.data.message, "success");

      branches.value = branches.value.filter(
        (b) => b.id !== selectedBranch.value.id
      );

      selectedBranch.value =
        branches.value.length > 0 ? branches.value[0] : null;
    } else {
      await Swal.fire("Lỗi", "Không thể xóa chi nhánh.", "error");
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Xóa chi nhánh thất bại.", "error");
  }
};
const fetchBranches = async () => {
  try {
    const res = await getAllBranch();
    branches.value = res.data.data;
    if (branches.value.length > 0) {
      selectedBranch.value = branches.value[0];
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Lỗi", "Không thể tải danh sách chi nhánh", "error");
  }
};

const selectBranch = (branch) => {
  selectedBranch.value = branch;
};

onMounted(fetchBranches);
defineExpose({ fetchBranches });
</script>

<style scoped>
.branch-room-container {
  padding: 1rem;
  max-width: 100%;
  overflow-x: hidden;
}

.selected-layout {
  display: flex;
  gap: 1rem;
  max-width: 100%;
  overflow-x: hidden;
}

.sidebar {
  width: 220px;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}
.sidebar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.branch-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  white-space: normal;
  word-break: break-word;
  box-shadow: none;
  backface-visibility: hidden;
  will-change: transform;

  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.branch-card:hover {
  background-color: #ffffff;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1); /* nổi nhẹ */
}

/* Thu gọn card khi ở sidebar */
.minimized {
  padding: 0.5rem 1rem;
  font-size: 14px;
  background: #f5f5f5;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}
.minimized.active {
  background: #e0e0e0;
  font-weight: bold;
  border-left: 4px solid #409eff;
}

.expanded-view {
  flex: 1;
  min-width: 0;
  overflow-x: hidden;
  animation: fadeIn 0.5s ease;
}

.expanded-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  background: white;
  transition: all 0.5s ease-in-out;
  min-height: 80vh;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .selected-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .minimized {
    min-width: 150px;
    white-space: nowrap;
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
