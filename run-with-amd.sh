#!/bin/bash

# 强制使用AMD显卡
export DRI_PRIME=1
# 禁用NVIDIA
export __NV_PRIME_RENDER_OFFLOAD=0
# 使用Mesa驱动
export MESA_LOADER_DRIVER_OVERRIDE=radeonsi

# 启动应用
npm run dev 