import axios from 'axios';

// 你可以替换为其他AI服务API
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = ''; // 添加你的API密钥

export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个可爱友好的助手，请简短回答.' },
          { role: 'user', content: message }
        ],
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI服务错误:', error);
    return '抱歉，我遇到了一些问题，无法回应你的消息。';
  }
} 