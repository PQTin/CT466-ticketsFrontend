<template>
  <div class="comments-wrapper card bg-white text-dark p-4 rounded-3 shadow-sm">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold mb-0">Đánh giá tổng</h5>
      <div class="text-warning">
        <span class="star filled">★</span>
        <strong>{{ avgScore.toFixed(1) }}</strong> / 5
        <span class="text-secondary ms-2">({{ totalRatings }} đánh giá)</span>
      </div>
    </div>

    <!-- Gửi đánh giá -->
    <div class="comment-form mb-4">
      <h6 class="fw-bold">Gửi đánh giá của bạn</h6>
      <div class="d-flex align-items-center mb-2">
        <span
          v-for="i in 5"
          :key="i"
          class="star"
          :class="{ filled: i <= newRating }"
          @click="newRating = i"
          >★</span
        >
      </div>
      <textarea
        v-model="newComment"
        class="form-control mb-2"
        rows="1"
        placeholder="Viết đánh giá..."
      ></textarea>
      <button class="btn btn-outline-primary btn-sm" @click="submitComment">
        Gửi
      </button>
    </div>

    <!-- Danh sách bình luận -->
    <div v-if="comments.length" class="comment-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="mb-4 border-bottom pb-3"
      >
        <!-- Bình luận chính -->
        <div class="d-flex">
          <img
            :src="getAvatarUrl(comment.NguoiDung.duongDanAvatar)"
            class="avatar me-3"
            alt="avatar"
          />
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center">
              <strong>{{ comment.NguoiDung.tenDangNhap }}</strong>
              <small class="text-muted">{{ formatDate(comment.taoLuc) }}</small>
            </div>

            <div class="text-warning mb-1" v-if="comment.diem">
              <span
                v-for="i in 5"
                :key="i"
                class="star"
                :class="{ filled: i <= comment.diem }"
                >★</span
              >
              <span class="ms-1">({{ comment.diem }}/5)</span>
            </div>

            <p class="mb-1">{{ comment.binhLuan }}</p>

            <!-- Nút phản hồi -->
            <div class="d-flex align-items-center gap-3 mt-2">
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="toggleReply(comment.id)"
              >
                {{ replyVisible[comment.id] ? "Ẩn" : "Phản hồi" }}
              </button>

              <span
                v-if="comment.phanHoi?.length"
                class="text-primary"
                style="cursor: pointer"
                @click="toggleReplies(comment.id)"
              >
                {{
                  showReplies[comment.id]
                    ? "Ẩn chi tiết"
                    : `Chi tiết (${comment.phanHoi.length})`
                }}
              </span>
            </div>

            <!-- Form phản hồi -->
            <div v-if="replyVisible[comment.id]" class="mt-2">
              <textarea
                v-model="replyContent[comment.id]"
                class="form-control mb-2"
                rows="1"
                placeholder="Viết phản hồi..."
              ></textarea>
              <button
                class="btn btn-outline-success btn-sm"
                @click="submitReply(comment.id)"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>

        <!-- Phản hồi -->
        <div
          v-if="showReplies[comment.id]"
          v-for="reply in comment.phanHoi"
          :key="reply.id"
          class="d-flex mt-3 ms-5"
        >
          <img
            :src="getAvatarUrl(reply.NguoiDung.duongDanAvatar)"
            class="avatar me-3"
            alt="avatar"
          />
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between">
              <strong>{{ reply.NguoiDung.tenDangNhap }}</strong>
              <small class="text-muted">{{ formatDate(reply.taoLuc) }}</small>
            </div>
            <p class="mb-1">{{ reply.binhLuan }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-muted">Chưa có bình luận nào...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { getCommentsByMovieId, rateMovie } from "@/services/movie";
import { useAuthStore } from "@/store/authStore";

const props = defineProps({
  movieId: { type: Number, required: true },
});

const comments = ref([]);
const newComment = ref("");
const newRating = ref(0);

const replyVisible = ref({});
const replyContent = ref({});
const showReplies = ref({});

const avgScore = ref(0);
const totalRatings = ref(0);

const router = useRouter();
const auth = useAuthStore();

const getAvatarUrl = (path) =>
  `http://localhost:3000/uploads/${path || "avatars/default.png"}`;

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN");
};

const loadComments = async () => {
  try {
    const res = await getCommentsByMovieId(props.movieId);
    comments.value = res.data.data;
    avgScore.value = res.data.avgScore || 0;
    totalRatings.value = res.data.totalRatings || 0;
  } catch (err) {
    console.error("Lỗi khi tải bình luận:", err);
  }
};

const ensureLogin = async () => {
  if (!auth.isLoggedIn) {
    const result = await Swal.fire({
      title: "Bạn chưa đăng nhập",
      text: "Vui lòng đăng nhập để bình luận hoặc phản hồi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng nhập",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      router.push("/login");
    } else {
      return false;
    }
    return false;
  }
  return true;
};

const submitComment = async () => {
  if (!newComment.value || newRating.value === 0) {
    await Swal.fire({
      icon: "warning",
      title: "Thiếu thông tin",
      text: "Vui lòng nhập nội dung và chọn điểm đánh giá.",
    });
    return;
  }

  const ok = await ensureLogin();
  if (!ok) return;

  try {
    await rateMovie({
      phimId: props.movieId,
      diem: newRating.value,
      binhLuan: newComment.value,
    });
    newComment.value = "";
    newRating.value = 0;
    await loadComments();
    await Swal.fire({
      icon: "success",
      title: "Đã gửi phản hồi!",
      text: "Cảm ơn bạn đã đánh giá phim.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Lỗi khi gửi bình luận:", err);
    await Swal.fire({
      icon: "error",
      title: "Gửi bình luận thất bại",
      text: "Đã xảy ra lỗi khi gửi bình luận. Vui lòng thử lại.",
    });
  }
};

const submitReply = async (parentId) => {
  const content = replyContent.value[parentId];
  if (!content) {
    await Swal.fire({
      icon: "warning",
      title: "Thiếu nội dung",
      text: "Vui lòng nhập nội dung phản hồi.",
    });
    return;
  }

  const ok = await ensureLogin();
  if (!ok) return;

  try {
    await rateMovie({
      binhLuanChaId: parentId,
      binhLuan: content,
    });
    replyContent.value[parentId] = "";
    replyVisible.value[parentId] = false;
    await loadComments();
    await Swal.fire({
      icon: "success",
      title: "Đã gửi phản hồi!",
      text: "Cảm ơn bạn đã phản hồi về bình luận này.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Lỗi khi gửi phản hồi:", err);
    await Swal.fire({
      icon: "error",
      title: "Gửi phản hồi thất bại",
      text: "Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại.",
    });
  }
};
const toggleReplies = (id) => {
  showReplies.value[id] = !showReplies.value[id];
};

const toggleReply = (id) => {
  replyVisible.value[id] = !replyVisible.value[id];
};

onMounted(loadComments);
</script>

<style scoped>
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-list {
  max-height: 300px;
  min-height: 300px;
  overflow-y: auto;
}

.star {
  font-size: 1.4rem;
  cursor: pointer;
  color: #bbb;
}

.star.filled {
  color: #ffc107;
}
</style>
