import { For, Show, createSignal, onCleanup, onMount, type Component, type JSX } from "solid-js";
import styles from "./OpeningSection.module.css";
import preface from "../../PrefaceChapter.module.css";
import { ArticleIntro } from "../../ArticleIntro";
import { PrefaceFigure } from "../../PrefaceChapter";
import { ReadingDrawer } from "./ReadingDrawer";
import { BPE_TOKENS, getTokenTone } from "./bpeTokens";
import { articlePlainText, formatReading } from "../../../../utils/reading";

const OVERVIEW_TITLE = "大模型的演进之路";
const BASICS_TITLE = "Transformer 的基础结构";

type MediaKind = "text" | "image" | "audio" | "video";

interface MediaItem {
  id: MediaKind;
  label: string;
  title: string;
  summary: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  { id: "text", label: "TEXT / 文字", title: "文字是最早的入口", summary: "离散、可压缩、可监督，也最容易形成规模化语料。" },
  { id: "image", label: "IMAGE / 图像", title: "把画面切成视觉 Token", summary: "从像素块到视觉特征，再与语言 Token 对齐。" },
  { id: "audio", label: "AUDIO / 语音", title: "让声音进入序列", summary: "从连续波形中提取声学特征，保留语义与时间。" },
  { id: "video", label: "VIDEO / 影片", title: "时间维度也需要建模", summary: "在空间 Patch 之外，继续编码帧与帧之间的变化。" },
];

const SCALE_ERAS = [
  {
    id: "01",
    tag: "PRETRAIN",
    title: "Scaling Law",
    body: "损失随参数、数据、算力按幂律下降。三个旋钮必须一起拧，缺了一块算力就会浪费。",
    models: "GPT-3 · PaLM · Gopher / Chinchilla · Llama · GPT-4",
    wall: "高质量文本见底，显卡集群和电网成了真瓶颈。",
  },
  {
    id: "02",
    tag: "POST-TRAINING",
    title: "后训练",
    body: "SFT、RLHF、DPO 把野生底座教成懂规矩的助手；o1 与 R1 用可验证奖励，把做题与推理练进权重。",
    models: "InstructGPT · ChatGPT · Llama 2 Chat · o1 · DeepSeek-R1",
    wall: "偏好数据贵且吵，奖励函数易被钻空子，开放题难以自动评分。",
  },
  {
    id: "03",
    tag: "AGENTIC RL",
    title: "Agentic RL",
    body: "考场换成真实终端与浏览器。模型要规划、调工具、看报错并修正计划，直到把事做完。",
    models: "o3 · Claude computer use · Kimi · Qwen3.8",
    wall: "奖励稀疏且长程归因难，一次真机 rollout 极其昂贵，安全边界从说错话变成做错事。",
  },
] as const;

const PANEL_META = [
  { id: "scale", title: "大模型为什么变得越来越大，越来越强？", desc: "从 Scaling Law 到 Agentic RL，每次变强都伴随着新的瓶颈。" },
  { id: "media", title: "不同媒介，如何进入同一个模型", desc: "文字、图像、语音与视频，经过切分与投影，最终都汇入同一条可计算的 Token 序列。" },
  { id: "vectors", title: "先把输入变成向量", desc: "计算机不认识字符：先用 Tokenizer 拆分切块，再查表转成向量，最后揉入位置编码。" },
  { id: "qkv", title: "LayerNorm 与 Q K V", desc: "归一化稳住数值尺度，三个投影矩阵将同一个输入赋予检索里的三种角色。" },
  { id: "mha", title: "多头注意力", desc: "用相关性打破距离限制；多头并行检索，让模型同时从多个视角理解上下文。" },
  { id: "post-norm", title: "Attention 后的归一化", desc: "把刚刚学到的增量信息加回原始输入，再整理一次数值尺度，供下一层继续计算。" },
  { id: "mlp", title: "MLP 与 MoE", desc: "注意力负责跨位置交流，前馈网络负责自我消化；MoE 用路由让高容量与低开销兼得。" },
  { id: "residual", title: "残差：给深层网络留一条路", desc: "只学相对于上一层的增量，导数中的恒等项为梯度修了一条直通浅层的无阻高架。" },
  { id: "layers", title: "Hidden State 与 Layer", desc: "层层堆叠交替演练，Hidden State 记录着上下文表示被不断提炼与深化的全过程。" },
  { id: "lm-head", title: "LM Head、概率与采样", desc: "将最后一层的表示投影到十万词表，Softmax 与采样策略在毫秒间决定下一个词的诞生。" },
  { id: "reading", title: "扩展阅读", desc: "精选里程碑论文、互动演示与极简代码实现，帮助你从原理到代码彻底通关 Transformer。" },
] as const;

type PanelMeta = (typeof PANEL_META)[number];
type TocId = PanelMeta["id"];
type SectionVariant = "overview" | "basics";
const OVERVIEW_PANELS = PANEL_META.slice(0, 2);
const BASICS_PANELS = PANEL_META.slice(2);

const ATTN_TOKENS = ["我", "喜欢", "Transformer"] as const;
const ATTN_X = [70, 210, 350];
const ATTN_EDGES = [
  { a: 0, b: 1, w: 0.84, dip: 92 },
  { a: 1, b: 2, w: 0.72, dip: 96 },
  { a: 0, b: 2, w: 0.38, dip: 128 },
] as const;
const ATTN_SELF = [0.26, 0.34, 0.48] as const;

const Pipe: Component<{ vertical?: boolean }> = (props) => (
  <svg
    class={props.vertical ? styles.pipeV : styles.pipe}
    viewBox={props.vertical ? "0 0 16 36" : "0 0 36 16"}
    fill="none"
    aria-hidden="true"
  >
    <Show
      when={props.vertical}
      fallback={
        <>
          <path d="M2 8h26" />
          <path d="M22.5 4 32 8l-9.5 4" />
        </>
      }
    >
      <path d="M8 2v26" />
      <path d="M4 22.5 8 32l4-9.5" />
    </Show>
  </svg>
);

const PlusMark: Component = () => (
  <span class={styles.plusMark} aria-hidden="true">
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" />
    </svg>
  </span>
);

