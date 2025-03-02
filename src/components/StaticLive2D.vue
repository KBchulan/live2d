<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  modelPath: string
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const currentImage = ref('');
let images = [];
let currentIndex = 0;

// 根据模型名称加载静态图像
const loadImages = (modelName) => {
  // 这里使用预先准备的静态图像
  const basePath = `/images/${modelName}/`;
  
  // 假设我们有命名为1.png, 2.png等的图像
  images = [
    `${basePath}1.png`,
    `${basePath}2.png`,
    `${basePath}3.png`,
    `${basePath}4.png`,
    `${basePath}idle.png`,
  ];
  
  // 设置默认图像
  if (images.length > 0) {
    currentImage.value = images[0];
  }
};

// 随机切换图像，模拟动画
const changeImage = () => {
  if (images.length === 0) return;
  
  // 随机选择一个图像
  const newIndex = Math.floor(Math.random() * images.length);
  currentImage.value = images[newIndex];
};

// 点击时切换图像
const handleClick = () => {
  changeImage();
};

onMounted(() => {
  // 从模型路径中提取模型名称
  const modelName = props.modelPath.split('/').pop() || 'bronya';
  loadImages(modelName);
  
  // 设置定时器，定期切换图像模拟动画
  setInterval(changeImage, 5000);
});
</script>

<template>
  <div class="static-live2d-container" ref="containerRef" @click="handleClick">
    <img v-if="currentImage" :src="currentImage" alt="Live2D Character" class="character-image" />
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<style scoped>
.static-live2d-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
}

.character-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.loading {
  font-size: 18px;
  color: #555;
}
</style> 