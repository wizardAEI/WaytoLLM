import { Show, type Component } from "solid-js";
import styles from "./PrefaceChapter.module.css";

export const ArticleIntro: Component<{ title: string; meta: string }> = (props) => (
  <header class={styles.intro} data-reveal>
    <p class={styles.eyebrow}>WAY TO LLM</p>
    <div class={styles.titleRow}>
      <h1>{props.title}</h1>
      <Show when={props.meta}>
        <p class={styles.readingMeta}>{props.meta}</p>
      </Show>
    </div>
  </header>
);
