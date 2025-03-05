import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<Message[]>([]);
  const isLoading = ref(false);
  const apiKey = ref('sk-cc80f4005bd342f58e984f58db915af6'); // 用户需要提供DeepSeek API密钥
  
  // 发送消息到DeepSeek API
  async function sendMessage(content: string) {
    if (!content.trim()) return;
    
    // 添加用户消息
    messages.value.push({
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    });
    
    // 如果没有API密钥，返回预设回复
    if (!apiKey.value) {
      messages.value.push({
        role: 'assistant',
        content: '请先设置DeepSeek API密钥，才能使用AI对话功能。',
        timestamp: new Date().toISOString()
      });
      return;
    }
    
    try {
      isLoading.value = true;
      
      // 发送请求到DeepSeek API
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: messages.value.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.value}`
          }
        }
      );
      
      // 添加AI回复
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const aiResponse = response.data.choices[0].message;
        messages.value.push({
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加错误消息
      messages.value.push({
        role: 'assistant',
        content: '对话请求失败，请检查网络连接和API密钥。',
        timestamp: new Date().toISOString()
      });
    } finally {
      isLoading.value = false;
    }
  }
  
  // 设置API密钥
  function setApiKey(key: string) {
    apiKey.value = key;
    // 可以选择将密钥保存到本地存储
    localStorage.setItem('deepseek_api_key', key);
  }
  
  // 清空对话
  function clearMessages() {
    messages.value = [];
  }
  
  // 初始化 - 从本地存储加载API密钥
  function init() {
    const savedKey = localStorage.getItem('deepseek_api_key');
    if (savedKey) {
      apiKey.value = savedKey;
    }
  }
  
  return {
    messages,
    isLoading,
    apiKey,
    sendMessage,
    setApiKey,
    clearMessages,
    init
  };
}); 