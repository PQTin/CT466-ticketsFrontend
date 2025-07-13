<template>
  <div class="d-flex" style="height: calc(100vh - 100px); overflow: hidden">
    <!-- Sidebar Danh sách vé -->
    <div style="width: 360px; display: flex; flex-direction: column">
      <div class="p-3 pt-0">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Tìm theo: phim, phòng, CN, ND, ngày, ghế"
        />
      </div>
      <div style="flex: 1; overflow-y: auto" class="p-3 sidebar-scroll">
        <div
          v-if="filteredTickets.length === 0"
          class="text-center text-muted py-4"
        >
          Không tìm thấy vé phù hợp.
        </div>

        <div v-else class="d-flex flex-column gap-3">
          <div
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            class="card shadow-sm border-0 ticket-card"
            :class="{ active: selectedTicket?.id === ticket.id }"
            @click="selectTicket(ticket)"
          >
            <div class="card-body">
              <h6 class="mb-1">{{ ticket.LichChieu?.Phim?.ten }}</h6>
              <div class="small text-muted">
                {{ ticket.LichChieu?.PhongChieu?.ChiNhanh?.ten }} |
                {{ ticket.LichChieu?.PhongChieu?.ten }} | Ghế
                {{ ticket.Ghe?.hang }}{{ ticket.Ghe?.cot }}
              </div>
              <div class="small text-muted">
                {{ formatTime(ticket.LichChieu?.batDau) }}
              </div>
              <div class="small mt-1">
                {{ ticket.NguoiDung?.tenDangNhap }}
              </div>
              <div class="mt-1">
                <span class="badge" :class="statusColor(ticket.trangThai)">
                  {{ ticket.trangThai }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chi tiết vé -->
    <Transition name="fade-expand" mode="out-in">
      <TicketDetail
        v-if="selectedTicket"
        :selectedTicket="selectedTicket"
        :formatTime="formatTime"
        :statusColor="statusColor"
        @updated="fetchTickets"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import TicketDetail from "./ticketDetail.vue";
import { getMyTickets } from "@/services/ticket";

const tickets = ref([]);
const selectedTicket = ref(null);
const searchQuery = ref("");

const fetchTickets = async (selectedId = null) => {
  try {
    const res = await getMyTickets();
    tickets.value = res.data.data;

    if (selectedId) {
      selectedTicket.value = tickets.value.find((t) => t.id === selectedId);
    } else if (tickets.value.length > 0) {
      selectedTicket.value = tickets.value[0];
    }
  } catch (err) {
    console.error("Lỗi khi lấy danh sách vé", err);
  }
};

const selectTicket = (ticket) => {
  selectedTicket.value = ticket;
};

const filteredTickets = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return tickets.value;

  const keywords = q
    .split(/[,;|]+/)
    .map((k) => k.trim())
    .filter(Boolean);

  return tickets.value.filter((ticket) => {
    const combined = [
      ticket.LichChieu?.Phim?.ten,
      ticket.LichChieu?.PhongChieu?.ten,
      ticket.LichChieu?.PhongChieu?.ChiNhanh?.ten,
      ticket.Ghe?.hang + ticket.Ghe?.cot,
      ticket.NguoiDung?.tenDangNhap,
      new Date(ticket.LichChieu?.batDau).toLocaleDateString("vi-VN"),
    ]
      .join(" ")
      .toLowerCase();

    return keywords.every((kw) => combined.includes(kw));
  });
});

const formatTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const statusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-secondary";
    case "unused":
      return "bg-success";
    case "used":
      return "bg-warning text-dark";
    case "refunded":
    case "cancelled":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

onMounted(fetchTickets);
</script>

<style scoped>
.d-flex {
  background-color: #1e1e1e;
  color: #f1f1f1;
}

.sidebar-scroll {
  background-color: #1e1e1e;
}
.sidebar-scroll::-webkit-scrollbar {
  display: none;
}

input.form-control {
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #444;
}
input.form-control::placeholder {
  color: #aaa;
}

.ticket-card {
  background-color: #2c2c2c;
  color: #f1f1f1;
  border-radius: 12px;
  transition:
    box-shadow 0.3s ease,
    transform 0.2s;
}
.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.08);
}
.ticket-card.active {
  outline: 2px solid #0d6efd;
  background-color: #343a40;
}

.badge {
  padding: 4px 8px;
  font-size: 0.75rem;
  border-radius: 0.375rem;
}
.bg-secondary {
  background-color: #6c757d !important;
  color: #fff;
}
.bg-success {
  background-color: #198754 !important;
  color: #fff;
}
.bg-warning {
  background-color: #ffc107 !important;
  color: #000;
}
.bg-danger {
  background-color: #dc3545 !important;
  color: #fff;
}

.text-muted {
  color: #bbb !important;
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
</style>
