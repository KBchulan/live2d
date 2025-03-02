<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StaticLive2D from './components/StaticLive2D.vue'
import ChatInterface from './components/ChatInterface.vue'

const modelPath = ref('')
const showChat = ref(false)
const showSettings = ref(false)

// 选择模型文件
async function selectModel() {
  const path = await window.ipcRenderer.selectModel()
  if (path) {
    modelPath.value = path
  }
}

// 处理AI回复
function handleAiResponse(response: string) {
  // 这里可以根据AI回复触发Live2D模型做出相应动作
  console.log('AI回复:', response)
}

// 切换聊天界面
function toggleChat() {
  showChat.value = !showChat.value
}

// 切换设置界面
function toggleSettings() {
  showSettings.value = !showSettings.value
}

// 加载默认模型
function loadDefaultModel() {
  // 修改为您实际的模型路径
  // 可以是以下格式之一:
  // 1. 完整路径: 'your_model_folder/your_model.model3.json'
  // 2. 仅文件夹名: 'your_model_folder'
  modelPath.value = 'bronya'; // 替换为你的模型文件夹名称
}

onMounted(() => {
  // 检查是否有保存的模型路径
  const savedModelPath = localStorage.getItem('modelPath')
  if (savedModelPath) {
    modelPath.value = savedModelPath
  } else {
    // 如果没有保存的模型路径，加载默认模型
    loadDefaultModel()
  }
})
</script>

<template>
  <div class="app-container">
    <!-- 使用静态Live2D组件 -->
    <StaticLive2D v-if="modelPath" :modelPath="modelPath" />

    <!-- 未选择模型时显示 -->
    <div v-else class="no-model">
      <button @click="selectModel">选择Live2D模型</button>
    </div>

    <!-- 控制按钮 -->
    <div class="control-buttons">
      <button @click="toggleChat" class="control-btn">
        {{ showChat ? '隐藏聊天' : '显示聊天' }}
      </button>
      <button @click="toggleSettings" class="control-btn">
        {{ showSettings ? '隐藏设置' : '设置' }}
      </button>
      <button @click="selectModel" class="control-btn">更换模型</button>
    </div>

    <!-- 聊天界面 -->
    <ChatInterface v-if="showChat" @ai-response="handleAiResponse" />

    <!-- 设置面板 -->
    <div v-if="showSettings" class="settings-panel">
      <h3>设置</h3>
      <div class="setting-item">
        <label>透明度</label>
        <input type="range" min="0" max="1" step="0.1" value="1" />
      </div>
      <div class="setting-item">
        <label>大小</label>
        <input type="range" min="0.5" max="1.5" step="0.1" value="1" />
      </div>
      <div class="setting-item">
        <button @click="toggleSettings">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
  width: 400px;
  height: 600px;
  overflow: hidden;
}

.no-model {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
}

.control-buttons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
}

.settings-panel {
  position: absolute;
  top: 50px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  width: 200px;
}

.setting-item {
  margin-bottom: 10px;
}

.setting-item label {
  display: block;
  margin-bottom: 5px;
}

.setting-item input {
  width: 100%;
}
</style>
