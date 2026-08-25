import { createSignal, Show, onMount } from "solid-js";
import { Link } from "@tanstack/solid-router";
import styles from "./HomePage.module.css";
import { CHAPTERS } from "../config/chapters";
import { SITE_NAME } from "../config/site";
import { ChapterExplorer } from "../components/ChapterExplorer";

const HOME_TITLE = `现代大模型指南 - ${SITE_NAME}`;

export function HomePage() {
  const firstChapter = CHAPTERS[0];
  const [explorerOpen, setExplorerOpen] = createSignal(false);

  onMount(() => {
    document.title = HOME_TITLE;
  });

  return (
    <section class={styles.hero}>
      <div class={styles.container}>
        <div class={styles.heroGrid}>
          <div>
            <h1 class={styles.heroTitle}>百闻不如一见</h1>
            <p class={styles.heroDesc}>
              了解一个事物的最好方法就是亲自去感受它
            </p>
            <div class={styles.heroActions}>
              <Link to={firstChapter.path} class={styles.btnPrimary}>
                从头开始
                <svg class={`${styles.buttonIcon} ${styles.iconAdvance}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <button
                type="button"
                class={styles.btnSecondary}
                onClick={() => setExplorerOpen(true)}
              >
                探索全部章节
                <svg class={styles.buttonIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </button>
            </div>
          </div>
          <div class={styles.heroBanner}>
            <img src="/banner.webp" alt="Banner" />
          </div>
        </div>
      </div>

      <Show when={explorerOpen()}>
        <ChapterExplorer onClose={() => setExplorerOpen(false)} />
      </Show>
    </section>
  );
}
