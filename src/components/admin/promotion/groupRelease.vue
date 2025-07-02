<template>
  <div>
    <h5 class="mb-4 text-primary">Phát hành mã theo nhóm</h5>
    <div class="form-group mb-3">
      <label>Chọn nhóm người dùng</label>
      <div class="d-flex gap-2 flex-wrap">
        <span
          v-for="group in userGroups"
          :key="group.value"
          class="badge"
          :class="
            selectedGroups.includes(group.value)
              ? 'bg-primary text-white'
              : 'bg-light text-dark'
          "
          @click="toggleGroup(group.value)"
        >
          {{ group.label }}
        </span>
      </div>
    </div>
    <div class="form-group mb-3">
      <label>Tìm người dùng</label>
      <input
        type="text"
        class="form-control"
        v-model="searchQuery"
        placeholder="Nhập tên đăng nhập hoặc email"
        @input="searchUsers"
      />
      <ul class="list-group mt-2" v-if="suggestedUsers.length">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="user in suggestedUsers"
          :key="user.id"
        >
          <span>{{ user.tenDangNhap }} ({{ user.email }})</span>
          <button
            class="btn btn-sm"
            :class="
              selectedUserIds.includes(user.id)
                ? 'btn-secondary'
                : 'btn-outline-primary'
            "
            :disabled="selectedUserIds.includes(user.id)"
            @click="addUserFromSearch(user.id)"
          >
            {{ selectedUserIds.includes(user.id) ? "✔ Đã thêm" : "Thêm" }}
          </button>
        </li>
      </ul>
    </div>
    <div v-if="selectedUserIds.length" class="mb-3">
      <label>Người dùng đã chọn:</label>
      <ul class="list-group mt-2">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="user in selectedUsers"
          :key="user.id"
        >
          <span>{{ user.tenDangNhap }} ({{ user.email }})</span>
          <button class="btn btn-sm btn-danger" @click="removeUser(user.id)">
            Xoá
          </button>
        </li>
      </ul>
    </div>
    <button
      class="btn btn-outline-success mb-4"
      :disabled="selectedUserIds.length === 0"
      @click="submit"
    >
      Phát hành mã
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getUsersByType, issueCodesToUserGroup } from "@/services/promotion";
import Swal from "sweetalert2";

const emit = defineEmits(["done"]);

const props = defineProps({
  khuyenMaiId: Number,
  maPrefix: String,
});

const userGroups = [
  { label: "Người chưa có mã", value: "chuaCoMa" },
  { label: "Người chưa mua hàng", value: "chuaMua" },
  { label: "Người dùng mới", value: "moi" },
  { label: "Thành viên lâu năm", value: "lauNam" },
];

const selectedGroups = ref([]);
const selectedUserIds = ref([]);
const selectedUsers = ref([]);
const suggestedUsers = ref([]);
const searchQuery = ref("");

const addUser = (user) => {
  if (!selectedUserIds.value.includes(user.id)) {
    selectedUserIds.value.push(user.id);
    selectedUsers.value.push(user);
  }
};

const removeUser = (id) => {
  selectedUserIds.value = selectedUserIds.value.filter((uid) => uid !== id);
  selectedUsers.value = selectedUsers.value.filter((u) => u.id !== id);
};

const toggleGroup = async (group) => {
  if (selectedGroups.value.includes(group)) {
    selectedGroups.value = selectedGroups.value.filter((g) => g !== group);

    try {
      const res = await getUsersByType(group, props.khuyenMaiId);
      const groupUserIds = res.data.data.map((u) => u.id);

      selectedUserIds.value = selectedUserIds.value.filter(
        (id) => !groupUserIds.includes(id)
      );
      selectedUsers.value = selectedUsers.value.filter(
        (u) => !groupUserIds.includes(u.id)
      );
    } catch (err) {
      console.error("Lỗi khi xoá người dùng nhóm:", err);
    }
  } else {
    selectedGroups.value.push(group);
    await fetchUsersByGroup(group);
  }
};

const fetchUsersByGroup = async (group) => {
  try {
    const res = await getUsersByType(group, props.khuyenMaiId);
    res.data.data.forEach(addUser);
  } catch (err) {
    console.error("Lỗi khi lấy người dùng theo nhóm:", err);
  }
};

const searchUsers = async () => {
  if (!searchQuery.value.trim()) {
    suggestedUsers.value = [];
    return;
  }

  try {
    const res = await getUsersByType("tatCa", props.khuyenMaiId);
    const keyword = searchQuery.value.toLowerCase();
    suggestedUsers.value = res.data.data.filter(
      (u) =>
        u.tenDangNhap.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword)
    );
  } catch (err) {
    console.error("Lỗi khi tìm kiếm người dùng:", err);
  }
};
// thêm người dùng từ tìm kiếm vào danh sách
const addUserFromSearch = (id) => {
  const user = suggestedUsers.value.find((u) => u.id === id);
  if (user) addUser(user);
};

const submit = async () => {
  try {
    await issueCodesToUserGroup(
      selectedUserIds.value,
      props.khuyenMaiId,
      props.maPrefix
    );

    await Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Đã phát hành mã cho người dùng đã chọn.",
      timer: 2000,
      showConfirmButton: false,
    });
    emit("done");
    // Reset lại
    selectedUserIds.value = [];
    selectedUsers.value = [];
    selectedGroups.value = [];
    suggestedUsers.value = [];
    searchQuery.value = "";
  } catch (err) {
    Swal.fire("Lỗi", "Không thể phát hành mã", "error");
  }
};
</script>

<style scoped>
.badge {
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  user-select: none;
}
</style>
