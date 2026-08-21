import type { Component } from "solid-js";
import styles from "./ChapterPage.module.css";

export const BlankChapter: Component = () => (
  <p class={`${styles.placeholder} ${styles.reveal}`} data-reveal>
    此坑待填
  </p>
);
