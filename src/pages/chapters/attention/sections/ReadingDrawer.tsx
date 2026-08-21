import type { Component, JSX } from "solid-js";
import styles from "./ReadingDrawer.module.css";

interface ReadingDrawerProps {
  open: boolean;
  eyebrow?: string;
  title: string;
  onClose: () => void;
  children: JSX.Element;
}

export const ReadingDrawer: Component<ReadingDrawerProps> = (props) => (
  <section
    class={styles.drawer}
    classList={{ [styles.drawerOpen]: props.open }}
    aria-hidden={!props.open}
    aria-label={props.title}
  >
    <div class={styles.drawerHead}>
      <div>
        {props.eyebrow && <p class={styles.eyebrow}>{props.eyebrow}</p>}
        <h3>{props.title}</h3>
      </div>
      <button type="button" class={styles.closeButton} onClick={props.onClose} aria-label="关闭展开阅读">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
    </div>
    <div class={styles.drawerBody}>{props.children}</div>
  </section>
);
