"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // Live2D 特定功能
  selectModel: () => electron.ipcRenderer.invoke("select-model"),
  // 窗口拖拽支持
  setIgnoreMouseEvents: (ignore, options) => {
    electron.ipcRenderer.send("set-ignore-mouse-events", ignore, options);
  }
  // You can expose other APTs you need here.
  // ...
});
