#!/bin/bash

# 重置所有已有环境变量
unset DRI_PRIME
unset __NV_PRIME_RENDER_OFFLOAD
unset __GLX_VENDOR_LIBRARY_NAME
unset LIBGL_ALWAYS_SOFTWARE
unset MESA_LOADER_DRIVER_OVERRIDE

# 检查是否有NVIDIA
if lspci | grep -q "NVIDIA"; then
  echo "使用NVIDIA显卡"
  export __NV_PRIME_RENDER_OFFLOAD=1
  export __GLX_VENDOR_LIBRARY_NAME=nvidia
elif lspci | grep -q "AMD"; then
  echo "使用AMD显卡"
  export DRI_PRIME=1
else
  echo "使用集成显卡"
fi

# 确保加载正确的OpenGL库
export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/mesa:$LD_LIBRARY_PATH

# 启动Electron，不设置任何WebGL或GPU参数
NODE_ENV=development electron . 