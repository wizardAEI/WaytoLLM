import type { Component } from "solid-js";
import { SITE_NAME } from "./site";
import { AttentionChapter } from "../pages/chapters/attention/AttentionChapter";
import { TransformerBasicsChapter } from "../pages/chapters/attention/TransformerBasicsChapter";
import { boundEssay } from "../pages/chapters/essay/bound";
import { PrefaceChapter } from "../pages/chapters/PrefaceChapter";

export interface ChapterMeta {
  id: string;
  path: string;
  order: number;
  navLabel: string;
  pageTitle: string;
  cover?: string;
  coverAlt?: string;
  Component: Component;
}

export interface CourseSection {
  id: string;
  title: string;
  /**
   * 区块本身就是一篇文档时使用（例如前言）。
   * 与 chapters 互斥：有 chapter 时不再挂子章节。
   */
  chapter?: ChapterMeta;
  chapters: ChapterMeta[];
}

const ATTENTION_COVER = "/covers/attention-history-cover.webp";
const ATTENTION_COVER_ALT = "点刻的手递出一封漆印信件";

function doc(
  id: string,
  navLabel: string,
  extra?: Partial<Pick<ChapterMeta, "cover" | "coverAlt" | "path" | "Component">>
): ChapterMeta {
  return {
    id,
    path: extra?.path ?? `/${id}`,
    order: 0,
    navLabel,
    pageTitle: `${navLabel} - ${SITE_NAME}`,
    cover: extra?.cover,
    coverAlt: extra?.coverAlt,
    Component: extra?.Component ?? boundEssay(id),
  };
}

export const COURSE_SECTIONS: CourseSection[] = [
  {
    id: "preface",
    title: "前言",
    chapter: doc("preface", "前言", {
      cover: ATTENTION_COVER,
      coverAlt: ATTENTION_COVER_ALT,
      Component: PrefaceChapter,
    }),
    chapters: [],
  },
  {
    id: "modern-llm",
    title: "了解现代 LLM",
    chapters: [
      doc("attention-is-all-you-need", "大模型的演进之路", {
        path: "/attention-is-all-you-need",
        cover: "/covers/attention-cover.webp",
        coverAlt: "线描的眼睛注视一块朱红印渍的活字卡片",
        Component: AttentionChapter,
      }),
      doc("transformer-basics", "Transformer 的基础结构", {
        path: "/transformer-basics",
        cover: "/covers/attention-cover.webp",
        coverAlt: "线描的眼睛注视一块朱红印渍的活字卡片",
        Component: TransformerBasicsChapter,
      }),
    ],
  },
  {
    id: "deployment",
    title: "模型部署",
    chapters: [
      doc("private-deployment", "私有化部署"),
      doc("llm-gateway", "大模型网关"),
      doc("llmops", "LLMOps"),
      doc("on-device", "端侧模型"),
      doc("dense-moe", "Dense & MoE 选型"),
    ],
  },
  {
    id: "training",
    title: "模型训练",
    chapters: [
      doc("post-training", "模型后训练"),
      doc("quantization", "模型量化"),
    ],
  },
  {
    id: "app-frameworks",
    title: "现代大模型应用框架",
    chapters: [
      doc("rag-context", "RAG 与上下文工程"),
      doc("agent-frameworks", "Agent 与 ReAct"),
      doc("tools-mcp", "工具调用、MCP 与 Skills"),
    ],
  },
  {
    id: "evaluation",
    title: "模型测评",
    chapters: [
      doc("safety-eval", "安全评测"),
      doc("capability-regression", "通用能力回归"),
      doc("scenario-testing", "场景测试"),
      doc("eval-datasets", "测试集从哪来，如何维护?"),
    ],
  },
  {
    id: "industry",
    title: "大模型行业应用",
    chapters: [
      doc("ai-healthcare", "AI 在医疗卫生领域的应用"),
      doc("ai-banking", "银行中的 AI"),
      doc("ai-telecom", "了解电信行业中的 AI"),
      doc("ai-legal", "法律 AI"),
      doc("ai-government", "政企 AI 需求"),
      doc("ai-education", "教育行业 AI 应用"),
      doc("ai-ecommerce", "电商领域的 AI"),
      doc("ai-video", "AI 视频/AI 漫剧发展"),
    ],
  },
];

function flattenSectionChapters(sections: CourseSection[]): ChapterMeta[] {
  return sections.flatMap((section) => [
    ...(section.chapter ? [section.chapter] : []),
    ...section.chapters,
  ]);
}

export const CHAPTERS: ChapterMeta[] = flattenSectionChapters(COURSE_SECTIONS).map(
  (chapter, index) => {
    chapter.order = index + 1;
    return chapter;
  }
);

export function getAdjacentChapters(id: string): {
  prev?: ChapterMeta;
  next?: ChapterMeta;
} {
  const index = CHAPTERS.findIndex((chapter) => chapter.id === id);
  if (index === -1) return {};
  return {
    prev: index > 0 ? CHAPTERS[index - 1] : undefined,
    next: index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : undefined,
  };
}
