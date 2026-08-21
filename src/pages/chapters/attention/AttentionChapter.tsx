import type { Component } from "solid-js";
import { OpeningSection } from "./sections/OpeningSection";

// 章节内容按小节拆分,后续新增小节在此追加即可
export const AttentionChapter: Component = () => {
  return (
    <>
      <OpeningSection />
    </>
  );
};
