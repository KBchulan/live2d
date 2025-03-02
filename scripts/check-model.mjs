import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkModelStructure(modelDir) {
  const baseDir = path.join(__dirname, '../public/models', modelDir);
  
  if (!fs.existsSync(baseDir)) {
    console.error(`错误: 模型目录不存在: ${baseDir}`);
    return false;
  }
  
  console.log(`检查模型目录: ${baseDir}`);
  
  // 检查模型文件
  const files = fs.readdirSync(baseDir);
  const modelFiles = files.filter(file => file.endsWith('.model3.json'));
  
  if (modelFiles.length === 0) {
    console.warn(`警告: 找不到.model3.json文件`);
    
    // 检查是否有旧版模型文件
    const oldModelFiles = files.filter(file => file === 'model.json');
    if (oldModelFiles.length > 0) {
      console.log(`找到旧版模型文件: model.json`);
    } else {
      console.error(`错误: 找不到任何模型文件`);
      return false;
    }
  } else {
    console.log(`找到模型文件: ${modelFiles.join(', ')}`);
  }
  
  // 检查贴图文件夹
  const texturesDir = path.join(baseDir, 'textures');
  if (fs.existsSync(texturesDir)) {
    console.log(`找到贴图目录`);
    const textureFiles = fs.readdirSync(texturesDir);
    console.log(`贴图文件: ${textureFiles.join(', ')}`);
  } else {
    console.warn(`警告: 贴图目录不存在`);
  }
  
  // 检查动作文件夹
  const motionsDir = path.join(baseDir, 'motions');
  if (fs.existsSync(motionsDir)) {
    console.log(`找到动作目录`);
  } else {
    console.warn(`警告: 动作目录不存在`);
  }
  
  return true;
}

// 使用:
// node scripts/check-model.mjs <your_model_folder>

const modelDir = process.argv[2];
if (!modelDir) {
  console.error('请提供模型文件夹名称作为参数');
  process.exit(1);
}

const result = checkModelStructure(modelDir);
console.log(`模型检查结果: ${result ? '通过' : '失败'}`); 