const AttentionMap: Component = () => (
  <div class={styles.attentionMap}>
    <svg class={styles.attentionSvg} viewBox="0 0 420 176" role="img" aria-label="三个 Token 之间的注意力连接">
      {ATTN_EDGES.map((edge) => (
        <path
          d={`M ${ATTN_X[edge.a]} 54 Q ${(ATTN_X[edge.a] + ATTN_X[edge.b]) / 2} ${edge.dip} ${ATTN_X[edge.b]} 54`}
          pathLength="1"
          style={{
            "stroke-width": `${1.1 + edge.w * 1.8}`,
            opacity: `${0.28 + edge.w * 0.52}`,
          }}
        />
      ))}
      {ATTN_SELF.map((weight, index) => (
        <path
          d={`M ${ATTN_X[index] - 14} 54 C ${ATTN_X[index] - 14} 78 ${ATTN_X[index] + 14} 78 ${ATTN_X[index] + 14} 54`}
          pathLength="1"
          style={{
            "stroke-width": `${0.9 + weight}`,
            opacity: `${0.2 + weight * 0.45}`,
          }}
        />
      ))}
      {ATTN_X.map((x) => (
        <circle cx={x} cy="54" r="2.2" />
      ))}
      {ATTN_TOKENS.map((token, index) => (
        <g>
          <rect x={ATTN_X[index] - 56} y="12" width="112" height="36" rx="7" />
          <text x={ATTN_X[index]} y="35" text-anchor="middle">
            {token}
          </text>
        </g>
      ))}
    </svg>
  </div>
);

const MediaGlyph: Component<{ kind: MediaKind }> = (props) => (
  <svg class={styles.mediaGlyph} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <Show when={props.kind === "text"}>
      <path d="M10 14h28M10 23h22M10 32h17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <circle cx="35" cy="32" r="4" stroke="currentColor" stroke-width="2" />
    </Show>
    <Show when={props.kind === "image"}>
      <rect x="8" y="10" width="32" height="28" rx="4" stroke="currentColor" stroke-width="2" />
      <circle cx="19" cy="20" r="3" stroke="currentColor" stroke-width="2" />
      <path d="m11 34 9-9 6 6 4-4 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </Show>
    <Show when={props.kind === "audio"}>
      <path d="M12 27v-6M19 32V16M26 36V12M33 29v-9M40 25v-2" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
    </Show>
    <Show when={props.kind === "video"}>
      <rect x="8" y="12" width="24" height="24" rx="4" stroke="currentColor" stroke-width="2" />
      <path d="m32 21 8-5v16l-8-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
    </Show>
  </svg>
);

const Figure: Component<{ caption?: JSX.Element; children: JSX.Element }> = (props) => (
  <figure class={styles.figure}>
    {props.children}
    <Show when={props.caption}>
      <figcaption class={styles.figureCaption}>{props.caption}</figcaption>
    </Show>
  </figure>
);

const PanelHeader: Component<{ title: string; desc: string }> = (props) => (
  <header class={styles.panelHeader}>
    <h2>{props.title}</h2>
    <Show when={props.desc}>
      <p class={styles.panelDesc}>{props.desc}</p>
    </Show>
  </header>
);

const PanelFrame: Component<{ index: number; hideTitle?: boolean; children: JSX.Element }> = (props) => {
  const meta = PANEL_META[props.index]!;
  return (
    <section id={meta.id} class={styles.panel} data-reveal>
      <div class={styles.panelInner}>
        <Show
          when={!props.hideTitle}
          fallback={<h2 class={styles.srOnly}>{meta.title}</h2>}
        >
          <PanelHeader title={meta.title} desc={meta.desc} />
        </Show>
        <div class={styles.panelContent}>{props.children}</div>
      </div>
    </section>
  );
};

const TocNav: Component<{
  active: TocId;
  onJump: (id: TocId) => void;
  variant: "rail" | "inline";
  items: readonly PanelMeta[];
}> = (props) => (
  <nav class={props.variant === "rail" ? preface.tocRail : preface.tocInline} aria-label="文章目录">
    <p class={preface.tocKicker}>目录</p>
    <ol class={preface.tocList}>
      <For each={props.items}>
        {(item, index) => (
          <li>
            <a
              href={`#${item.id}`}
              class={preface.tocLink}
              classList={{ [preface.tocLinkActive]: props.active === item.id }}
              aria-current={props.active === item.id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                props.onJump(item.id);
              }}
            >
              <span class={preface.tocIndex}>{String(index() + 1).padStart(2, "0")}</span>
              <span class={preface.tocTitle}>{item.title}</span>
            </a>
          </li>
        )}
      </For>
    </ol>
  </nav>
);

const ReaderButton: Component<{ onClick: () => void; children: JSX.Element }> = (props) => (
  <button type="button" class={styles.readerButton} onClick={props.onClick}>
    <span>{props.children}</span>
    <span class={styles.buttonIcon} aria-hidden="true">↘</span>
  </button>
);

