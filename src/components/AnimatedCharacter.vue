<script setup lang="ts">
import { ref } from 'vue';

const isWaving = ref(false);
const isTalking = ref(false);
const isBlinking = ref(false);

// 简单随机动画
setInterval(() => {
  // 随机眨眼
  if (Math.random() > 0.7) {
    isBlinking.value = true;
    setTimeout(() => isBlinking.value = false, 200);
  }
  
  // 随机说话
  if (Math.random() > 0.9) {
    isTalking.value = true;
    setTimeout(() => isTalking.value = false, 1500);
  }
}, 2000);

const handleClick = () => {
  isWaving.value = true;
  setTimeout(() => isWaving.value = false, 1000);
};
</script>

<template>
  <div class="character-container" @click="handleClick">
    <img src="/images/bronya/base.png" alt="Bronya" class="character-base" />
    <img src="/images/bronya/eyes.png" alt="Eyes" 
         class="character-eyes" :class="{ 'blink': isBlinking }" />
    <img src="/images/bronya/mouth.png" alt="Mouth" 
         class="character-mouth" :class="{ 'talk': isTalking }" />
    <img src="/images/bronya/arm.png" alt="Arm" 
         class="character-arm" :class="{ 'wave': isWaving }" />
  </div>
</template>

<style scoped>
.character-container {
  position: relative;
  width: 400px;
  height: 600px;
}

.character-base, .character-eyes, .character-mouth, .character-arm {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.blink {
  animation: blink-animation 0.2s;
}

.talk {
  animation: talk-animation 0.3s infinite;
}

.wave {
  animation: wave-animation 1s;
}

@keyframes blink-animation {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes talk-animation {
  0% { transform: scaleY(1); }
  50% { transform: scaleY(0.8); }
  100% { transform: scaleY(1); }
}

@keyframes wave-animation {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-10deg); }
  100% { transform: rotate(0deg); }
}
</style> 