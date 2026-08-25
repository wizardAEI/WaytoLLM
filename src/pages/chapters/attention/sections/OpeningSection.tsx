import { For, Show, createSignal, onCleanup, onMount, type Component, type JSX } from "solid-js";
import styles from "./OpeningSection.module.css";
import { ReadingDrawer } from "./ReadingDrawer";
import { BPE_TOKENS, getTokenTone } from "./bpeTokens";

const TITLE = "Transformer 的核心：注意力机制";

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

interface TimelineItem {
  year: string;
  title: string;
  body: string;
  tag?: string;
}

const ORIGIN_TIMELINE: TimelineItem[] = [
  {
    year: "2017",
    title: "Attention Is All You Need",
    body: "Vaswani 等人用自注意力彻底替代循环与卷积，让序列中任意位置都能直接建立依赖。",
    tag: "论文",
  },
  {
    year: "2018",
    title: "BERT · GPT",
    body: "Encoder / Decoder 被拆成不同预训练路线：双向理解与自回归生成开始分道扬镳。",
    tag: "变体",
  },
  {
    year: "2020",
    title: "规模化预训练",
    body: "更大参数、更多数据与指令微调让「通用语言模型」从研究原型走向可部署系统。",
    tag: "扩展",
  },
  {
    year: "今天",
    title: "LLM 成为通用接口",
    body: "文本、代码、图像与更多媒介被统一进可学习的表示空间，Transformer 成为默认骨架。",
    tag: "现状",
  },
];

const PANEL_META = [
  { title: "从一篇论文到默认骨架", desc: "2017 年之后，注意力几乎成了序列模型的默认组织方式。" },
  { title: "不同媒介，如何进入同一个模型", desc: "文字、图像、语音、影片，最后都要变成同一条 Token 序列。" },
  { title: "先把输入变成向量", desc: "符号不能直接计算：先切分，再查表，再把顺序写进去。" },
  { title: "LayerNorm 与 Q / K / V", desc: "归一化稳住尺度，三个投影把同一输入拆成检索的三种角色。" },
  { title: "多头注意力", desc: "每个位置按相关性检索上下文；多头是把这件事并行做几遍。" },
  { title: "Attention 后的归一化", desc: "先把子层结果加回去，再把数值尺度整理一遍。" },
  { title: "MLP 与 MoE", desc: "注意力负责谁看谁，前馈网络负责改写每个位置自己。" },
  { title: "残差：给深层网络留一条路", desc: "每一层只学增量，梯度才有一条不会断的捷径。" },
  { title: "Hidden State 与 Layer", desc: "层数越深，同一段输入被重新编码的次数越多。" },
  { title: "LM Head、概率与采样", desc: "最后一层的表示被投影到词表，采样决定下一个 Token。" },
  { title: "扩展阅读", desc: "" },
];

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

const PanelFrame: Component<{ index: number; children: JSX.Element }> = (props) => {
  const meta = PANEL_META[props.index];
  return (
    <article class={styles.panel} data-panel={props.index}>
      <div class={styles.panelInner}>
        <PanelHeader title={meta.title} desc={meta.desc} />
        <div class={styles.panelContent}>
          {props.children}
        </div>
      </div>
    </article>
  );
};

const ReaderButton: Component<{ onClick: () => void; children: JSX.Element }> = (props) => (
  <button type="button" class={styles.readerButton} onClick={props.onClick}>
    <span>{props.children}</span>
    <span class={styles.buttonIcon} aria-hidden="true">↘</span>
  </button>
);

