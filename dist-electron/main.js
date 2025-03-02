import { app, ipcMain, BrowserWindow, dialog } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
app.disableHardwareAcceleration = false;
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-webgl");
app.commandLine.appendSwitch("enable-accelerated-2d-canvas");
app.commandLine.appendSwitch("use-angle", "gl");
app.commandLine.appendSwitch("use-gl", "desktop");
app.commandLine.appendSwitch("force_high_performance_gpu", "1");
app.commandLine.appendSwitch("enable-hardware-overlays", "single-fullscreen,single-on-top");
app.commandLine.appendSwitch("force-gpu-rasterization");
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
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.loadFile("simple-wrapper.html");
  win.setIgnoreMouseEvents(true, { forward: true });
}
ipcMain.handle("select-model", async () => {
  if (!win) return null;
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: "选择Live2D模型文件",
    filters: [{ name: "Live2D Models", extensions: ["model3.json"] }],
    properties: ["openFile"]
  });
  if (canceled || !filePaths.length) return null;
  return filePaths[0];
});
ipcMain.on("set-ignore-mouse-events", (_, ignore, options) => {
  if (win) {
    win.setIgnoreMouseEvents(ignore, options);
  }
});
ipcMain.on("move-window", (_, position) => {
  if (win) {
    const [x, y] = win.getPosition();
    win.setPosition(x + position.x, y + position.y);
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.commandLine.appendSwitch("enable-transparent-visuals");
app.commandLine.appendSwitch("disable-gpu-vsync");
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("disable-gpu-driver-bug-workarounds");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");
app.commandLine.appendSwitch("in-process-gpu");
app.commandLine.appendSwitch("disable-gpu-compositing");
app.commandLine.appendSwitch("enable-webgl");
app.commandLine.appendSwitch("use-gl", "swiftshader");
app.commandLine.appendSwitch("use-angle", "swiftshader");
app.whenReady().then(() => {
  console.log("GPU信息:");
  console.log(app.getGPUFeatureStatus());
  createWindow();
});
export {
  MAIN_DIST,
  VITE_DEV_SERVER_URL
};
