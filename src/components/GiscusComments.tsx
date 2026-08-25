import { Show, onMount } from "solid-js";
import styles from "./GiscusComments.module.css";
import { giscusConfig, isGiscusConfigured } from "../config/comments";

export function GiscusComments(props: { term: string }) {
  let host: HTMLDivElement | undefined;

  onMount(() => {
    if (!host || !isGiscusConfigured) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", giscusConfig.repo);
    script.setAttribute("data-repo-id", giscusConfig.repoId);
    script.setAttribute("data-category", giscusConfig.category);
    script.setAttribute("data-category-id", giscusConfig.categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", props.term);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "zh-CN");
    host.appendChild(script);
  });

  return (
    <section class={styles.comments} aria-label="评论">
      <div class={styles.heading}>
        <span class={styles.kicker}>DISCUSSION</span>
        <h2>留下你的想法</h2>
      </div>
      <Show
        when={isGiscusConfigured}
        fallback={
          <p class={styles.setupHint}>
            评论区正在配置中，稍后开放。
          </p>
        }
      >
        <div ref={host} class={styles.giscus} />
      </Show>
    </section>
  );
}