export const OpeningSection: Component = () => {
  const [drawer, setDrawer] = createSignal<string | null>(null);
  const [mlpMode, setMlpMode] = createSignal<"mlp" | "moe">("mlp");

  let stackEl: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;

  onMount(() => {
    if (!stackEl) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const panels = Array.from(stackEl.querySelectorAll<HTMLElement>("[data-panel]"));

    if (reduceMotion) {
      panels.forEach((el) => el.classList.add(styles.seen));
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.seen);
          observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    panels.forEach((el, index) => {
      if (index === 0) {
        el.classList.add(styles.seen);
        return;
      }
      observer!.observe(el);
    });

    onCleanup(() => observer?.disconnect());
  });

  return (
    <section class={styles.stage}>
      <h1 class={styles.srOnly}>{TITLE}</h1>

      <div ref={stackEl} class={styles.stack}>
          <PanelFrame index={0}>
            <p class={styles.prose}>
              2017 年，Vaswani 等人发表 <em>Attention Is All You Need</em>。这篇论文没有发明注意力，但它做了一件更彻底的事：把循环和卷积从序列模型里拿掉，只留下注意力。
            </p>
            <p class={styles.prose}>
              在那之前，机器翻译几乎都被 RNN / LSTM 主导。它们擅长处理有序信息，却把计算绑在时间步上：第 t 步必须等第 t−1 步完成，长程依赖还要沿着隐状态一层层传过去。Transformer 把「谁该看谁」改写成可学习的检索，每个位置都能并行查看整段上下文。
            </p>
            <p class={styles.prose}>
              此后不到十年，同一套骨架覆盖了理解、生成、代码、多模态和工具调用。今天几乎所有主流大模型，都可以看成 Transformer 的变体。它留下来的，不只是一块网络结构，而是一种组织计算的方式：先让 Token 互相看见，再让每个位置独立加工。
            </p>

            <aside class={styles.originCite}>
              <span class={styles.originCiteMark} aria-hidden="true">“</span>
              <p>
                The dominant sequence transduction models are based on complex recurrent or
                convolutional neural networks… We propose a new simple network architecture,
                the Transformer, based solely on attention mechanisms.
              </p>
              <footer>
                <span>Vaswani et al.</span>
                <span aria-hidden="true">·</span>
                <cite>NeurIPS 2017</cite>
              </footer>
            </aside>

            <Figure caption={<><b>从论文到默认骨架。</b> Encoder / Decoder 后来被拆成不同预训练路线，规模化让同一套结构走进可部署系统。</>}>
              <ol class={styles.timeline}>
                <For each={ORIGIN_TIMELINE}>
                  {(item) => (
                    <li>
                      <div class={styles.timelineNode} aria-hidden="true" />
                      <div class={styles.timelineMeta}>
                        <span class={styles.timelineYear}>{item.year}</span>
                        <Show when={item.tag}>
                          <span class={styles.timelineTag}>{item.tag}</span>
                        </Show>
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </li>
                  )}
                </For>
              </ol>
            </Figure>

            <p class={styles.prose}>
              Transformer 能成为默认选择，主要有三件事同时成立：训练时可以并行处理整段序列，更适合 GPU；任意两个位置都能直接交互，远距离语义不必层层传递；残差、归一化与注意力模块可以稳定地加深加宽，能力随规模持续涌现。
            </p>

            <Figure caption={<><b>计算方式的转折。</b> 注意力把依赖关系从「沿时间传递」改写成「按相关性检索」。</>}>
              <div class={styles.compareBoard}>
                <div class={styles.compareCol}>
                  <span class={styles.compareLabel}>Before</span>
                  <strong>RNN / Seq2Seq</strong>
                  <ul>
                    <li>逐步展开，难以并行</li>
                    <li>远距离依赖容易衰减</li>
                    <li>长序列训练不稳定</li>
                  </ul>
                </div>
                <div class={styles.compareDivider} aria-hidden="true">
                  <svg viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="13" />
                    <path d="M11 8.5 17.5 14 11 19.5" />
                  </svg>
                </div>
                <div class={styles.compareCol} classList={{ [styles.compareColAccent]: true }}>
                  <span class={styles.compareLabel}>After</span>
                  <strong>Transformer</strong>
                  <ul>
                    <li>整段序列可并行计算</li>
                    <li>任意位置直接交互</li>
                    <li>更容易堆叠与扩展</li>
                  </ul>
                </div>
              </div>
            </Figure>

            <div class={styles.readerRow}>
              <ReaderButton onClick={() => setDrawer("origin")}>
                展开阅读：从机器翻译到通用大模型
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
              <p>
                随后的路线分化也很清晰：<strong>BERT</strong> 走双向 Encoder，擅长理解；
                <strong>GPT</strong> 走自回归 Decoder，擅长生成。当规模、数据与对齐技术叠加后，
                同一套骨架逐渐覆盖对话、代码、多模态与工具调用。
              </p>
              <div class={styles.miniDiagram}>
                <span>RNN 瓶颈</span>
                <Pipe />
                <span>Self-Attention</span>
                <Pipe />
                <span>预训练</span>
                <Pipe />
                <span>通用 LLM</span>
              </div>
            </ReadingDrawer>
          </PanelFrame>

          <PanelFrame index={1}>
            <p class={styles.prose}>
              文字、图像、语音、影片看起来完全不同，进入模型之前却要做同一件事：被切成一段离散的 Token 序列。注意力层并不关心这些 Token 来自像素还是字符，它只处理序列中每个位置与其他位置的关系。
            </p>
            <p class={styles.prose}>
              所以多模态模型并不是为每种媒介各造一套完全不同的大脑，而是先把它们投影到可以互相计算的表示空间。文字天然就是符号序列；图片被切成 Patch；语音从波形里抽出声学特征；影片还要在空间之外编码时间。对齐之后，它们可以出现在同一条序列里，被同一套注意力处理。
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
              这条统一后的 Token 序列，就是后面所有计算的起点。实时系统还会继续压缩时间分辨率、降低延迟；端侧模型则在更紧的算力预算里完成同样的事。关键不只是「增加输入」，而是让不同模态之间变得可对齐、可预测。
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

          <PanelFrame index={2}>
            <p class={styles.prose}>
              神经网络不能直接吃文字。Tokenizer 先把文本切成词表里的编号，Embedding 再把编号查成可学习的向量。这一步之后，每个 Token 都变成高维空间里的一个点，模型才能开始做加减和投影。
            </p>
            <p class={styles.prose}>
              但向量本身没有顺序。如果只把词嵌进去，「猫追狗」和「狗追猫」会变成同一袋无序特征。位置编码把「谁在前、谁在后」写进向量，注意力稍后才能同时利用内容和位置。
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
              得到的是一条带位置的向量序列。后面的层不再处理符号，只处理这些连续表示：先归一化，再投影成 Query、Key 与 Value。
            </p>
            <ReaderButton onClick={() => setDrawer("vector")}>展开阅读：Tokenizer、Embedding 与位置编码</ReaderButton>
            <ReadingDrawer open={drawer() === "vector"} eyebrow="REPRESENTATION" title="为什么不能直接把文字喂给模型" onClose={() => setDrawer(null)}>
              <p>神经网络擅长处理连续数值。Tokenizer 负责把文字切成有限词表中的编号，Embedding 再把编号查表变成可学习的向量。</p>
              <p>位置编码把顺序注入向量，使“猫追狗”和“狗追猫”不会被当成同一种输入。</p>
            </ReadingDrawer>
          </PanelFrame>

          <PanelFrame index={3}>
            <p class={styles.prose}>
              注意力发生之前，表示会先被 LayerNorm（或 RMSNorm）整理一遍。归一化把不同位置、不同层的数值拉回稳定尺度，训练才不容易被个别极大值带跑。
            </p>
            <p class={styles.prose}>
              随后，同一组输入被三个矩阵投影成三种角色。<strong>Q</strong> 是当前位置在寻找什么，<strong>K</strong> 是其他位置如何被找到，<strong>V</strong> 是真正要被聚合的信息。匹配发生在 Q 与 K 之间，内容流动发生在 V 上。
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
              自注意力的计算可以看成一次检索：用当前位置的 Query 去和所有位置的 Key 比较，得到一组权重，再按权重把 Value 加权求和。每个位置都能直接看到整段上下文，这就是 Transformer 不再依赖逐步传递隐状态的原因。
            </p>
            <p class={styles.prose}>
              「多头」是把同一套检索并行做若干次。不同的头可以分出不同子空间：有的偏向相邻句法，有的偏向长程指代，有的偏向标点或分隔。最后把各头的输出拼起来，再做一次线性投影，变回原来的维度。
            </p>

            <Figure caption={<><b>Attention(Q, K, V)。</b> 线宽表示相关性：每个位置按权重聚合其他位置的信息。</>}>
              <AttentionMap />
            </Figure>

            <p class={styles.prose}>
              它的优势很明确：全局依赖、训练可并行、表达灵活。代价也同样明确：标准注意力相对序列长度是近似 O(n²) 的。现代架构用 GQA、滑动窗口、稀疏注意力和 FlashAttention 等方式，降低 KV 缓存或显存访问成本，但「用相关性检索上下文」这件事没有变。
            </p>
            <ReaderButton onClick={() => setDrawer("attention")}>展开阅读：训练更新与现代架构改进</ReaderButton>
            <ReadingDrawer open={drawer() === "attention"} eyebrow="MODERN ATTENTION" title="注意力机制正在如何进化" onClose={() => setDrawer(null)}>
              <p>训练时，注意力输出参与损失计算，梯度会更新 W<sub>Q</sub>、W<sub>K</sub>、W<sub>V</sub> 以及输出投影。</p>
              <p>现代架构通过 GQA、MQA、滑动窗口、稀疏注意力和 FlashAttention 等方式，降低 KV 缓存或显存访问成本。</p>
            </ReadingDrawer>
          </PanelFrame>

          <PanelFrame index={5}>
            <p class={styles.prose}>
              注意力的输出不会覆盖原来的表示。子层结果先与输入相加，再做一次归一化。残差保留刚刚进来的信息，归一化则把数值尺度重新整理，让后面的层能继续稳定计算。
            </p>
            <p class={styles.prose}>
              LayerNorm 会先减去均值再缩放；RMSNorm 更常见于当代大模型，只做均方根缩放，少一次中心化，计算更轻。两者的目标相同：别让深层的激活爆炸或消失。
            </p>

            <Figure caption={<><b>先相加，再整理尺度。</b> 子层学习的是「需要改变什么」，原始输入仍然走捷径留下来。</>}>
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
              注意力解决的是「谁该看谁」。真正改写每个位置内部表示的，是后面的前馈网络。标准做法是一个两层 MLP：先把维度升上去，经过非线性，再压回来。它对每个 Token 独立计算，不看邻居——邻居之间的交流已经由注意力完成。
            </p>
            <p class={styles.prose}>
              MoE 把这一层拆成许多专家。Router 为每个 Token 只选择少数几条路径，总参数可以变得很大，但单次激活的参数保持可控。训练时被选中的专家和 Router 一起更新，负载均衡则避免少数专家抢走所有 Token。
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
              把一层展开来看，残差出现了两次：注意力之后一次，前馈网络之后再一次。公式都是 y = x + F(x)。每一层学习的是增量，而不是把完整表示从头造一遍。
            </p>
            <p class={styles.prose}>
              这对训练很关键。对残差求导时，梯度里有一项恒等于 1。即使子层暂时学不好，信号仍然能沿着捷径回到浅层。这也是 Transformer 可以稳定堆到几十、上百层的原因之一。
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
              一层做完一轮「交流 + 加工」。堆得越深，表示被改写的次数越多。Hidden State 就是这个过程中每一层的中间快照：它还不是最终答案，但已经编码了截至当前层的上下文。
            </p>
            <p class={styles.prose}>
              参数更多的模型通常拥有更多 Layer、更宽的 Hidden State，因而能进行更深、更细的表示变换。生成下一个 Token 时，真正被读出的，往往是最后一层的 Hidden State。
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
              最后一个 Hidden State 经过 LM Head——通常是一次线性投影——变成词表上每个候选的 logits。Softmax 把它们转成概率，采样策略再决定下一个 Token：可以取最大概率，也可以用 temperature、top-k、top-p 保留一点随机性。
            </p>
            <p class={styles.prose}>
              生成就是把这个过程反复执行：新 Token 追加回序列，再走一遍注意力、前馈与采样。输出不必停在文字。同样的 Token 可以被图像解码器、语音模型或控制器接收，变成画面、声音或动作。
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
            <p class={styles.prose}>这是一些优秀的项目/文章：</p>
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
      </div>
    </section>
  );
};
