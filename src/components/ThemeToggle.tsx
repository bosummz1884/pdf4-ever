import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg hover:bg-muted transition-colors"
      data-oid="1856hov"
    >
      <Sun
        className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        data-oid="ausxass"
      />

      <Moon
        className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        data-oid="bguc33e"
      />

      <span className="sr-only" data-oid="s0f4.p9">
        Toggle theme
      </span>
    </Button>
  );
}
