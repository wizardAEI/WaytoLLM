import { For, Show, onCleanup, onMount } from "solid-js";
import { Link } from "@tanstack/solid-router";
import { COURSE_SECTIONS, type ChapterMeta, type CourseSection } from "../config/chapters";
import styles from "./ChapterExplorer.module.css";

const LEFT_SECTIONS = COURSE_SECTIONS.slice(0, 4);
const RIGHT_SECTIONS = COURSE_SECTIONS.slice(4);

function ArrowIcon() {
  return (
    <svg class={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ChapterRow(props: {
  chapter: ChapterMeta;
  index: string;
  active?: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      to={props.chapter.path}
      class={styles.item}
      classList={{ [styles.itemActive]: props.active }}
      onClick={() => props.onNavigate()}
    >
      <span class={styles.itemIndex}>{props.index}</span>
      <span class={styles.itemLabel}>{props.chapter.navLabel}</span>
      <ArrowIcon />
    </Link>
  );
}

function SectionBlock(props: {
  section: CourseSection;
  index: number;
  activeChapterId?: string;
  onNavigate: () => void;
}) {
  const ordinal = String(props.index).padStart(2, "0");
  const standaloneChapter = () =>
    props.section.chapters.length === 0 ? props.section.chapter : undefined;
  const empty = () => !props.section.chapter && props.section.chapters.length === 0;

  return (
    <section class={styles.section}>
      <Show
        when={standaloneChapter()}
        keyed
        fallback={
        <>
          <div class={styles.sectionHead}>
            <span class={styles.sectionIndex}>{ordinal}</span>
            <h3 class={styles.sectionTitle}>{props.section.title}</h3>
          </div>
          <Show when={empty()}>
            <p class={styles.pending}>此坑待填</p>
          </Show>
          <Show when={props.section.chapters.length > 0}>
            <div class={styles.sectionList}>
              <For each={props.section.chapters}>
                {(chapter, index) => (
                  <ChapterRow
                    chapter={chapter}
                    index={String(index() + 1).padStart(2, "0")}
                    active={chapter.id === props.activeChapterId}
                    onNavigate={props.onNavigate}
                  />
                )}
              </For>
            </div>
          </Show>
        </>
        }
      >
        {(chapter) => (
          <Link
            to={chapter.path}
            class={styles.sectionLink}
            classList={{ [styles.itemActive]: chapter.id === props.activeChapterId }}
            onClick={() => props.onNavigate()}
          >
            <span class={styles.sectionIndex}>{ordinal}</span>
            <span class={styles.sectionTitle}>{props.section.title}</span>
            <ArrowIcon />
          </Link>
        )}
      </Show>
    </section>
  );
}

export function ChapterExplorer(props: {
  onClose: () => void;
  activeChapterId?: string;
}) {
  let closeBtn: HTMLButtonElement | undefined;

  onMount(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    onCleanup(() => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    });
  });

  return (
    <div
      class={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chapter-explorer-title"
      onClick={() => props.onClose()}
    >
      <div class={styles.panel} onClick={(event) => event.stopPropagation()}>
        <div class={styles.header}>
          <h2 id="chapter-explorer-title" class={styles.title}>全部章节</h2>
          <div class={styles.headerActions}>
            <Link to="/" class={styles.homeLink} onClick={() => props.onClose()}>
              首页
            </Link>
            <button
              ref={closeBtn}
              type="button"
              class={styles.close}
              aria-label="关闭"
              onClick={() => props.onClose()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class={styles.grid}>
          <div class={styles.column}>
            <For each={LEFT_SECTIONS}>
              {(section, index) => (
                <SectionBlock
                  section={section}
                  index={index() + 1}
                  activeChapterId={props.activeChapterId}
                  onNavigate={props.onClose}
                />
              )}
            </For>
          </div>
          <div class={styles.column}>
            <For each={RIGHT_SECTIONS}>
              {(section, index) => (
                <SectionBlock
                  section={section}
                  index={index() + 5}
                  activeChapterId={props.activeChapterId}
                  onNavigate={props.onClose}
                />
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
