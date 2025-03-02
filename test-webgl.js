const { app, BrowserWindow } = require('electron');
const path = require('path');

// 不禁用硬件加速
app.disableHardwareAcceleration = false;

// 添加命令行参数
app.commandLine.appendSwitch('use-gl', 'swiftshader');  // 使用软件渲染
app.commandLine.appendSwitch('enable-webgl');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false
    }
  });

  win.loadFile('webgl-test.html');
  win.webContents.openDevTools();
}); 