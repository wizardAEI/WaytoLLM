import type { Component } from "solid-js";
import { EssayChapter } from "./EssayChapter";
import { requireEssay } from "./index";

export function boundEssay(id: string): Component {
  const essay = requireEssay(id);
  return function BoundEssay() {
    return <EssayChapter essay={essay} />;
  };
}
