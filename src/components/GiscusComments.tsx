import { Show, createEffect, onMount } from "solid-js";
import styles from "./GiscusComments.module.css";
import { giscusConfig, isGiscusConfigured } from "../config/comments";
import { resolvedTheme } from "../theme/theme";

const giscusTheme = () => (resolvedTheme() === "dark" ? "dark" : "light");

function setGiscusTheme(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme } } },
    "https://giscus.app"
  );
}

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
    script.setAttribute("data-theme", giscusTheme());
    script.setAttribute("data-lang", "zh-CN");
    host.appendChild(script);
  });

  createEffect(() => {
    setGiscusTheme(giscusTheme());
  });

  return (
    <section class={styles.comments} aria-label="评论">
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