export const OpeningSection: Component<{ variant?: SectionVariant }> = (props) => {
  const variant = props.variant ?? "overview";
  const panels = variant === "basics" ? BASICS_PANELS : OVERVIEW_PANELS;
  const title = variant === "basics" ? BASICS_TITLE : OVERVIEW_TITLE;
  const [drawer, setDrawer] = createSignal<string | null>(null);
  const [mlpMode, setMlpMode] = createSignal<"mlp" | "moe">("mlp");
  const [active, setActive] = createSignal<TocId>(panels[0]!.id);
  const [readingMeta, setReadingMeta] = createSignal("");
  let lockUntil = 0;
  let bodyEl: HTMLDivElement | undefined;

  const bindBody = (el: HTMLDivElement) => {
    bodyEl = el;
    setReadingMeta(formatReading(articlePlainText(el)));
  };

  const prefersReducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const jumpTo = (id: TocId) => {
    const target = document.getElementById(id);
    if (!target) return;

    lockUntil = Date.now() + 700;
    setActive(id);
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    history.replaceState(null, "", `#${id}`);
  };

  onMount(() => {
    if (bodyEl) setReadingMeta(formatReading(articlePlainText(bodyEl)));

    const hash = window.location.hash.replace("#", "") as TocId;
    if (panels.some((item) => item.id === hash)) {
      setActive(hash);
      requestAnimationFrame(() => jumpTo(hash));
    }

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.intersectionRatio);
        });
        if (Date.now() < lockUntil) return;

        let next: TocId = panels[0]!.id;
        let best = 0;
        panels.forEach((item) => {
          const ratio = visible.get(item.id) ?? 0;
          if (ratio > best) {
            best = ratio;
            next = item.id;
          }
        });
        if (best > 0) setActive(next);
      },
      {
        threshold: [0, 0.12, 0.28, 0.5, 0.72, 1],
        rootMargin: "-18% 0px -62% 0px",
      }
    );

    panels.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    onCleanup(() => observer.disconnect());
  });

  return (
    <article class={preface.preface}>
      <div ref={bindBody} class={preface.body}>
        <ArticleIntro title={title} meta={readingMeta()} />
        <Show when={variant === "overview"}>
          <p class={styles.chapterLead}>
            这一章先回答一个历史问题：模型为什么会从“会续写”走到“能推理、能做事”？我们沿着规模、训练方式与输入媒介的变化，追踪大模型能力如何一次次跃迁。下一章再把镜头推近，拆开 Transformer 的基础结构。
          </p>
        </Show>
        <Show when={variant === "basics"}>
          <p class={styles.chapterLead}>
            上一章讲的是模型为什么一路变强；这一章把镜头推近，跟着一个 Token 走完 Transformer Block：从文字切分与向量化开始，经过归一化、Q / K / V、注意力与 MLP，最后回到下一个 Token 的预测。
          </p>
        </Show>
        <TocNav active={active()} onJump={jumpTo} variant="inline" items={panels} />

        <div class={styles.stack} data-reading-root>
          <Show when={variant === "overview"}>
            <section class={styles.panel} data-reveal>
            <div class={styles.panelInner}>
              <PanelHeader title="从论文到默认架构" desc="2017 年的一个架构转折，后来变成今天大模型共同的计算底座。" />
              <div class={styles.panelContent}>
                <p class={styles.prose}>
                  2017 年，Vaswani 等人发表{" "}
                  <a
                    href="https://arxiv.org/abs/1706.03762"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Attention Is All You Need
                  </a>
                  ，主要用于机器翻译等序列转换任务。
                </p>
                <p class={styles.prose}>
                  2018 年，OpenAI 的 Alec Radford 等人将架构简化成 decoder-only，用“预测下一个词”训练语言模型。意外随之而来：模型并没有被专门教过做题、分类或摘要，但只要数据足够多，这些能力就会逐渐涌现。
                </p>
                <p class={styles.prose}>
                  2020 年，GPT-3 发布，参数量来到 1750 亿。它能在提示词里看几个例子，就完成翻译、写作和答题，论文把这叫做 few-shot。可大多数人并不当回事：它还不够聪明，大家只把它当成一个“大号 Siri”。直到 2022 年 11 月 30 日，OpenAI 推出了基于 GPT-3.5 的 ChatGPT。
                </p>
                <p class={styles.prose}>五天破百万用户，从此大模型正式走入公众视野。</p>

                <aside class={styles.originCite}>
                  <span class={styles.originCiteMark} aria-hidden="true">“</span>
                  <p>
                    The dominant sequence transduction models are based on complex recurrent or
                    convolutional neural networks… We propose a new simple network architecture,
                    the Transformer, based solely on attention mechanisms.
                  </p>
                  <p class={styles.originCiteZh}>
                    当前主导的序列转换模型，都建立在复杂的循环或卷积神经网络之上……我们提出一种新的简单网络架构：Transformer，完全基于注意力机制。
                  </p>
                  <footer>
                    <span>Vaswani et al.</span>
                    <span aria-hidden="true">·</span>
                    <cite>NeurIPS 2017</cite>
                  </footer>
                </aside>

                <p class={styles.prose}>
                  如果你还不是很了解 Transformer 架构，可以先读
                  <a href="/transformer-basics">下一章节：Transformer 的基础结构</a>。
                </p>
                <p class={styles.prose}>
                  同时这里也有一个很好的{" "}
                  <a
                    href="https://poloclub.github.io/transformer-explainer/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Transformer 可视化网站
                  </a>
                  ，非常清晰地展示了文字是如何从 Token 开始，转换成注意力头的 Q K V 向量，再通过层层神经网络、归一化，到最终预测下一个词。也推荐你去看一下{" "}
                  <a
                    href="https://www.bilibili.com/video/BV13z421U7cs/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    3Blue1Brown 官方视频
                  </a>
                  ，会对大模型有更直观的了解。
                </p>
                <PrefaceFigure
                  src="/attention/transformer-explainer.webp"
                  alt="Transformer Explainer：输入 Token 经过注意力与 MLP 后预测下一个词"
                  caption="Transformer Explainer：从 Token 到预测下一个词"
                  href="https://poloclub.github.io/transformer-explainer/"
                />

                <div class={styles.readerRow}>
                  <ReaderButton onClick={() => setDrawer("origin")}>
                    展开阅读：Transformer 为什么会成为默认架构
                  </ReaderButton>
                </div>

                <ReadingDrawer
                  open={drawer() === "origin"}
                  eyebrow="ORIGIN STORY"
                  title="Transformer 为什么会成为默认架构"
                  onClose={() => setDrawer(null)}
                >
                  <p>
                    在 2017 年之前，机器翻译与序列建模几乎都被 <strong>RNN / LSTM / GRU</strong> 主导。
                    它们擅长处理有序信息，却把计算绑在时间步上：第 t 步必须等第 t−1 步完成，训练难以充分利用现代加速器。
                  </p>
                  <p>
                    Transformer 的关键转折，是把「依赖关系」从隐状态传递改写成 <strong>Query / Key / Value</strong> 的检索过程。
                    每个位置都能并行地查看整段上下文，远距离依赖不再需要跨越很多个时间步。
                  </p>
                </ReadingDrawer>
              </div>
            </div>
            </section>

            <PanelFrame index={0}>
            <p class={styles.prose}>
              ChatGPT 爆火之后，圈子里的第一反应其实非常朴素：把模型继续做大。这不是盲目跟风，而是因为 2020 年 Kaplan 等人的 Scaling Law 论文用公式说明，交叉熵损失会随着参数量、数据量和训练算力近似按幂律下降。那几年里，只要算力够、参数和数据同步增加，模型效果就会肉眼可见地变好；“更强”几乎等于“更大”。
            </p>

            <aside class={styles.originCite}>
              <span class={styles.originCiteMark} aria-hidden="true">“</span>
              <p>
                The loss scales as a power-law with model size, dataset size, and the amount of
                compute used for training...
              </p>
              <p class={styles.originCiteZh}>
                <strong>损失随模型规模、数据集规模和训练算力按幂律下降</strong>...
              </p>
              <footer>
                <span>Kaplan et al.</span>
                <span aria-hidden="true">·</span>
                <cite>
                  <a href="https://arxiv.org/abs/2001.08361" target="_blank" rel="noopener noreferrer">
                    arXiv 2020
                  </a>
                </cite>
              </footer>
            </aside>

            <p class={styles.prose}>
              可“做大”这条路很快就撞到了墙。大家发现互联网上的高质量文本几乎被吃干抹净了，电网和显卡集群也成了真瓶颈。于是，模型变强的路径被拆成了三段：预训练把世界知识压缩进权重；后训练把一个只会狂乱续写网页的“野生底座”，教成懂规矩、听得懂人话的助手；而到了最近这两年，最关键的跃迁来到了 <strong>Agentic RL</strong>——奖励不再只来自人类的主观打分，而是来自真实的生产环境。底座依然在涨，但最近每一次让人惊艳的进化，早就不再是简单地多堆了几层 Transformer。
            </p>

            <Figure caption={<><b>三次变强，三堵墙。</b> 每一个阶段都有我们踩过的坑、代表模型和瓶颈。</>}>
              <div class={styles.formulaStack}>
                <div class={styles.formulaCard}>
                  <span>Scaling Law</span>
                  <strong>L(N, D, C) ∝ N<sup>−α</sup>　D<sup>−β</sup>　C<sup>−γ</sup></strong>
                  <small>N 参数 · D 数据 · C 训练算力。指数来自经验拟合，不是定理。</small>
                </div>
              </div>
              <ol class={styles.eraTrack}>
                <For each={SCALE_ERAS}>
                  {(era) => (
                    <li class={styles.eraRow}>
                      <div>
                        <span class={styles.eraIndex}>{era.id} / {era.tag}</span>
                        <span class={styles.eraTitle}>{era.title}</span>
                      </div>
                      <div class={styles.eraBody}>
                        <p>{era.body}</p>
                        <p class={styles.eraMeta}>
                          <span><b>MODELS</b>{era.models}</span>
                          <span><b>WALL</b>{era.wall}</span>
                        </p>
                      </div>
                    </li>
                  )}
                </For>
              </ol>
            </Figure>

            <p class={styles.prose}>
              Scaling Law 最早被写进预训练。Kaplan 当时的结论非常硬：在算力充足时，把模型做大比精修架构要划算得多。但两年后 DeepMind 用{" "}
              <a href="https://arxiv.org/abs/2203.15556" target="_blank" rel="noopener noreferrer">
                Chinchilla
              </a>{" "}
              给所有人浇了一盆冷水：大家之前盲目堆参数，数据反而喂得严重不足了。2800 亿参数的 Gopher，被 700 亿但训得更充分的 Chinchilla 轻松反超。业内大家才恍然大悟：参数、Token 数量和算力必须同步暴涨，偏科就会浪费算力。
            </p>
            <p class={styles.prose}>
              这一阶段的代表模型大家耳熟能详：GPT-3 把 Few-shot 变成了一种通用能力；Llama 用更小的参数和更庞大的 Token 量，走通了开源路线；GPT-4 则把密集预训练推到了当时的高点。然而挑战也随之而至：高质量文本逐渐见底，集群与电力变成硬瓶颈，注意力的二次复杂度让训练成本陡增，预训练一次贵到几乎做不起对照实验。曲线还在下降，但斜率早已没有 2020 年那么惊艳。
            </p>

            <p class={styles.prose}>
              预训练给出的只是一个“会预测下一个词”的野生底座，它并不自动知道什么该答、什么不该答。2022 年 InstructGPT 引入 SFT（监督微调）和 RLHF（基于人类反馈的强化学习），才把底座训成了听话的助手；同年底 ChatGPT 爆火，正是后训练被产品化的瞬间。后来 DPO 让后训练摆脱了复杂的 PPO 框架，变成了各大厂商的通用配方。
            </p>
            <p class={styles.prose}>
              再往后，后训练的目标从“模仿人类说话”进化到了“把题做对”。OpenAI 的 o1 与 DeepSeek 的 R1 证明：给模型留出思考时间，并在数学、代码这种具备客观对错的任务上做强化学习，智力能再跳一大截。典型模型从 ChatGPT、Llama 2 Chat、Claude 走到 o1 与 R1。挑战也换成了一套新麻烦：偏好数据极其昂贵，奖励函数会被模型“钻空子”，能自动打分的任务好练，开放式回答依然极难对齐。
            </p>

            <p class={styles.prose}>
              而到了如今的 <strong>Agentic RL</strong> 时代，考场被直接搬到了生产一线。模型不再只是在草稿纸上推理，而是要自己写代码、跑终端、调用 API、看报错并实时修正计划，直到把整件事做完。像这两年的 o3、带有 Computer Use 的 Claude，以及把长程 Agent 写进模型卡的 Qwen3.8，都站在这条跑道上。
            </p>
            <p class={styles.prose}>
              这一阶段的墙更高了：环境反馈极其稀疏（第 3 步做错可能第 30 步才报错），一次真机 Rollout 的成本极其昂贵，安全边界也从“说话不合规”变成了“动手搞破坏”。所以今天我们在工程里评价一个模型强不强，必须同时看三件事：底座有多大、后训练把什么对齐进去了，以及它在真实环境里打滚过多少轮 RL。
            </p>

            <div class={styles.readerRow}>
              <ReaderButton onClick={() => setDrawer("scale")}>扩展阅读：大模型下的个例</ReaderButton>
            </div>
            <ReadingDrawer
              open={drawer() === "scale"}
              eyebrow="SMALL MODELS"
              title="大模型下的个例"
              onClose={() => setDrawer(null)}
            >
              <p>
                在参数竞赛里，也有一些模型故意不往“更大”走，却把能力密度做得极高。它们并不是否定 Scaling Law，而是把同一套逻辑用在更紧的预算上：用更干净的数据、更充分的训练和更狠的后训练，让小骨架去逼近大模型的行为。
              </p>
              <div class={styles.scaleCase}>
                <span class={styles.sectionTag}>QWEN 27B</span>
                <p>
                  Qwen 的 27B 是最近极其清楚的一个对照：
                  <a href="https://huggingface.co/Qwen/Qwen3.6-27B" target="_blank" rel="noopener noreferrer">Qwen3.6-27B</a>
                  {" "}与{" "}
                  <a href="https://huggingface.co/Qwen/Qwen3.8-27B" target="_blank" rel="noopener noreferrer">Qwen3.8-27B</a>
                  {" "}共用同一套骨架（64 层、5120 隐层，原生约 256K 上下文）。架构图纸几乎没动，3.8 变强的地方全在后训练——在 Agent 环境里做长程强化学习，再从更大的 Qwen3.8-Max 做蒸馏，顺便激活了闲置的多 Token 预测头。独立评测里，这个 27B 从 3.6 到 3.8 智能指数跳了十余分，Terminal Bench、SWE-bench 等长程任务跳得更明显。它印证了一件事：同一个 270 亿参数骨架，被不同的后训练配方对待，能力可以差出一个世代。
                </p>
              </div>
              <div class={styles.scaleCase}>
                <span class={styles.sectionTag}>MINICPM 小钢炮</span>
                <p>
                  面壁智能的 MiniCPM 走的是另一条极致边缘的路，因而得名“小钢炮”。2024 年的{" "}
                  <a href="https://arxiv.org/abs/2404.06395" target="_blank" rel="noopener noreferrer">2.4B / 1.2B</a>
                  ，公开榜单上就能跟当时的 Llama 2 7B 甚至 13B 叫板；后来的{" "}
                  <a href="https://arxiv.org/abs/2506.07900" target="_blank" rel="noopener noreferrer">MiniCPM4</a>
                  {" "}把稀疏注意力和高质量数据清洗用到端侧，MiniCPM-V 4.6 只用 1.3B 就把多模态门槛降到了大约 6G 内存。方法并不神秘：用小模型做风洞实验搜超参，数据/参数比刻意高于 Chinchilla 最优，再用蒸馏把大模型的行为压进小权重。它证明了在端侧和消费级显卡上，能力密度本身就是一种极其珍贵的规模。
                </p>
              </div>
              <p>
                两条个例指向同一个结论：追求更大参数依然有效，但它不再是唯一的旋钮。有人把 27B 后训练到能做长程 Agent，有人把 1B–2B 训到能在手机上跑多模态。“规模”这两个字，早已不只等于参数量。
              </p>
            </ReadingDrawer>
            </PanelFrame>

            <PanelFrame index={1}>
            <p class={styles.prose}>
              早几年在做 AI 的时候，搞文本、图像和语音的同学几乎完全生活在不同的世界，大家各自用着 RNN、CNN 或者专用声学网络。但 Transformer 架构最优雅的地方，就在于它展现出了强悍的“大一统”能力——无论原始输入是文字、图片、音频还是视频，进入注意力层之前，都要做同一件事：被切成一段离散的 Token 序列。
            </p>
            <p class={styles.prose}>
              模型的核心注意力层根本不在乎某个 Token 到底来自像素还是字符，它只关心序列中不同位置之间的相关性。文本天然是离散符号；图片被裁成一幅幅 Patch 拼图；语音从波形里提取声学特征；视频则在空间 Patch 上叠进时间轴。把它们统统投影到同一个向量空间后，不同感官的信息就能在同一条序列里“对视”并互相计算。
            </p>

            <Figure caption={<><b>四种入口，一条序列。</b> 点击可展开各模态如何被切成 Token。</>}>
              <div class={styles.mediaGrid}>
                <For each={MEDIA_ITEMS}>
                  {(item) => (
                    <button type="button" class={styles.mediaCard} onClick={() => setDrawer(item.id)}>
                      <MediaGlyph kind={item.id} />
                      <span class={styles.mediaLabel}>{item.label}</span>
                      <strong>{item.title}</strong>
                      <small>{item.summary}</small>
                    </button>
                  )}
                </For>
              </div>
            </Figure>

            <p class={styles.prose}>
              这条统一后的 Token 序列，就是后面所有复杂推理的起点。无论是现在各种实时语音交互系统对延迟的极致压缩，还是端侧小模型的轻量化，关键都不只是“多接入一种输入”，而是让不同的感官在同一个模型里实现真正的理解与对齐。
            </p>
            <div class={styles.readerRow}>
              <ReaderButton onClick={() => setDrawer("future")}>扩展阅读：世界模型、端侧模型与更多感官</ReaderButton>
            </div>
            <ReadingDrawer open={drawer() === "text"} eyebrow="TEXT INPUT" title="为什么大语言模型从文字开始" onClose={() => setDrawer(null)}>
              <p>文字是离散的、可切分的符号序列，天然适合做监督学习，也能通过互联网形成规模巨大的训练语料。</p>
              <p><strong>Token</strong> 让模型不必只认识完整单词，而是用有限词表覆盖不同语言、拼写和新词。</p>
            </ReadingDrawer>
            <ReadingDrawer open={drawer() === "image"} eyebrow="VISION TOKEN" title="图片如何变成 Token" onClose={() => setDrawer(null)}>
              <p>视觉编码器先把图片切成固定大小的 Patch，再将每个 Patch 映射成向量。这个序列可以和文字 Token 投影到同一个维度。</p>
              <p>进入注意力层后，图像 Token 可以被文字查询，也可以反过来为文字提供上下文，形成跨模态注意力。</p>
              <div class={styles.miniDiagram}><span>像素</span><Pipe /><span>Patch</span><Pipe /><span>视觉 Token</span><Pipe /><span>Attention</span></div>
            </ReadingDrawer>
            <ReadingDrawer open={drawer() === "audio"} eyebrow="AUDIO TOKEN" title="语音如何进入模型" onClose={() => setDrawer(null)}>
              <p>语音通常先经过声学编码器，把连续波形转换成按时间排列的频谱或声学特征，再下采样为更短的 Token 序列。</p>
              <p>语言模型接收这些序列后，可以做转写、翻译、问答，或者通过语音解码器重新生成声音。</p>
            </ReadingDrawer>
            <ReadingDrawer open={drawer() === "video"} eyebrow="VIDEO TOKEN" title="影片如何同时表达空间与时间" onClose={() => setDrawer(null)}>
              <p>影片不仅有单帧画面，还有帧与帧之间的运动。模型会在空间 Patch 之外加入时间位置编码，或先用视频编码器提取时空特征。</p>
              <p>为了控制计算量，实际系统通常会做关键帧采样、时间压缩或分层注意力。</p>
            </ReadingDrawer>
            <ReadingDrawer open={drawer() === "future"} eyebrow="EXTENDED READING" title="模型会拥有更多感官吗" onClose={() => setDrawer(null)}>
              <p><strong>世界模型</strong>尝试学习环境的状态变化与因果关系；<strong>端侧模型</strong>则在更小的算力和更严格的延迟约束下完成推理。</p>
              <p>未来的模型可能会继续接入动作、气味、触觉和身体状态，但关键不只是“增加输入”，而是建立这些模态之间可预测、可行动的共同表示。</p>
            </ReadingDrawer>
            </PanelFrame>

          </Show>

          <Show when={variant === "basics"}>
            <PanelFrame index={2}>
            <p class={styles.prose}>
              计算机本质上是个死板的数学计算器，它根本不认识所谓的“汉字”或“英文”。我们输入的每一段话，第一步都要交给 Tokenizer 这个“翻译官”，按照词表拆成一个个数字 ID。接着，Embedding 层会去查表，把这些数字 ID 转换成高维空间里的向量——这时候，每个词才变成了可用于矩阵计算的连续数值。
            </p>
            <p class={styles.prose}>
              然而，单纯的向量是没有顺序概念的。如果不做特殊处理，“猫追狗”和“狗追猫”在模型眼里就是一模一样的一袋词。因此，我们必须把位置编码（Positional Encoding）像水印一样打进向量里，把“谁在前、谁在后”的位置信息融入内容之中。有了带位置的向量序列，后续的注意力计算才能既懂词义、又懂语序。
            </p>

            <Figure caption={<><b>离散符号变成可计算的输入。</b> Tokenizer 负责切分，Embedding 负责查表，位置编码负责顺序。</>}>
              <div class={styles.vectorFlow}>
                <div class={styles.tokenStack}>
                  <span class={styles.sectionTag}>TOKENIZER</span>
                  <For each={BPE_TOKENS.slice(0, 4)}>
                    {(token) => <span class={styles.tokenChip} style={{ "background-color": getTokenTone(token).bg, "border-color": getTokenTone(token).border }}>{token.text}</span>}
                  </For>
                </div>
                <Pipe />
                <div class={styles.vectorBlock}>
                  <span class={styles.sectionTag}>EMBEDDING</span>
                  <div class={styles.vectorMatrix}>{Array.from({ length: 12 }, (_, index) => <i style={{ opacity: `${0.35 + (index % 4) * 0.14}` }} />)}</div>
                  <small>每个 Token 对应一个高维向量</small>
                </div>
                <PlusMark />
                <div class={styles.positionBlock}>
                  <span class={styles.sectionTag}>POSITION</span>
                  <div class={styles.positionLines}><i /><i /><i /><i /></div>
                  <small>让模型知道顺序</small>
                </div>
              </div>
            </Figure>

            <p class={styles.prose}>
              拿到这条带位置信息的向量序列后，后面的网络层就不再跟原始字符打交道，而是全心处理这些连续表示：先归一化，再投影成 Query、Key 与 Value。
            </p>
            <ReaderButton onClick={() => setDrawer("vector")}>展开阅读：Tokenizer、Embedding 与位置编码</ReaderButton>
            <ReadingDrawer open={drawer() === "vector"} eyebrow="REPRESENTATION" title="为什么不能直接把文字喂给模型" onClose={() => setDrawer(null)}>
              <p>神经网络擅长处理连续数值。Tokenizer 负责把文字切成有限词表中的编号，Embedding 再把编号查表变成可学习的向量。</p>
              <p>位置编码把顺序注入向量，使“猫追狗”和“狗追猫”不会被当成同一种输入。</p>
            </ReadingDrawer>
            </PanelFrame>

            <PanelFrame index={3}>
            <p class={styles.prose}>
              在向量正式进入注意力检索之前，有一个非常关键却常被忽视的“保洁员”——LayerNorm（或者现代大模型更常用的 RMSNorm）。深层网络里的数值极易因为层层累加而剧烈波动，归一化就像是给数值套上约束衣，把它们拉回稳定的尺度，防止训练时出现梯度爆炸或消失。
            </p>
            <p class={styles.prose}>
              整理好数值后，同一组输入向量会经过三组不同的投影矩阵，分化出三种角色：<strong>Q</strong>（Query，寻找什么）、<strong>K</strong>（Key，我是什么）和 <strong>V</strong>（Value，携带什么内容）。这就好比在图书馆借书：Q 是手里的检索借书单，K 是每本书书脊上的索引标签，而 V 则是书里真正装载的知识。匹配发生在 Q 与 K 之间，但真正被提取和吸收的是 V 里的信息。
            </p>

            <Figure caption={<><b>准备一次检索。</b> γ、β 与三个投影矩阵都是训练得到的参数，会随着损失一起更新。</>}>
              <div class={styles.formulaStack}>
                <div class={styles.formulaCard}><span>LayerNorm</span><strong>y = γ · (x − μ) / √(σ² + ε) + β</strong><small>γ、β 是训练得到的缩放与偏移参数</small></div>
                <div class={styles.formulaCard}><span>Q / K / V</span><strong>Q = XW<sub>Q</sub>　K = XW<sub>K</sub>　V = XW<sub>V</sub></strong><small>三个投影矩阵把同一输入变成不同角色</small></div>
              </div>
              <div class={styles.roleGrid}><span><b>Q</b>我在寻找什么</span><span><b>K</b>我能被什么找到</span><span><b>V</b>我真正携带的信息</span></div>
            </Figure>

            <ReaderButton onClick={() => setDrawer("norm")}>展开阅读：参数从哪里来，训练时如何更新</ReaderButton>
            <ReadingDrawer open={drawer() === "norm"} eyebrow="BACKPROPAGATION" title="LayerNorm 与 QKV 参数如何学习" onClose={() => setDrawer(null)}>
              <p>前向计算使用当前的 γ、β 和投影矩阵；损失函数计算完成后，反向传播会沿着计算图产生梯度。</p>
              <p>优化器随后按照学习率更新这些参数，让下一次 Q、K、V 的匹配更接近训练目标。</p>
            </ReadingDrawer>
            </PanelFrame>

            <PanelFrame index={4}>
            <p class={styles.prose}>
              理解了 QKV，自注意力的计算过程就变得非常直观：用当前位置的 Q 与前面所有位置的 K 逐个做点积，得到相关性权重，再按权重把各自的 V 加权求和。这是 Transformer 相比 RNN 的关键优势之一：它不必像接力赛一样逐步传递隐状态，而是让每个位置都能直接读取上下文。
            </p>
            <p class={styles.prose}>
              而所谓的“多头注意力”（Multi-Head Attention），其实就是让模型“一心多用”。一个头专门盯着句法主谓宾，另一个头负责追查代词指代，还有一个头在关注标点与结构。把多个头并行计算的结果拼接起来再做一次线性投影，模型就能同时从多个角度理解一句话。
            </p>

            <Figure caption={<><b>Attention(Q, K, V)。</b> 线宽表示相关性：每个位置按权重聚合其他位置的信息。</>}>
              <AttentionMap />
            </Figure>

            <p class={styles.prose}>
              这种设计的优势极其明显：全局视野、并行训练、表达力极强。但代价也同样突出——标准自注意力的计算复杂度随序列长度呈 O(n²) 爆炸。这也解释了为什么这两年像 FlashAttention、GQA（分组查询注意力）、滑动窗口等优化技术，会成为大模型工程落地时最核心的攻坚阵地。
            </p>
            <ReaderButton onClick={() => setDrawer("attention")}>展开阅读：训练更新与现代架构改进</ReaderButton>
            <ReadingDrawer open={drawer() === "attention"} eyebrow="MODERN ATTENTION" title="注意力机制正在如何进化" onClose={() => setDrawer(null)}>
              <p>训练时，注意力输出参与损失计算，梯度会更新 W<sub>Q</sub>、W<sub>K</sub>、W<sub>V</sub> 以及输出投影。</p>
              <p>现代架构通过 GQA、MQA、滑动窗口、稀疏注意力和 FlashAttention 等方式，降低 KV 缓存或显存访问成本。</p>
            </ReadingDrawer>
            </PanelFrame>

            <PanelFrame index={5}>
            <p class={styles.prose}>
              注意力层算完之后，模型并不会直接把原始输入丢掉，而是把刚刚算出的新信息“加回”到原始输入上（即残差连接），然后再做一次归一化整理。
            </p>
            <p class={styles.prose}>
              这样做的好处在于，注意力层只需要专注于学习“这次需要补充和修正什么”，而原始的基底信息一直被完好地保留着。配合 RMSNorm 或 LayerNorm 把数值重新整理到平稳分布，后面的网络层才能安心接棒，继续进行下一轮计算。
            </p>

            <Figure caption={<><b>先相加，再整理尺度。</b> 子层学习的是“需要改变什么”，原始输入仍然走捷径留下来。</>}>
              <div class={styles.residualDiagram}>
                <div class={styles.residualRow}>
                  <div class={styles.residualLeft}>
                    <svg class={styles.skipSvg} viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M14 34 C14 8 86 8 86 34" />
                    </svg>
                    <span class={styles.skipLabel}>residual</span>
                    <div class={styles.nodeBox}>x</div>
                    <Pipe />
                    <div class={styles.plusNode}>+</div>
                  </div>
                  <Pipe />
                  <div class={styles.nodeBoxWide}>
                    LayerNorm
                    <small>稳定尺度</small>
                  </div>
                </div>
              </div>
              <div class={styles.normCompare}><span><b>LayerNorm</b>中心化 + 缩放</span><span><b>RMSNorm</b>只做均方根缩放</span></div>
            </Figure>
            </PanelFrame>

            <PanelFrame index={6}>
            <p class={styles.prose}>
              如果说注意力机制解决的是“信息如何在不同词之间流动”（谁看谁），那么接下来的前馈网络（MLP）解决的就是“每个词如何消化和加工自己”。经典的 MLP 结构非常清晰：先用一次线性变换把维度拉高几倍，经过非线性激活函数充分吸收知识，再把维度压回去。
            </p>
            <p class={styles.prose}>
              然而当模型做到几千亿参数时，每个 Token 都跑一遍完整的巨型 MLP，算力开销会非常高。因此，不少大模型开始采用 MoE（混合专家架构）：Router（路由）根据输入特点，把每个 Token 送给最合适的少数几个“专家”处理。这样既能扩大模型的总知识容量，又能控制每次推理的实际计算量。
            </p>

            <Figure caption={<><b>交流之后是加工。</b> 切换 MLP / MoE，看每个位置如何被独立改写。</>}>
              <div class={styles.switch} role="tablist" aria-label="切换 MLP 与 MoE">
                <button type="button" classList={{ [styles.switchActive]: mlpMode() === "mlp" }} onClick={() => setMlpMode("mlp")} role="tab" aria-selected={mlpMode() === "mlp"}>MLP</button>
                <button type="button" classList={{ [styles.switchActive]: mlpMode() === "moe" }} onClick={() => setMlpMode("moe")} role="tab" aria-selected={mlpMode() === "moe"}>MoE</button>
              </div>
              <Show when={mlpMode() === "mlp"} fallback={
                <div class={styles.moeDiagram}>
                  <div class={styles.moeSource}>
                    <div class={styles.nodeBox}>Token</div>
                    <Pipe />
                    <div class={styles.nodeBoxAccent}>Router</div>
                  </div>
                  <svg class={styles.moeFan} viewBox="0 0 56 200" fill="none" aria-hidden="true">
                    <path d="M2 100h16" />
                    <path d="M18 100 C34 100 34 22 54 22" />
                    <path d="M18 100 C34 100 34 74 54 74" />
                    <path d="M18 100 C34 100 34 126 54 126" />
                    <path d="M18 100 C34 100 34 178 54 178" />
                  </svg>
                  <div class={styles.experts}><b>Expert 01</b><b>Expert 02</b><b>Expert 03</b><b>Expert 04</b></div>
                </div>
              }>
                <div class={styles.mlpDiagram}>
                  <span class={styles.nodeBox}>Hidden State</span>
                  <Pipe />
                  <b class={styles.nodeBox}>Up Projection</b>
                  <Pipe />
                  <b class={styles.nodeBox}>非线性</b>
                  <Pipe />
                  <b class={styles.nodeBox}>Down Projection</b>
                </div>
              </Show>
            </Figure>

            <ReaderButton onClick={() => setDrawer("moe")}>展开阅读：稀疏计算、参数更新与 MoE 的主流化</ReaderButton>
            <ReadingDrawer open={drawer() === "moe"} eyebrow="SPARSE COMPUTE" title="为什么 MoE 成为主流方案之一" onClose={() => setDrawer(null)}>
              <p>MoE 训练时会同时更新被选中的专家与 Router。负载均衡损失帮助不同专家获得相近的 Token 数量，避免少数专家过载。</p>
              <p>除了 MoE，还有条件计算、稀疏激活和早退等方案。MoE 的优势在于可以扩展总容量，同时只为每个 Token 激活少量路径。</p>
            </ReadingDrawer>
            </PanelFrame>

            <PanelFrame index={7}>
            <p class={styles.prose}>
              在整个 Transformer Block 里，残差连接（Residual Connection）一共出现了两次：一次在注意力之后，一次在 MLP 之后。用公式写出来非常简洁：<code>y = x + F(x)</code>。它的工程哲学是：网络每一层不需要重新发明轮子，只需要学习相对于上一层的“增量” <code>F(x)</code>。
            </p>
            <p class={styles.prose}>
              这在数学上给深层神经网络救了一命。当我们在反向传播算梯度时，<code>x</code> 这一项的导数恒等于 1。这就相当于在百层深的大楼里修了一座直通地面的无阻碍电梯——哪怕上面的某个子层一时没学好、梯度变得极小，信号也能沿着这条直通捷径毫无损耗地传回浅层。这就是为什么我们可以肆无忌惮地把 Transformer 堆到几十甚至上百层，而不用担心网络崩塌。
            </p>

            <Figure caption={<><b>捷径与子层并行。</b> 输入状态 x 与子层输出 F(x) 在相加点汇合，得到 x + F(x)。</>}>
              <div class={styles.residualLarge}>
                <div class={styles.nodeBox}>输入状态 x</div>
                <div class={styles.nodeBox}>子层输出 F(x)</div>
                <div class={styles.mergeWell}>
                  <span class={styles.mergeHint}>shortcut</span>
                  <svg class={styles.mergeSvg} viewBox="0 0 200 68" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M50 0 V24 C50 50 100 50 100 50" />
                    <path d="M150 0 V24 C150 50 100 50 100 50" />
                    <path d="M100 50 V64" />
                    <path d="M94.5 57 L100 64.5 L105.5 57" />
                  </svg>
                </div>
                <strong class={styles.nodeBoxAccent}>x + F(x)</strong>
              </div>
            </Figure>

            <ReaderButton onClick={() => setDrawer("residual")}>展开阅读：残差路径的训练更新</ReaderButton>
            <ReadingDrawer open={drawer() === "residual"} eyebrow="OPTIMIZATION" title="残差连接如何帮助训练" onClose={() => setDrawer(null)}>
              <p>对 y = x + F(x) 求导时，梯度包含恒等项 1。即使子层的梯度变小，主路径仍能传递有效信号。</p>
              <p>这正是 Transformer 可以稳定堆叠很多层的重要原因之一。</p>
            </ReadingDrawer>
            </PanelFrame>

            <PanelFrame index={8}>
            <p class={styles.prose}>
              每一个 Transformer 层，本质上都在重复做一件事：先让 Token 之间交流（Attention），再让 Token 自我消化（MLP）。堆叠的层数越多，输入信息被重新加工和提炼的次数就越多。在这个过程中，每一层输出的向量就被称为 Hidden State（隐状态）。
            </p>
            <p class={styles.prose}>
              在浅层，Hidden State 存储的多半还是词性、拼写等表面语法特征；到了中深层，它开始融合长距离的上下文逻辑与抽象语义；到了最后几层，它已经提炼出了对下一个词预测最为关键的高维意图。深层大模型之所以聪明，正是因为这种一层层递进、不断深化理解的累积效应。
            </p>

            <Figure caption={<><b>层在累积理解。</b> 从浅层到深层，同一段输入被反复重新编码；向量只是这个过程的数值形态。</>}>
              <div class={styles.layerStack}>
                <div class={styles.layerSide}><span>Layer 01</span><i /><i /><i /></div>
                <svg class={styles.layerJoin} viewBox="0 0 40 20" fill="none" aria-hidden="true">
                  <path d="M4 10h26" />
                  <path d="M24 5.5 34 10 24 14.5" />
                </svg>
                <div class={`${styles.layerSide} ${styles.layerSideGrow}`}>
                  <span>Layer 12</span><i /><i /><i /><i /><i />
                </div>
                <svg class={styles.layerJoin} viewBox="0 0 40 20" fill="none" aria-hidden="true">
                  <path d="M4 10h26" />
                  <path d="M24 5.5 34 10 24 14.5" />
                </svg>
                <div class={`${styles.layerSide} ${styles.layerSideDeep}`}>
                  <span>Layer N</span><i /><i /><i /><i /><i /><i /><i />
                </div>
              </div>
              <div class={styles.hiddenState}><span>Hidden State</span><strong>[ 0.24, −0.08, 1.37, … ]</strong><small>每层都在重新编码“当前上下文”</small></div>
            </Figure>
            </PanelFrame>

            <PanelFrame index={9}>
            <p class={styles.prose}>
              当信息流一路冲到最后一层，拿到最终的 Hidden State 后，就到了临门一脚的时刻：LM Head（语言模型头）登场。它通过一次线性投影，把高维向量映射到整张词表上（比如 10 万个 Token），算出每一个词接在后面的得分（Logits）。
            </p>
            <p class={styles.prose}>
              接着用 Softmax 把得分变成概率分布，再配合我们熟知的采样参数（Temperature、Top-P、Top-K）决定最终输出哪一个词。温度高一点，模型就敢于“灵光一闪”冒出罕见词；温度调低或设为 0，模型就会稳扎稳打选概率最高的那个。而我们平时看到的生成文本，无非就是把这个“预测下一个词 - 追加回输入 - 重新跑一遍网络”的过程，在毫秒间重复了成百上千次而已。
            </p>

            <Figure caption={<><b>从表示到下一个符号。</b> 概率条示意词表上的竞争；采样规则决定模型有多确定、有多敢偏离。</>}>
              <div class={styles.outputFlow}>
                <span class={styles.nodeBox}>Hidden State</span>
                <Pipe />
                <b class={styles.nodeBox}>LM Head</b>
                <Pipe />
                <b class={styles.nodeBox}>Logits</b>
                <Pipe />
                <b class={styles.nodeBox}>Softmax</b>
                <Pipe />
                <strong class={styles.nodeBoxAccent}>采样 Token</strong>
              </div>
              <div class={styles.probability}><span>下一个 Token 的概率</span><div><i style={{ width: "74%" }} /><i style={{ width: "48%" }} /><i style={{ width: "28%" }} /><i style={{ width: "16%" }} /></div><small>temperature / top-k / top-p 控制选择的随机性</small></div>
            </Figure>

            <ReaderButton onClick={() => setDrawer("output")}>展开阅读：Token 能变成图片或机器人动作吗</ReaderButton>
            <ReadingDrawer open={drawer() === "output"} eyebrow="BEYOND TEXT" title="Token 不只可以转换成文字" onClose={() => setDrawer(null)}>
              <p>语言模型输出的 Token 也可以被其他解码器接收：图像模型把 Token 还原为视觉 Latent，语音模型把它们变成声学特征。</p>
              <p>在具身智能中，Token 可以代表动作、轨迹或策略片段，经过控制器和执行器转换成机器人的真实行为。</p>
            </ReadingDrawer>
            </PanelFrame>

            <PanelFrame index={10}>
            <p class={styles.prose}>要真正彻底吃透 Transformer，光看概念是不够的。这里精选了几篇最具里程碑意义的论文、互动演示以及源码实现，强烈建议大家抽空动手跑一跑、读一读：</p>
            <ul class={styles.furtherList}>
              <li>
                <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer">
                  <strong>Attention Is All You Need</strong>
                  <span>Transformer 原论文。</span>
                </a>
              </li>
              <li>
                <a href="https://jalammar.github.io/illustrated-transformer/" target="_blank" rel="noopener noreferrer">
                  <strong>The Illustrated Transformer</strong>
                  <span>Jay Alammar 用图把注意力算一遍。</span>
                </a>
              </li>
              <li>
                <a href="https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/" target="_blank" rel="noopener noreferrer">
                  <strong>The Transformer Family Version 2.0</strong>
                  <span>后来那些变体收成一张家族树。</span>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank" rel="noopener noreferrer">
                  <strong>Let's build GPT</strong>
                  <span>Karpathy 从零写 GPT。</span>
                </a>
              </li>
              <li>
                <a href="https://jaykmody.com/blog/gpt-from-scratch/" target="_blank" rel="noopener noreferrer">
                  <strong>GPT in 60 Lines of NumPy</strong>
                  <span>六十行 NumPy 把 GPT 跑起来。</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/Hannibal046/Awesome-LLM" target="_blank" rel="noopener noreferrer">
                  <strong>Awesome-LLM</strong>
                  <span>里程碑论文和教程索引。</span>
                </a>
              </li>
            </ul>
            </PanelFrame>
          </Show>
        </div>
      </div>

      <TocNav active={active()} onJump={jumpTo} variant="rail" items={panels} />
    </article>
  );
};
