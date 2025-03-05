<template>
  <div class="chat-panel" :class="{ 'is-open': isOpen }">
    <div class="panel-header">
      <h3>聊天</h3>
      <button @click="close" class="close-btn">×</button>
    </div>
    
    <div class="messages-container" ref="messagesContainer">
      <div v-if="chatStore.messages.length === 0" class="no-messages">
        与Live2D模型开始对话吧！
      </div>
      
      <div 
        v-for="(message, index) in chatStore.messages" 
        :key="index" 
        class="message"
        :class="message.role"
      >
        <div class="message-content">{{ message.content }}</div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>
      
      <div v-if="chatStore.isLoading" class="message assistant loading">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    
    <div class="input-container">
      <textarea 
        v-model="userInput" 
        @keydown.enter.prevent="sendMessage"
        placeholder="输入消息..." 
        :disabled="chatStore.isLoading || !chatStore.apiKey"
      ></textarea>
      <button 
        @click="sendMessage" 
        class="send-btn"
        :disabled="chatStore.isLoading || !userInput.trim() || !chatStore.apiKey"
      >
        发送
      </button>
    </div>
    
    <div class="api-status" v-if="!chatStore.apiKey">
      请先在设置面板中配置 DeepSeek API 密钥
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useChatStore } from '@/stores/chat';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
const chatStore = useChatStore();
const userInput = ref('');
const messagesContainer = ref(null);

// 关闭面板
function close() {
  emit('close');
}

// 发送消息
async function sendMessage() {
  if (!userInput.value.trim() || chatStore.isLoading || !chatStore.apiKey) return;
  
  const message = userInput.value;
  userInput.value = '';
  
  await chatStore.sendMessage(message);
  scrollToBottom();
}

// 格式化时间
function formatTime(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

// 监听消息变化，自动滚动到底部
watch(() => chatStore.messages.length, () => {
  scrollToBottom();
});

onMounted(() => {
  scrollToBottom();
  chatStore.init();
});
</script>

<style scoped>
.chat-panel {
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
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.chat-panel.is-open {
  right: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
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

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.no-messages {
  text-align: center;
  color: #999;
  margin-top: 20px;
  font-style: italic;
}

.message {
  margin-bottom: 15px;
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 12px;
  position: relative;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  align-self: flex-end;
  background-color: #4CAF50;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant {
  align-self: flex-start;
  background-color: #f1f1f1;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-content {
  word-break: break-word;
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  opacity: 0.8;
  margin-top: 5px;
  text-align: right;
}

.input-container {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  display: flex;
}

textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 18px;
  padding: 8px 12px;
  resize: none;
  height: 40px;
  font-size: 14px;
  line-height: 1.4;
}

.send-btn {
  width: 60px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 18px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
}

.send-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.api-status {
  background-color: #fff3cd;
  color: #856404;
  padding: 8px 15px;
  font-size: 12px;
  text-align: center;
}

.typing-indicator {
  display: flex;
  padding: 5px;
  justify-content: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: #999;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.2s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
</style> 