#!/bin/bash

# 强制使用NVIDIA显卡
export __NV_PRIME_RENDER_OFFLOAD=1
export __GLX_VENDOR_LIBRARY_NAME=nvidia
export __VK_LAYER_NV_optimus=NVIDIA_only

# 启动应用
npm run dev 