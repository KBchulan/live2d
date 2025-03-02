<script setup lang="ts">
import { ref } from 'vue';
import { sendMessage } from '../services/aiService';

const message = ref('');
const chatHistory = ref<Array<{role: 'user' | 'ai', content: string}>>([]);
const isLoading = ref(false);

const emit = defineEmits(['aiResponse']);

async function handleSendMessage() {
  if (!message.value.trim()) return;
  
  // 添加用户消息到历史
  chatHistory.value.push({
    role: 'user',
    content: message.value
  });
  
  const userMessage = message.value;
  message.value = '';
  isLoading.value = true;
  
  try {
    // 获取AI回复
    const response = await sendMessage(userMessage);
    
    // 添加AI回复到历史
    chatHistory.value.push({
      role: 'ai',
      content: response
    });
    
    // 触发事件以便Live2D模型做出反应
    emit('aiResponse', response);
  } catch (error) {
    console.error('获取AI回复失败:', error);
    chatHistory.value.push({
      role: 'ai',
      content: '抱歉，我现在无法回复你的消息。'
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-history">
      <div v-for="(chat, index) in chatHistory" :key="index" 
           :class="['chat-message', chat.role === 'user' ? 'user-message' : 'ai-message']">
        {{ chat.content }}
      </div>
    </div>
    
    <div class="chat-input">
      <input 
        v-model="message" 
        @keyup.enter="handleSendMessage"
        placeholder="和我聊天吧..."
        :disabled="isLoading"
      />
      <button @click="handleSendMessage" :disabled="isLoading">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  width: 300px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-history {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
}

.chat-message {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 80%;
  word-break: break-word;
}

.user-message {
  background: #dcf8c6;
  align-self: flex-end;
  margin-left: auto;
}

.ai-message {
  background: #ffffff;
  align-self: flex-start;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
}

.chat-input input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 8px;
}

.chat-input button {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  cursor: pointer;
}

.chat-input button:disabled {
  background: #cccccc;
}
</style> 