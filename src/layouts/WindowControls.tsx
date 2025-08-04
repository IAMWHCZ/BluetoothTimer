import { useState, useEffect } from "react";
import { Expand, Minimize, Minus, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/mode-toggle";

export const WindowControls = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  const noDragStyle: React.CSSProperties & { WebkitAppRegion?: string } = {
    WebkitAppRegion: "no-drag",
  };

  useEffect(() => {
    // 获取初始状态
    window.ipcRenderer?.invoke("get-window-state").then((state) => {
      setIsMaximized(state.isMaximized);
    });

    // 监听窗口状态变化
    const handleMaximize = () => setIsMaximized(true);
    const handleUnmaximize = () => setIsMaximized(false);

    window.ipcRenderer?.on("window-maximized", handleMaximize);
    window.ipcRenderer?.on("window-unmaximized", handleUnmaximize);

    return () => {
      window.ipcRenderer?.off("window-maximized", handleMaximize);
      window.ipcRenderer?.off("window-unmaximized", handleUnmaximize);
    };
  }, []);

  const handleMaximize = () => {
    if (isMaximized) {
      window.ipcRenderer?.send("window-unmaximize");
    } else {
      window.ipcRenderer?.send("window-maximize");
    }
  };

  return (
    <div style={noDragStyle} className="flex items-center space-x-2">
      <ModeToggle />
      <Button
        variant="ghost"
        className="bg-transparent hover:bg-white/10 border-none shadow-none"
        onClick={() => window.ipcRenderer?.send("window-minimize")}
      >
        <Minus className="w-2 h-2 text-gray-600 dark:text-gray-400" />
      </Button>

      <Button
        variant="ghost"
        className="bg-transparent hover:bg-white/10 border-none shadow-none"
        onClick={handleMaximize}
      >
        {isMaximized ? (
          <Minimize className="w-2 h-2 text-gray-600 dark:text-gray-400" />
        ) : (
          <Expand className="w-2 h-2 text-gray-600 dark:text-gray-400" />
        )}
      </Button>

      <Button
        variant="ghost"
        className="bg-transparent hover:bg-red-500/20 border-none shadow-none"
        onClick={() => window.ipcRenderer?.send("window-close")}
      >
        <X className="w-2 h-2 text-gray-600 dark:text-gray-400" />
      </Button>
    </div>
  );
};
