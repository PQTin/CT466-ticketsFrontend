<template>
  <div class="trailer-modal" :class="{ show: show }" @click.self="close">
    <div class="modal-box">
      <div class="modal-header">
        <h5 class="modal-title">Trailer: {{ ten }}</h5>
        <button type="button" class="btn btn-outline-danger" @click="close">
          X
        </button>
      </div>

      <div class="modal-body">
        <div class="video-wrapper">
          <iframe
            v-if="embedUrl"
            :src="embedUrl"
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    url: String,
    ten: String,
  },
  emits: ["close"],
  computed: {
    embedUrl() {
      if (!this.url) return "";
      const videoId = this.url.includes("youtu.be/")
        ? this.url.split("youtu.be/")[1].split("?")[0]
        : this.url.split("v=")[1]?.split("&")[0];
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : "";
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.trailer-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: none;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
.trailer-modal.show {
  display: flex;
  animation: fadeIn 0.3s ease forwards;
}

.modal-box {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.1rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #888;
}
.btn-close:hover {
  color: red;
}

.modal-body {
  padding: 0;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}
.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 0 0 12px 12px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
