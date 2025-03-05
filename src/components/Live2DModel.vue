<template>
  <div ref="live2dContainer" class="live2d-container"></div>
  <div v-if="loadError" class="error-message">
    {{ errorMessage }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';
import { useModelStore } from '@/stores/model';

// 初始化pixi-live2d-display
window.PIXI = PIXI;

console.log('PIXI已初始化:', PIXI.VERSION);
console.log('Live2DModel已加载:', !!Live2DModel);
console.log('Cubism 2运行时已加载:', typeof Live2D !== 'undefined');

const live2dContainer = ref(null);
const modelStore = useModelStore();
const loadError = ref(false);
const errorMessage = ref('');
let app = null;
let model = null;
let isDragging = false;
let lastMousePosition = { x: 0, y: 0 };

// 加载模型
async function loadModel() {
  try {
    loadError.value = false;
    errorMessage.value = '';
    
    // 检查Cubism运行时
    if (typeof Live2D === 'undefined') {
      console.error('Cubism 2运行时未加载');
      loadError.value = true;
      errorMessage.value = 'Cubism 2运行时未加载，请刷新页面或检查网络连接';
      addPlaceholderGraphic();
      return;
    }
    
    const modelPath = modelStore.currentModel;
    if (!modelPath) {
      console.error('未找到模型路径');
      loadError.value = true;
      errorMessage.value = '未找到模型路径';
      addPlaceholderGraphic();
      return;
    }
    
    console.log('尝试加载模型:', modelPath);
    
    // 检查模型文件是否存在
    try {
      const response = await fetch(modelPath);
      if (!response.ok) {
        console.error('模型文件不存在:', modelPath, response.status);
        loadError.value = true;
        errorMessage.value = `模型文件不存在(${response.status}): ${modelPath}`;
        addPlaceholderGraphic();
        return;
      }
    } catch (error) {
      console.error('模型文件访问失败:', error);
      loadError.value = true;
      errorMessage.value = `模型文件访问失败: ${error.message}`;
      addPlaceholderGraphic();
      return;
    }
    
    // 检查模型格式
    if (modelPath.endsWith('.cmo3')) {
      // 显示cmo3格式不支持的提示
      loadError.value = true;
      errorMessage.value = '当前应用不支持直接加载.cmo3格式的模型文件，请使用.model3.json格式的模型';
      console.error('不支持的模型格式: .cmo3');
      
      // 添加一个简单的占位图形代替模型
      addPlaceholderGraphic();
      return;
    }
    
    // 加载模型
    console.log('开始加载模型...');
    try {
      // 设置跨域选项
      const options = { 
        crossOrigin: 'anonymous',
        onError: (e) => console.error('模型加载错误:', e) 
      };
      
      model = await Live2DModel.from(modelPath, options);
      console.log('模型加载成功:', model);
    } catch (loadError) {
      console.error('模型加载失败:', loadError);
      loadError.value = true;
      errorMessage.value = `模型加载失败: ${loadError.message}`;
      addPlaceholderGraphic();
      return;
    }
    
    // 调整模型大小和位置
    const scale = 0.2;
    model.scale.set(scale, scale);
    model.anchor.set(0.5, 0.5);
    model.position.set(app.renderer.width / 2, app.renderer.height / 2);
    
    app.stage.addChild(model);
    
    // 添加拖动功能
    enableDrag();
    
    // 添加互动功能
    enableInteraction();
  } catch (error) {
    console.error('加载模型失败:', error);
    loadError.value = true;
    errorMessage.value = '模型加载失败: ' + error.message;
    
    // 添加一个简单的占位图形代替模型
    addPlaceholderGraphic();
  }
}

// 添加一个占位图形代替模型
function addPlaceholderGraphic() {
  // 创建一个替代的图形
  const graphics = new PIXI.Graphics();
  graphics.beginFill(0xFF3300, 0.5);
  graphics.lineStyle(2, 0xFFFFFF, 1);
  graphics.drawRect(0, 0, 100, 150);
  graphics.endFill();
  
  // 添加一个文本说明
  const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 12,
    fill: '#ffffff',
    wordWrap: true,
    wordWrapWidth: 90
  });
  const text = new PIXI.Text('模型加载失败\n请检查模型格式', style);
  text.position.set(5, 60);
  
  // 创建一个容器包含图形和文本
  const container = new PIXI.Container();
  container.addChild(graphics);
  container.addChild(text);
  
  // 设置位置
  container.position.set(app.renderer.width / 2 - 50, app.renderer.height / 2 - 75);
  container.interactive = true;
  container.buttonMode = true;
  
  // 添加拖动功能给占位图形
  container.on('pointerdown', onDragStart);
  
  app.stage.addChild(container);
  
  // 使用这个容器作为模型的替代品
  model = container;
}

