/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  electronAPI?: {
    dragWindow: (mouseX: number, mouseY: number) => void;
    setIgnoreMouseEvents: (ignore: boolean, options?: any) => void;
    setAlwaysOnTop?: (alwaysOnTop: boolean) => void;
  };
  PIXI: any;
}
