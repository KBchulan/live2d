import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function listAllFiles(dir, depth = 0) {
  if (!fs.existsSync(dir)) {
    console.error(`目录不存在: ${dir}`);
    return;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const indent = ' '.repeat(depth * 2);
    
    if (stats.isDirectory()) {
      console.log(`${indent}📁 ${file}/`);
      listAllFiles(filePath, depth + 1);
    } else {
      console.log(`${indent}📄 ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    }
  });
}

const modelsDir = path.join(__dirname, '../public/models');
console.log(`检查模型目录: ${modelsDir}`);

if (fs.existsSync(modelsDir)) {
  const modelFolders = fs.readdirSync(modelsDir);
  
  console.log(`发现 ${modelFolders.length} 个模型文件夹:`);
  modelFolders.forEach(folder => {
    const folderPath = path.join(modelsDir, folder);
    if (fs.statSync(folderPath).isDirectory()) {
      console.log(`\n📁 ${folder}/ 的内容:`);
      listAllFiles(folderPath);
    }
  });
} else {
  console.error(`模型目录不存在: ${modelsDir}`);
  console.log('正在创建模型目录...');
  fs.mkdirSync(modelsDir, { recursive: true });
  console.log(`已创建模型目录: ${modelsDir}`);
} 