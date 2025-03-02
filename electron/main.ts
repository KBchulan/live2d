import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

// 在导入部分后添加
app.disableHardwareAcceleration = false;
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');

// 在所有app.commandLine调用之前添加以下设置
// 强制使用独立显卡 - NVIDIA
app.commandLine.appendSwitch('use-angle', 'gl');
app.commandLine.appendSwitch('use-gl', 'desktop');
app.commandLine.appendSwitch('force_high_performance_gpu', '1');
app.commandLine.appendSwitch('enable-hardware-overlays', 'single-fullscreen,single-on-top');
app.commandLine.appendSwitch('force-gpu-rasterization');

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      // 移除复杂的GPU配置
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs')
    },
  })
  
  // 直接加载一个简单的HTML文件
  win.loadFile('simple-wrapper.html')
  
  // 允许点击穿透非模型区域
  win.setIgnoreMouseEvents(true, { forward: true })
}

// 添加IPC处理程序
ipcMain.handle('select-model', async () => {
  if (!win) return null
  
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: '选择Live2D模型文件',
    filters: [{ name: 'Live2D Models', extensions: ['model3.json'] }],
    properties: ['openFile']
  })
  
  if (canceled || !filePaths.length) return null
  return filePaths[0]
})

// 处理窗口拖拽
ipcMain.on('set-ignore-mouse-events', (_, ignore, options) => {
  if (win) {
    win.setIgnoreMouseEvents(ignore, options)
  }
})

// 添加以下IPC处理程序用于窗口拖动
ipcMain.on('move-window', (_, position) => {
  if (win) {
    const [x, y] = win.getPosition()
    win.setPosition(x + position.x, y + position.y)
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 在app.whenReady()之前添加这些配置
// GL渲染相关配置
app.commandLine.appendSwitch('enable-transparent-visuals')
app.commandLine.appendSwitch('disable-gpu-vsync')
app.commandLine.appendSwitch('ignore-gpu-blocklist')
app.commandLine.appendSwitch('disable-gpu-driver-bug-workarounds')
app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('enable-zero-copy')

// 在app.whenReady()之前
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('use-gl', 'swiftshader');
app.commandLine.appendSwitch('use-angle', 'swiftshader');

app.whenReady().then(() => {
  console.log('GPU信息:');
  console.log(app.getGPUFeatureStatus());
  createWindow();
})
