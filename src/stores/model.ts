import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModelStore = defineStore('model', () => {
  // 默认使用一个可靠的CDN上的Cubism 2格式模型
  const defaultModel = 'https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json';
  
  const currentModel = ref(defaultModel);
  const availableModels = ref([defaultModel]);
  const isLoading = ref(false);
  
  // 切换模型
  function setModel(modelPath: string) {
    currentModel.value = modelPath;
  }
  
  // 加载可用模型列表
  async function loadAvailableModels() {
    try {
      isLoading.value = true;
      
      // 使用可靠的CDN模型
      availableModels.value = [
        // Cubism 2模型 (通过npm模型包CDN)
        'https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json',    // 时雨
        'https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json',      // 小春
        'https://unpkg.com/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json',      // 遥
        'https://unpkg.com/live2d-widget-model-miku@1.0.5/assets/miku.model.json',          // 初音
        'https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json',            // Z16  
        'https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json',      // 黑猫

        // 本地模型（如果存在）
        '/models/demo/model.json',
        '/models/param_ctrl_pro_en/koharu_haruto_pc_pro/koharu_pc_pro_t01.cmo3',
        '/models/param_ctrl_pro_en/koharu_haruto_pc_pro/haruto_pc_pro_t01.cmo3',
        '/models/param_ctrl_pro_en/rice_pc_pro/rice_pc_pro_t01.cmo3'
      ];
    } catch (error) {
      console.error('加载模型列表失败:', error);
    } finally {
      isLoading.value = false;
    }
  }
  
  // 初始化函数
  function init() {
    loadAvailableModels();
  }
  
  return {
    currentModel,
    availableModels,
    isLoading,
    setModel,
    loadAvailableModels,
    init
  };
}); 