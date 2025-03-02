<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display'

const props = defineProps<{
  modelPath: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
let app: PIXI.Application | null = null
let model: any = null
let isDragging = false
let dragStartX = 0
let dragStartY = 0

// 初始化PIXI应用
const initPixi = async () => {
  if (!containerRef.value) return
  
  // 使用更简单的方式初始化PIXI，避免GPU相关选项
  app = new PIXI.Application({
    width: 400,
    height: 600,
    transparent: true,
    forceCanvas: true, // 强制使用Canvas渲染，避免WebGL问题
  });

  // 在模型渲染前的设置中
  // 为Live2D设置软件渲染
  window.Live2D = window.Live2D || {};
  window.Live2D.config = window.Live2D.config || {};
  window.Live2D.config.gl = "auto"; // 允许Live2D自动选择渲染模式
  window.Live2D.config.supportWebGL = false; // 告诉Live2D不要使用WebGL

  // 初始化Live2D命名空间
  window.PIXI = PIXI
  // @ts-ignore
  window.Live2DModel = Live2DModel

  if (props.modelPath) {
    loadModel(props.modelPath)
  }

  // 设置拖拽事件
  setupDragEvents()
}

// 加载模型
const loadModel = async (modelPath: string) => {
  console.log('开始加载Cubism 2.1模型:', modelPath)
  if (!app) {
    console.error('PIXI应用未初始化');
    return;
  }
  
  try {
    // 如果已有模型，先移除
    if (model) {
      console.log('移除现有模型');
      app.stage.removeChild(model)
      model = null
    }
    
    // 向用户打印Live2D版本信息
    console.log('Live2D核心版本:', window.Live2D?.version || '未知');
    console.log('PIXI Live2D Display版本:', Live2DModel.version || '未知');
    
    // 明确为Cubism 2开启调试模式
    Live2DModel.prototype.debugMode = true;
    
    // 重要: 使用相对路径加载模型
    const url = `./models/bronya/model.json`;
    console.log('尝试加载模型:', url);
    
    // 加载模型
    model = await Live2DModel.from(url);
    console.log('模型加载成功!');
    
    // 确保模型正确设置
    console.log('模型类型:', model.internalModel.constructor.name);
    console.log('模型尺寸:', model.width, 'x', model.height);
    
    // 调整大小和位置
    const scale = Math.min(
      app.renderer.width / model.width,
      app.renderer.height / model.height
    ) * 0.8;
    
    model.scale.set(scale);
    model.position.set(
      app.renderer.width / 2, 
      app.renderer.height / 2
    );
    model.anchor.set(0.5, 0.5);
    
    // 添加到舞台
    app.stage.addChild(model);
    console.log('模型已添加到舞台');
    
    // 添加交互
    model.interactive = true;
    
  } catch (error) {
    console.error('模型加载失败:', error);
    console.error('错误详情:', error.stack);
  }
}

// 设置拖拽功能
const setupDragEvents = () => {
  if (!containerRef.value) return

  containerRef.value.addEventListener('mousedown', (e) => {
    isDragging = true
    dragStartX = e.clientX
    dragStartY = e.clientY
    window.ipcRenderer.setIgnoreMouseEvents(false)
  })

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    window.ipcRenderer.send('move-window', {
      x: e.screenX - dragStartX,
      y: e.screenY - dragStartY
    })
  })

  window.addEventListener('mouseup', () => {
    isDragging = false
    window.ipcRenderer.setIgnoreMouseEvents(true, { forward: true })
  })
}

// 监听模型路径变化
watch(() => props.modelPath, (newPath) => {
  if (newPath) {
    loadModel(newPath)
  }
})

onMounted(() => {
  initPixi()
  
  // 添加更多调试信息
  window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error)
  })
})

onBeforeUnmount(() => {
  if (app) {
    app.destroy(true)
    app = null
  }
})
</script>

<template>
  <div class="live2d-container" ref="containerRef"></div>
</template>

<style scoped>
.live2d-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
}
</style>