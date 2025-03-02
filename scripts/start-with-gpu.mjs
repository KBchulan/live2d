import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// 使用Electron的命令行参数启动
const electronProcess = spawn('npx', [
  'electron',
  '.',  // 当前目录
  '--disable-gpu-vsync',
  '--ignore-gpu-blocklist',
  '--enable-gpu-rasterization',
  '--enable-webgl',
  '--enable-accelerated-2d-canvas'
], {
  cwd: rootDir,
  stdio: 'inherit'
});

electronProcess.on('close', (code) => {
  process.exit(code);
}); 