<template>
  <div class="settings-panel" :class="{ 'is-open': isOpen }">
    <div class="panel-header">
      <h3>设置</h3>
      <button @click="close" class="close-btn">×</button>
    </div>
    
    <div class="panel-content">
      <div class="section">
        <h4>模型选择</h4>
        <div class="select-container">
          <select v-model="selectedModel" @change="changeModel" :disabled="modelStore.isLoading">
            <option v-for="model in modelStore.availableModels" :key="model" :value="model">
              {{ getModelName(model) }}
            </option>
          </select>
          <span v-if="modelStore.isLoading" class="loading-indicator">加载中...</span>
        </div>
        <div class="model-warning">
          <p>注意: 当前应用只支持model3.json格式的模型文件。</p>
          <p>您当前选择的是.cmo3格式，这需要特殊处理才能显示。</p>
          <p>
            <a href="#" @click.prevent="openModelGuide">如何获取兼容的Live2D模型</a>
          </p>
        </div>
      </div>
      
      <div class="section">
        <h4>DeepSeek API</h4>
        <div class="input-group">
          <label for="apiKey">API 密钥</label>
          <input 
            id="apiKey" 
            type="password" 
            v-model="apiKeyInput" 
            placeholder="输入DeepSeek API密钥"
          />
          <button @click="saveApiKey" class="save-btn">保存</button>
        </div>
        <p class="api-status">
          状态: {{ chatStore.apiKey ? '已配置' : '未配置' }}
        </p>
      </div>
      
      <div class="section">
        <h4>窗口设置</h4>
        <div class="checkbox-group">
          <label>
            <input type="checkbox" v-model="alwaysOnTop" @change="toggleAlwaysOnTop" />
            始终置顶
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useModelStore } from '@/stores/model';
import { useChatStore } from '@/stores/chat';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'modelChanged']);

const modelStore = useModelStore();
const chatStore = useChatStore();
const selectedModel = ref('');
const apiKeyInput = ref('');
const alwaysOnTop = ref(false);

// 关闭面板
function close() {
  emit('close');
}

// 更改模型
function changeModel() {
  modelStore.setModel(selectedModel.value);
  emit('modelChanged', selectedModel.value);
}

// 保存API密钥
function saveApiKey() {
  if (apiKeyInput.value.trim()) {
    chatStore.setApiKey(apiKeyInput.value);
    apiKeyInput.value = '';
    alert('API密钥已保存');
  }
}

// 获取模型名称（从路径中提取）
function getModelName(path) {
  const parts = path.split('/');
  const filename = parts[parts.length - 1] || path;
  
  // 检查是否是不支持的格式
  if (filename.endsWith('.cmo3')) {
    return `${parts[parts.length - 2] || filename} (不支持的格式)`;
  }
  
  return parts[parts.length - 2] || filename;
}

// 打开模型指南
function openModelGuide() {
  alert(`获取兼容的Live2D模型指南:

1. 访问 https://github.com/guansss/pixi-live2d-display/tree/master/samples/models
2. 下载该仓库中的示例模型
3. 将模型文件解压到公共目录(public/models/)下
4. 确保使用的是.model3.json或.model.json格式的模型

注意: 当前应用使用的pixi-live2d-display库不直接支持.cmo3/.can3格式的文件，需要先转换为.model3.json格式`);
}

// 切换窗口置顶
function toggleAlwaysOnTop() {
  // 如果是Electron环境，使用ipcRenderer设置窗口
  if (window.electronAPI) {
    // 这里需要在preload.js中添加相应的API，目前暂不实现
    // window.electronAPI.setAlwaysOnTop(alwaysOnTop.value);
  }
}

onMounted(() => {
  selectedModel.value = modelStore.currentModel;
  if (chatStore.apiKey) {
    apiKeyInput.value = '******'; // 不显示实际的API密钥
  }
});
</script>

<style scoped>
.settings-panel {
  position: absolute;
  right: -300px;
  top: 0;
  width: 280px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-left: 1px solid #eee;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  overflow-y: auto;
  z-index: 1000;
  padding: 15px;
  box-sizing: border-box;
}

.settings-panel.is-open {
  right: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #666;
}

.section {
  margin-bottom: 20px;
}

.section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #444;
}

.select-container {
  position: relative;
}

select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 14px;
}

.input-group {
  margin-bottom: 10px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
}

input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 8px;
  font-size: 14px;
}

.save-btn {
  display: block;
  padding: 5px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.api-status {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.checkbox-group {
  margin-top: 10px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  cursor: pointer;
}

.checkbox-group input {
  margin-right: 8px;
}

.loading-indicator {
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}

.model-warning {
  margin-top: 10px;
  padding: 8px;
  background-color: #fff3cd;
  border-radius: 4px;
  font-size: 12px;
  color: #856404;
}

.model-warning p {
  margin: 4px 0;
}

.model-warning a {
  color: #0056b3;
  text-decoration: underline;
  cursor: pointer;
}
</style> 