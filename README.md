# Live2D 桌面宠物

一个基于Electron和Vue 3的Live2D桌面宠物应用，支持模型显示、换肤、拖动和AI对话等多种功能。

## 功能特点

- 🖥️ **桌面应用**：基于Electron构建，提供跨平台桌面体验
- 🎭 **Live2D显示**：使用pixi-live2d-display渲染Live2D模型
- 🎨 **换肤功能**：支持自定义和切换不同的Live2D模型
- 🔄 **拖拽移动**：可以自由拖动模型在桌面上的位置
- 💬 **AI对话**：集成DeepSeek API，实现与模型的智能对话
- 🎯 **透明背景**：无边框窗口，实现真正的桌面宠物效果
- ⚙️ **个性化设置**：提供多种设置选项，满足个性化需求

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **状态管理**：Pinia
- **桌面框架**：Electron + electron-builder
- **Live2D渲染**：pixi-live2d-display + pixi.js
- **API集成**：DeepSeek API

## 快速开始

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run electron:dev
```

### 构建应用

```bash
# 构建桌面应用
npm run electron:build
```

### 预览构建结果

```bash
# 构建并预览
npm run electron:preview
```

## 使用指南

1. **添加模型**：将Live2D模型文件放置在 `public/models/`目录下
2. **配置API**：在设置面板中添加DeepSeek API密钥
3. **自定义设置**：调整模型大小、位置等参数

## 目录结构

```
live2d-desktop/
├── electron/           # Electron主进程代码
├── public/             # 静态资源
│   └── models/         # Live2D模型文件
├── src/                # 渲染进程代码
│   ├── components/     # Vue组件
│   ├── stores/         # Pinia状态管理
│   └── views/          # 页面视图
└── ...
```

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

[MIT License](LICENSE)
