import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 400,
    minWidth: 400,
    minHeight: 400,
    resizable: false,
    icon: path.join(process.env.VITE_PUBLIC, "bluetooth-timer.png"),
    frame: false,
    transparent: true,
    roundedCorners: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("dom-ready", () => {
    // 页面DOM已加载，可以结束loading
    if (win) {
      // 平滑过渡到主界面
      win.setSize(1200, 800);
      win.setResizable(true);
      win.setAlwaysOnTop(false);
      win.setSkipTaskbar(false);
      win.center();
    }
  });

  win.once("ready-to-show", () => {
    win?.show();
    win?.focus();

    // 淡入动画
    if (win) {
      win.setOpacity(0);
      let opacity = 0;
      const fadeIn = setInterval(() => {
        opacity += 0.1;
        if (opacity >= 1) {
          clearInterval(fadeIn);
          win?.setOpacity(1);
        } else {
          win?.setOpacity(opacity);
        }
      }, 30);
    }
  });

  const loadMainApp = () => {
    if (VITE_DEV_SERVER_URL) {
      win?.loadURL(VITE_DEV_SERVER_URL).catch((err) => {
        console.error("Failed to load dev server:", err);
        // Fallback to file loading
        win?.loadFile(path.join(RENDERER_DIST, "index.html"));
      });
    } else {
      win?.loadFile(path.join(RENDERER_DIST, "index.html")).catch((err) => {
        console.error("Failed to load main app:", err);
      });
    }
  };

  if (VITE_DEV_SERVER_URL) {
    win.loadFile(path.join(process.env.APP_ROOT, "loading.html"));
    win.webContents.once("dom-ready", () => {
      setTimeout(loadMainApp, 500);
    });
  } else {
    win.loadFile(path.join(process.env.APP_ROOT, "loading.html"));
    win.webContents.once("dom-ready", () => {
      setTimeout(loadMainApp, 300);
    });
  }
  win.webContents.on("did-finish-load", () => {
    console.log("Main application loaded successfully");
  });
  win.webContents.on("render-process-gone", (event, detailed) => {
    console.error("Renderer process crashed:", detailed);
  });

  win.webContents.on("unresponsive", () => {
    console.log("Window became unresponsive");
  });
  // 错误处理
  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Failed to load:", errorDescription);
    // 即使加载失败也显示主界面
    if (win) {
      win.setSize(1200, 800);
      win.setResizable(true);
      win.setAlwaysOnTop(false);
      win.setSkipTaskbar(false);
      win.center();
    }
  });

  // 窗口状态变化监听
  win.on("maximize", () => {
    win?.webContents.send("window-maximized");
  });

  win.on("unmaximize", () => {
    win?.webContents.send("window-unmaximized");
  });

  win.on("enter-full-screen", () => {
    win?.webContents.send("window-fullscreen-entered");
  });

  win.on("leave-full-screen", () => {
    win?.webContents.send("window-fullscreen-exited");
  });

  // 独立的恢复事件
  ipcMain.on("window-unmaximize", () => {
    win?.unmaximize();
  });

  // 窗口大小调整
  ipcMain.on("window-resize", (event, width: number, height: number) => {
    win?.setSize(width, height);
  });

  // 窗口位置调整
  ipcMain.on("window-move", (event, x: number, y: number) => {
    win?.setPosition(x, y);
  });

  // 添加窗口控制
  ipcMain.on("window-minimize", () => {
    win?.minimize();
  });

  ipcMain.on("window-maximize", () => {
    if (win?.isMaximized()) {
      win.unmaximize();
    } else {
      win?.maximize();
    }
  });

  ipcMain.on("window-close", () => {
    win?.close();
  });

  ipcMain.handle("get-window-state", () => {
    return {
      isMaximized: win?.isMaximized() || false,
      isMinimized: win?.isMinimized() || false,
      isFullScreen: win?.isFullScreen() || false,
      bounds: win?.getBounds(),
    };
  });

  win.once("ready-to-show", () => {
    win?.show();

    if (win) {
      win.setOpacity(0);
      let opacity = 0;
      const fadeIn = setInterval(() => {
        opacity += 0.1;
        if (opacity >= 1) {
          clearInterval(fadeIn);
          win?.setOpacity(1);
        } else {
          win?.setOpacity(opacity);
        }
      }, 30);
    }
  });

  ipcMain.on("loading-complete", () => {
    // loading页面通知完成，可以开始过渡
    console.log("Loading page confirmed completion");
  });

  // 更精确的加载监听
  win.webContents.on("did-start-loading", () => {
    console.log("Started loading main content");
  });

  win.webContents.on("did-stop-loading", () => {
    console.log("Main content loaded");
    // 通知loading页面可以结束
    win?.webContents.send("loading-complete");
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
