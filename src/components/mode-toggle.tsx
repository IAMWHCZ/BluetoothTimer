import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const themeHandler = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      onClick={themeHandler}
      size="icon"
      variant="ghost"
      className="bg-transparent hover:bg-white/10 border-none shadow-none"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
