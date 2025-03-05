const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 发送拖动事件
  dragWindow: (mouseX, mouseY) => {
    ipcRenderer.send('drag-window', { mouseX, mouseY });
  },
  
  // 设置鼠标穿透
  setIgnoreMouseEvents: (ignore, options = {}) => {
    ipcRenderer.send('set-ignore-mouse-events', { ignore, options });
  }
}); 