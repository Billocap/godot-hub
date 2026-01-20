import { Theme } from "@tauri-apps/api/window";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContext {
  theme: Theme;
  toggleTheme(theme?: Theme): void;
}

const ThemeContext = createContext({} as ThemeContext);

export const useTheme = () => useContext(ThemeContext);

interface ThemeContextProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeContextProps) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = (theme: Theme = "dark") => {
    document.body.dataset.theme = theme;

    setTheme(theme);

    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");

    if (theme === null) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      toggleTheme(isDark ? "dark" : "light");
    } else {
      toggleTheme(theme as Theme);
    }
  }, []);

  const context: ThemeContext = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
  );
}
