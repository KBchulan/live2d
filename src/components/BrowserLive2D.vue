<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  modelPath: string
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const iframeLoaded = ref(false);

onMounted(() => {
  // 创建一个iframe，加载一个非常简单的HTML文件
  const iframe = document.createElement('iframe');
  iframe.src = '/simple.html';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.backgroundColor = 'transparent';
  
  iframe.onload = () => {
    iframeLoaded.value = true;
  };
  
  if (containerRef.value) {
    containerRef.value.appendChild(iframe);
  }
});
</script>

<template>
  <div class="browser-live2d" ref="containerRef">
    <div v-if="!iframeLoaded" class="loading">加载中...</div>
  </div>
</template>

<style scoped>
.browser-live2d {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #555;
}
</style> 