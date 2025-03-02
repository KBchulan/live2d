import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function inspectModel(modelDir) {
  const baseDir = path.join(__dirname, '../public/models', modelDir);
  
  // 查找模型文件
  let modelFile = null;
  
  if (!fs.existsSync(baseDir)) {
    console.error(`错误: 模型目录不存在: ${baseDir}`);
    return;
  }
  
  // 尝试查找模型文件
  const files = fs.readdirSync(baseDir);
  const modelFiles = files.filter(file => file.endsWith('.model3.json') || file === 'model.json');
  
  if (modelFiles.length === 0) {
    console.error('没有找到模型文件');
    return;
  }
  
  modelFile = path.join(baseDir, modelFiles[0]);
  console.log(`检查模型文件: ${modelFile}`);
  
  try {
    const modelData = JSON.parse(fs.readFileSync(modelFile, 'utf8'));
    console.log('模型结构:');
    console.log(JSON.stringify(modelData, null, 2));
    
    // 检查模型类型
    if (modelFile.endsWith('.model3.json')) {
      console.log('模型类型: Live2D Cubism 3');
      // 检查关键元素
      if (modelData.FileReferences) {
        console.log('模型包含必要的FileReferences字段');
        
        if (modelData.FileReferences.Textures) {
          console.log(`纹理文件: ${modelData.FileReferences.Textures.length}个`);
          
          // 验证纹理文件是否存在
          for (const texture of modelData.FileReferences.Textures) {
            const texturePath = path.join(baseDir, texture);
            if (fs.existsSync(texturePath)) {
              console.log(`✅ 纹理存在: ${texture}`);
            } else {
              console.log(`❌ 纹理缺失: ${texture}`);
            }
          }
        }
        
        if (modelData.FileReferences.Moc) {
          const mocPath = path.join(baseDir, modelData.FileReferences.Moc);
          if (fs.existsSync(mocPath)) {
            console.log(`✅ MOC文件存在: ${modelData.FileReferences.Moc}`);
          } else {
            console.log(`❌ MOC文件缺失: ${modelData.FileReferences.Moc}`);
          }
        }
      }
    } else {
      // 检查老版本模型
      console.log('模型类型: Live2D Cubism 2');
      
      if (modelData.textures) {
        console.log(`纹理文件: ${modelData.textures.length}个`);
        
        // 验证纹理文件是否存在
        for (const texture of modelData.textures) {
          const texturePath = path.join(baseDir, texture);
          if (fs.existsSync(texturePath)) {
            console.log(`✅ 纹理存在: ${texture}`);
          } else {
            console.log(`❌ 纹理缺失: ${texture}`);
          }
        }
      }
      
      if (modelData.model) {
        const mocPath = path.join(baseDir, modelData.model);
        if (fs.existsSync(mocPath)) {
          console.log(`✅ MOC文件存在: ${modelData.model}`);
        } else {
          console.log(`❌ MOC文件缺失: ${modelData.model}`);
        }
      }
    }
  } catch (error) {
    console.error('解析模型文件出错:', error);
  }
}

// 使用方法:
// node scripts/inspect-model.mjs bronya

const modelDir = process.argv[2];
if (!modelDir) {
  console.error('请提供模型目录名称');
  process.exit(1);
}

inspectModel(modelDir); 