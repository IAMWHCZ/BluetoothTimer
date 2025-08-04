import { Content } from "./Content";
import { WindowControls } from "./WindowControls";
import { ReactNode } from "react";

interface WindowLayoutProps {
  children?: ReactNode;
}

export const WindowLayout = ({ children }: WindowLayoutProps) => {
  const titleBarStyle: React.CSSProperties & { WebkitAppRegion?: string } = {
    WebkitAppRegion: "drag",
  };

  return (
    <div className="h-screen w-screen bg-white dark:bg-black">
      {/* 简约标题栏 - 增加高度到 h-12 */}
      <div
        style={titleBarStyle}
        className="h-12 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 drag-region"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Bluetooth Timer
          </span>
        </div>
        <WindowControls />
      </div>

      {/* 主要内容区域 - 相应调整高度计算 */}
      <div className="flex h-[calc(100vh-3rem)]">
        {/* 主内容区域 */}
        <main className="flex-1 bg-white dark:bg-black">
          {children || <Content />}
        </main>
      </div>
    </div>
  );
};
