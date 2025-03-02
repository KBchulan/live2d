#!/bin/bash

export ELECTRON_ENABLE_LOGGING=1
export ELECTRON_ENABLE_STACK_DUMPING=1
export ELECTRON_FORCE_GPU=1

# 尝试使用NVIDIA GPU
export LIBGL_ALWAYS_SOFTWARE=0
export __GLX_VENDOR_LIBRARY_NAME=nvidia

# 启动Electron
npx electron . \
  --enable-gpu \
  --enable-webgl \
  --ignore-gpu-blocklist \
  --disable-gpu-driver-bug-workarounds \
  --enable-accelerated-2d-canvas \
  --use-gl=desktop 