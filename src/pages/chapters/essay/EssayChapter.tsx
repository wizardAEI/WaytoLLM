import { For, type Component } from "solid-js";
import styles from "../PrefaceChapter.module.css";
import { ArticleIntro } from "../ArticleIntro";
import { formatReading } from "../../../utils/reading";
import type { Essay } from "./types";

function essayReadingText(essay: Essay): string {
  return [
    "这是一些优秀的项目/文章：",
    ...essay.items.flatMap((entry) => [entry.title, entry.intro]),
  ].join("");
}

export const EssayChapter: Component<{ essay: Essay }> = (props) => (
  <article class={`${styles.preface} ${styles.prefaceList}`}>
    <div class={styles.body}>
      <ArticleIntro title={props.essay.title} meta={formatReading(essayReadingText(props.essay))} />

      <p class={styles.prose} data-reveal>
        这是一些优秀的项目/文章：
      </p>

      <ul class={`${styles.reading} ${styles.readingList}`} data-reveal>
        <For each={props.essay.items}>
          {(entry) => (
            <li>
              <a
                class={styles.readingItem}
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class={styles.readingKind}>{entry.kind}</span>
                <span class={styles.readingTitle}>{entry.title}</span>
                <span class={styles.readingIntro}>{entry.intro}</span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </div>
  </article>
);