// 初始化PIXI应用
function initPixiApp() {
  if (app) {
    app.destroy(true);
  }
  
  app = new PIXI.Application({
    width: 300,
    height: 400,
    transparent: true,
    autoStart: true,
    antialias: true
  });
  
  live2dContainer.value.appendChild(app.view);
}

// 启用拖动功能
function enableDrag() {
  model.buttonMode = true;
  model.interactive = true;
  
  model.on('pointerdown', onDragStart);
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragEnd);
}

function onDragStart(event) {
  isDragging = true;
  lastMousePosition.x = event.data.global.x;
  lastMousePosition.y = event.data.global.y;
}

function onDragMove(event) {
  if (!isDragging) return;
  
  const dx = event.clientX - lastMousePosition.x;
  const dy = event.clientY - lastMousePosition.y;
  
  if (window.electronAPI) {
    window.electronAPI.dragWindow(dx, dy);
  }
  
  lastMousePosition.x = event.clientX;
  lastMousePosition.y = event.clientY;
}

function onDragEnd() {
  isDragging = false;
}

// 启用互动功能
function enableInteraction() {
  model.on('pointertap', () => {
    try {
      // 检查是否为真正的Live2D模型
      if (model.internalModel && model.internalModel.motionManager) {
        // 尝试播放表情
        if (model.internalModel.motionManager.definitions.expressions && 
            model.internalModel.motionManager.definitions.expressions.length > 0) {
          const randomExpressionIndex = Math.floor(Math.random() * model.internalModel.motionManager.definitions.expressions.length);
          model.expression(model.internalModel.motionManager.definitions.expressions[randomExpressionIndex].name);
        }
        
        // 尝试播放动作
        if (model.internalModel.motionManager.definitions.motions) {
          const groups = Object.keys(model.internalModel.motionManager.definitions.motions);
          if (groups.length > 0) {
            const randomGroup = groups[Math.floor(Math.random() * groups.length)];
            const randomMotionIndex = Math.floor(Math.random() * model.internalModel.motionManager.definitions.motions[randomGroup].length);
            model.motion(randomGroup, randomMotionIndex);
          }
        }
      } else {
        // 如果不是Live2D模型，做一个简单的动画效果
        model.scale.set(model.scale.x * 1.1, model.scale.y * 1.1);
        setTimeout(() => {
          model.scale.set(model.scale.x / 1.1, model.scale.y / 1.1);
        }, 100);
      }
    } catch (e) {
      console.warn('互动功能触发错误:', e);
      // 简单的位置变化作为互动反馈
      model.scale.set(model.scale.x * 1.1, model.scale.y * 1.1);
      setTimeout(() => {
        model.scale.set(model.scale.x / 1.1, model.scale.y / 1.1);
      }, 100);
    }
  });
}

// 清理
function cleanup() {
  if (model) {
    window.removeEventListener('pointermove', onDragMove);
    window.removeEventListener('pointerup', onDragEnd);
    model.removeAllListeners();
  }
  
  if (app) {
    app.destroy(true);
    app = null;
  }
}

onMounted(() => {
  initPixiApp();
  loadModel();
});

onUnmounted(() => {
  cleanup();
});

// 暴露重新加载模型方法
defineExpose({
  reloadModel: () => {
    cleanup();
    initPixiApp();
    loadModel();
  }
});
</script>

<style scoped>
.live2d-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.error-message {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  max-width: 80%;
  text-align: center;
}
</style> 