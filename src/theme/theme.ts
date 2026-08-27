import { createSignal } from "solid-js";

export type ThemePreference = "light" | "system" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "waytollm-theme";

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "system" || value === "dark";
}

export function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") return systemPrefersDark() ? "dark" : "light";
  return preference;
}

export function applyTheme(preference: ThemePreference, resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themePref = preference;
  root.style.colorScheme = resolved;
}

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(stored)) return stored;
  } catch {
    /* private mode / blocked storage */
  }
  return "system";
}

function readAppliedPreference(): ThemePreference {
  const fromDom = document.documentElement.dataset.themePref ?? null;
  return isThemePreference(fromDom) ? fromDom : readPreference();
}

function readAppliedResolved(): ResolvedTheme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

const [themePreference, setThemePreferenceSignal] = createSignal<ThemePreference>(
  typeof document === "undefined" ? "system" : readAppliedPreference()
);
const [resolvedTheme, setResolvedTheme] = createSignal<ResolvedTheme>(
  typeof document === "undefined" ? "light" : readAppliedResolved()
);

export { themePreference, resolvedTheme };

export function setThemePreference(preference: ThemePreference) {
  const resolved = resolveTheme(preference);
  setThemePreferenceSignal(preference);
  setResolvedTheme(resolved);
  applyTheme(preference, resolved);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}

export function initTheme() {
  setThemePreference(readPreference());

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (themePreference() === "system") {
      setThemePreference("system");
    }
  };
  media.addEventListener("change", onSystemChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    const next = isThemePreference(event.newValue) ? event.newValue : "system";
    const resolved = resolveTheme(next);
    setThemePreferenceSignal(next);
    setResolvedTheme(resolved);
    applyTheme(next, resolved);
  };
  window.addEventListener("storage", onStorage);

  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}
