import type { Component } from "solid-js";
import { For } from "solid-js";
import styles from "./ThemeSwitch.module.css";
import {
  setThemePreference,
  themePreference,
  type ThemePreference,
} from "../theme/theme";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1l1.1-1.1M18 6l1.1-1.1" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M19.2 16A8.2 8.2 0 1 1 13.6 6.8 5.5 5.5 0 0 0 19.2 16z" />
    </svg>
  );
}

const OPTIONS: {
  id: ThemePreference;
  label: string;
  icon: Component;
}[] = [
  { id: "light", label: "浅色", icon: SunIcon },
  { id: "system", label: "系统", icon: SystemIcon },
  { id: "dark", label: "深色", icon: MoonIcon },
];

export const ThemeSwitch: Component = () => (
  <div class={styles.switch} role="radiogroup" aria-label="外观">
    <For each={OPTIONS}>
      {(option) => {
        const Icon = option.icon;
        const selected = () => themePreference() === option.id;
        return (
          <button
            type="button"
            class={styles.option}
            classList={{ [styles.optionActive]: selected() }}
            role="radio"
            aria-checked={selected()}
            aria-label={option.label}
            title={option.label}
            onClick={() => setThemePreference(option.id)}
          >
            <Icon />
          </button>
        );
      }}
    </For>
  </div>
);
