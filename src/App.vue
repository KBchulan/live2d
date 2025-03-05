<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { ref, onMounted } from 'vue'
import Live2DModel from './components/Live2DModel.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import ChatPanel from './components/ChatPanel.vue'
import { useModelStore } from './stores/model'
import { useChatStore } from './stores/chat'

const live2dModelRef = ref(null)
const isSettingsOpen = ref(false)
const isChatOpen = ref(false)
const modelStore = useModelStore()
const chatStore = useChatStore()

function toggleSettings() {
  isSettingsOpen.value = !isSettingsOpen.value
  if (isSettingsOpen.value) {
    isChatOpen.value = false
  }
}

function toggleChat() {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    isSettingsOpen.value = false
  }
}

function reloadModel() {
  if (live2dModelRef.value) {
    (live2dModelRef.value as any).reloadModel();
  }
}

onMounted(() => {
  // 初始化存储
  modelStore.init()
  chatStore.init()
})
</script>

<template>
  <div class="app-container">
    <h1 class="app-title">Live2D 桌面应用</h1>
    
    <Live2DModel ref="live2dModelRef" />
    
    <div class="control-buttons">
      <button @click="toggleSettings" class="control-button settings-button" title="设置">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
        </svg>
      </button>
      <button @click="toggleChat" class="control-button chat-button" title="聊天">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H5.2L4 17.2V4h16v12Z"/>
        </svg>
      </button>
    </div>
    
    <SettingsPanel :isOpen="isSettingsOpen" @close="isSettingsOpen = false" @modelChanged="reloadModel" />
    <ChatPanel :isOpen="isChatOpen" @close="isChatOpen = false" />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.app-title {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #333;
  font-size: 18px;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  margin: 0;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: transparent;
  overflow: hidden;
}

.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.control-buttons {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.control-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: white;
  margin: 0 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.control-button:hover {
  background-color: #f5f5f5;
  color: #333;
  transform: scale(1.05);
}

button:focus {
  outline: none;
}
</style>
