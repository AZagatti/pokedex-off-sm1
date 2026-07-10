import { browser } from "$app/environment";

const STORAGE_KEY = "pokedex-favorites";

function readStored(): string[] {
  if (!browser) {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v) => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

function createFavoritesStore() {
  let names = $state<string[]>(readStored());

  function persist() {
    if (browser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    }
  }

  return {
    get list() {
      return names;
    },
    has(name: string) {
      return names.includes(name);
    },
    toggle(name: string) {
      names = names.includes(name)
        ? names.filter((n) => n !== name)
        : [...names, name];
      persist();
    },
    add(name: string) {
      if (!names.includes(name)) {
        names = [...names, name];
        persist();
      }
    },
    remove(name: string) {
      names = names.filter((n) => n !== name);
      persist();
    },
  };
}

export const favoritesStore = createFavoritesStore();
