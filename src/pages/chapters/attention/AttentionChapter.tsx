import type { Component } from "solid-js";
import { OpeningSection } from "./sections/OpeningSection";

// 概览章与 Transformer 基础结构章共享面板实现，在路由配置中分别呈现。
export const AttentionChapter: Component = () => {
  return (
    <>
      <OpeningSection variant="overview" />
    </>
  );
};
