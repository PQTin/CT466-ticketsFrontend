<template>
  <div class="overlay" v-if="visible" @click.stop="close">
    <div class="overlay-content" @click="handleClick">
      <img :src="promotionImage" alt="Khuyến mãi" class="promo-image" />
      <p class="promo-description">{{ promotionText }}</p>
      <button class="close-btn" @click.stop="close">✖</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAllPromotions } from "@/services/promotion";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";

const visible = ref(true);
const promotionImage = ref("");
const promotionText = ref("");
const isRegisterPromo = ref(false);

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const res = await getAllPromotions();
  if (!res.data.success || !res.data.data.length) return;

  const promotions = res.data.data;
  const isLoggedIn = authStore.isLoggedIn;

  if (!isLoggedIn) {
    const promo = promotions.find((p) => p.id === 15);
    if (promo) {
      isRegisterPromo.value = true;
      promotionImage.value = formatImageUrl(promo.duongDanAnh);
      promotionText.value = promo.moTa;
    }
  } else {
    const filtered = promotions.filter((p) => p.id !== 15);
    const randomPromo = filtered[Math.floor(Math.random() * filtered.length)];
    if (randomPromo) {
      promotionImage.value = formatImageUrl(randomPromo.duongDanAnh);
      promotionText.value = randomPromo.moTa;
    }
  }
});

const formatImageUrl = (path) => {
  return `http://localhost:3000/uploads/${path}`;
};

const close = () => {
  visible.value = false;
};

const handleClick = () => {
  if (isRegisterPromo.value) {
    router.push("/register");
  } else {
    router.push("/promotion");
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.overlay-content {
  position: relative;
  background: #1c1c1c;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  text-align: center;
  color: #fff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  cursor: auto;
}

.promo-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}

.promo-description {
  margin-top: 16px;
  font-size: 16px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
