import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Link } from "@tanstack/solid-router";
import styles from "./ChapterPage.module.css";
import { getAdjacentChapters, type ChapterMeta } from "../../config/chapters";
import { ChapterExplorer } from "../../components/ChapterExplorer";
import { GiscusComments } from "../../components/GiscusComments";

export function ChapterPage(props: { chapter: ChapterMeta }) {
  let rootEl: HTMLDivElement | undefined;
  const adjacent = () => getAdjacentChapters(props.chapter.id);
  const [tocOpen, setTocOpen] = createSignal(false);

  onMount(() => {
    document.title = props.chapter.pageTitle;

    if (!rootEl) return;
    const revealEls = Array.from(
      rootEl.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (revealEls.length === 0) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
    onCleanup(() => revealObserver.disconnect());
  });

  return (
    <div
      ref={rootEl}
      class={styles.chapter}
      classList={{ [styles.chapterWithCover]: Boolean(props.chapter.cover) }}
    >
      <Show when={props.chapter.cover} keyed>
        {(cover) => (
          <figure class={styles.banner}>
            <img src={cover} alt={props.chapter.coverAlt ?? ""} />
          </figure>
        )}
      </Show>
      <div class={styles.container}>
        <div class={styles.chapterHead} data-reveal>
          <div class={styles.tocWrapper}>
            <button
              type="button"
              class={styles.titleTrigger}
              aria-expanded={tocOpen()}
              aria-haspopup="dialog"
              onClick={() => setTocOpen(true)}
            >
              <span class={styles.switchIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />
                </svg>
              </span>
              <span class={styles.chapterLabel}>{props.chapter.navLabel}</span>
            </button>
          </div>
        </div>

        <Dynamic component={props.chapter.Component} />

        <Show when={adjacent().prev || adjacent().next}>
          <nav class={styles.chapterFooter} aria-label="相邻章节">
            <Show when={adjacent().prev} fallback={<span />} keyed>
              {(prev) => (
                <Link to={prev.path} class={styles.navLink}>
                  <svg class={`${styles.buttonIcon} ${styles.iconBack}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M19 12H5M11 18l-6-6 6-6" />
                  </svg>
                  {prev.navLabel}
                </Link>
              )}
            </Show>
            <Show when={adjacent().next} keyed>
              {(next) => (
                <Link to={next.path} class={`${styles.navLink} ${styles.navLinkNext}`}>
                  {next.navLabel}
                  <svg class={`${styles.buttonIcon} ${styles.iconAdvance}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              )}
            </Show>
          </nav>
        </Show>

        <GiscusComments term={props.chapter.id} />
      </div>

      <Show when={tocOpen()}>
        <ChapterExplorer
          activeChapterId={props.chapter.id}
          onClose={() => setTocOpen(false)}
        />
      </Show>
    </div>
  );
}
