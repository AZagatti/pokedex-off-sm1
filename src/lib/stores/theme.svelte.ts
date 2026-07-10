import { browser } from "$app/environment";

export type Theme = "light" | "dark";

const STORAGE_KEY = "pokedex-theme";

function getInitialTheme(): Theme {
  if (!browser) {
    return "light";
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function createThemeStore() {
  let theme = $state<Theme>(getInitialTheme());

  if (browser) {
    $effect.root(() => {
      $effect(() => {
        const value = theme;
        document.documentElement.classList.toggle("dark", value === "dark");
        localStorage.setItem(STORAGE_KEY, value);
      });
    });
  }

  return {
    get current() {
      return theme;
    },
    toggle() {
      theme = theme === "light" ? "dark" : "light";
    },
    set(value: Theme) {
      theme = value;
    },
  };
}

export const themeStore = createThemeStore();
