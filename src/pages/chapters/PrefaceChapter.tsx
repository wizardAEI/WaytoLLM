import type { Component } from "solid-js";
import styles from "./PrefaceChapter.module.css";

const VIDEO_BVID = "BV1EA8B6SEQq";
const VIDEO_URL = `https://www.bilibili.com/video/${VIDEO_BVID}/`;

export const PrefaceChapter: Component = () => (
  <article class={styles.preface}>
    <div class={styles.intro} data-reveal>
      <p class={styles.eyebrow}>WAY TO LLM</p>
      <h1>从这里开始，理解现代大模型</h1>
      <p class={styles.lead}>
        这是一份从基础概念到实际落地的学习路线。先用视频建立整体认识，再按章节逐步深入模型、工具与行业实践。
      </p>
    </div>

    <a
      class={styles.videoCard}
      href={VIDEO_URL}
      target="_blank"
      rel="noreferrer"
      data-reveal
    >
      <span class={styles.videoCardIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span class={styles.videoCardBody}>
        <span class={styles.videoCardSource}>哔哩哔哩</span>
        <span class={styles.videoCardUrl}>bilibili.com/video/{VIDEO_BVID}</span>
      </span>
      <svg class={styles.videoCardArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </a>
  </article>
);
