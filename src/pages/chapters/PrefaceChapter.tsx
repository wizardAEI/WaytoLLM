import { For, Show, createSignal, onCleanup, onMount, type Component, type JSX } from "solid-js";
import styles from "./PrefaceChapter.module.css";
import { ArticleIntro } from "./ArticleIntro";
import { articlePlainText, formatReading } from "../../utils/reading";

const TOC = [
  { id: "opening", title: "开篇" },
  { id: "ecosystem", title: "LLM 生态更迭" },
  { id: "project", title: "WaytoLLM 项目" },
  { id: "audience", title: "适合人群" },
  { id: "closing", title: "最后" },
] as const;

type TocId = (typeof TOC)[number]["id"];

const Prose: Component<{ children: JSX.Element }> = (props) => (
  <p class={styles.prose}>{props.children}</p>
);

function formatUrlHint(href: string) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/$/, "");
    return `${host}${path}${url.search}${url.hash}`;
  } catch {
    return href;
  }
}

const PrefaceFigure: Component<{
  src: string;
  alt: string;
  caption: string;
  href?: string;
}> = (props) => {
  const image = () => (
    <img
      class={styles.figureImage}
      src={props.src}
      alt={props.alt}
      loading="lazy"
      decoding="async"
    />
  );

  return (
    <figure class={styles.figure} data-reveal>
      <Show when={props.href} fallback={image()} keyed>
        {(href) => (
          <a
            class={styles.figureLink}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {image()}
            <span class={styles.figureHint} aria-hidden="true">
              <span class={styles.figureHintUrl}>{formatUrlHint(href)}</span>
              <svg
                class={styles.figureHintIcon}
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M4.75 2.5H2.75a1 1 0 0 0-1 1v5.5a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1V7.25M6.75 2.5h2.75V5.25M5.75 6.25 9.5 2.5"
                  stroke="currentColor"
                  stroke-width="1.2"
                  stroke-linejoin="miter"
                />
              </svg>
            </span>
          </a>
        )}
      </Show>
      <figcaption>{props.caption}</figcaption>
    </figure>
  );
};

const TocNav: Component<{
  active: TocId;
  onJump: (id: TocId) => void;
  variant: "rail" | "inline";
}> = (props) => (
  <nav class={props.variant === "rail" ? styles.tocRail : styles.tocInline} aria-label="文章目录">
    <p class={styles.tocKicker}>目录</p>
    <ol class={styles.tocList}>
      <For each={TOC}>
        {(item, index) => (
          <li>
            <a
              href={`#${item.id}`}
              class={styles.tocLink}
              classList={{ [styles.tocLinkActive]: props.active === item.id }}
              aria-current={props.active === item.id ? "location" : undefined}
              onClick={(event) => {
                event.preventDefault();
                props.onJump(item.id);
              }}
            >
              <span class={styles.tocIndex}>{String(index() + 1).padStart(2, "0")}</span>
              <span class={styles.tocTitle}>{item.title}</span>
            </a>
          </li>
        )}
      </For>
    </ol>
  </nav>
);

export const PrefaceChapter: Component = () => {
  const [active, setActive] = createSignal<TocId>(TOC[0].id);
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
    if (TOC.some((item) => item.id === hash)) {
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

        let next: TocId = TOC[0].id;
        let best = 0;
        TOC.forEach((item) => {
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

    TOC.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    onCleanup(() => observer.disconnect());
  });

  return (
    <article class={styles.preface}>
      <div ref={bindBody} class={styles.body}>
        <ArticleIntro title="前言" meta={readingMeta()} />

        <TocNav active={active()} onJump={jumpTo} variant="inline" />

        <div data-reading-root>
          <section id="opening" class={styles.section} data-reveal>
            <h2 class={styles.srOnly}>开篇</h2>
            <Prose>
              最近看了一个 B 站视频，讲从游戏的视角，这四年 AI 进步了多少。
            </Prose>
            <Prose>
              19 年的 GPT3.5，上下文只有可怜的几 K，换到现在的 Agent 上，应该连提示词都塞不进去。用它来生成的游戏只有一个抽象的草图界面；到 26 年的 GPT5.6，百万上下文，已经可以做出具备优秀阴影、音效和物理引擎的赛车游戏。可以看出，大模型每一年的进步都是指数级别的，从模型本身，到周边的生态变化，都以月为单位在快速迭代。
            </Prose>
            <PrefaceFigure
              src="/preface/kart-royale.webp"
              alt="Claude Agent 做出的 Kart Royale 赛车游戏截图"
              caption="Claude Opus 5 Agent 做出的赛车游戏"
              href="https://github.com/ryancampbell/kart-royale"
            />

            <Prose>
              于是我萌发了做一个开源项目的想法，囊括整个 LLM 生态中真正有价值和关键的路径，帮助大家串联起整个大模型生态，名称就叫做 WaytoLLM。
            </Prose>
            <Prose>
              作为前言，本文先和大家分享下四年来见到的大模型历程。
            </Prose>
          </section>

          <section id="ecosystem" class={styles.section} data-reveal>
            <h2>行业变化</h2>
            <Prose>
              从职业角度看，很多一线大厂都已经开始用 AI “降本增效”。我的前司，做模型平台的小组，所有的前端同学都已经转岗到了后端，也新增了如“Agent 架构开发”，“FDE”等新兴岗位。小厂变化同样明显，之前几周的工作，现在要压缩到一周去做，方案评审，Code Review 好像已经变成了“古法编程”时代遗留下来的工艺一环。我也曾震惊于新招来的实习生已经完全不会写代码，但也能通过和 Agent 反复沟通，一天完成之前几周的工作。
            </Prose>
            <h2>B 端</h2>
            <Prose>
              去年，我短暂的体验了一把 OPC，去和工业界、教育界和服务行业的甲方打交道。从 26 年初的小龙虾风潮刮遍全中国后，越来越多传统行业也开始尝试了解 AI。理由各不相同，有些想通过 AI 提效，或是增加新的增长曲线，有的则是单纯怕落后于其他竞对，错过新的机会。
            </Prose>
            <Prose>
              在形式上，大家也都是摸着石头过河的阶段。B 端不知道自己需要什么，看到一个新名词，就想要试试，结果折腾半天，还不如豆包更新的一个新功能好用。还有一些甲方，因为数据安全等问题，想用上 AI 又不敢用。我之前就遇到一个化妆品类厂商，CEO 亲自带队来听我们的 AI 落地课程，但是真正到公司内部才发现，从人事到财务，都不允许用 AI 去处理数据，怕数据泄露。员工整体上对 AI 能做什么了解非常有限，甚至没有自己家小孩用得流利。
            </Prose>
            <h2>技术层面</h2>
            <Prose>
              回望 23年时，上下文 128k 已经是旗舰模型才能达到的高度，第一个大火的多模态模型 GPT-4o 已经是 24 年的事情。
            </Prose>
            <Prose>
              但到了 26 年伊始，基模厂商基本上都已经适配到了 100M 上下文，omini 全模态模型开始流行（minimax-h3 已支持全模态输入和输出的能力），能力上思考模式变成标配，Agentic 后训练也成为了每个厂商的技术博客中的常客。包括梁文峰投资人会议上一直在强调的大模型持续记忆能力，可能会成为下一个各大基模厂商押注的点。种种现象都在说明模型基座正在以每半年一个全新高度，甚至更快的速度全速狂奔中。
            </Prose>
            <Prose>
              到工程层面，各类技术层层叠加：从 Prompt 工程开始，LangChain 等大模型集成套件开始流行；到上下文工程，记忆管理，开始构造 PydanticAI LangGraph Agent 雏形；Harness 概念的提出，也催发了各种如 Hermes、Pi 架构，Co-Work 模式变得越发成熟，让大众开始接受。
            </Prose>
            <Prose>
              这中间，冒出很多生态概念，如 RAG，MCP，Skills，Scheduler，Agent Gateway 等，也衍生出一些深度领域的 Agent 概念，如 DeepResearch，Evolve，Agent Loop。
            </Prose>
            <PrefaceFigure
              src="/preface/kimi-k3-attnres.webp"
              alt="Kimi K3 使用 Agent Loop 优化 AttnRes 内核的加速曲线"
              caption="Kimi K3 使用 Agent Loop 进行 AttnRes 内核优化"
              href="https://www.kimi.com/blog/kimi-k3"
            />
            <Prose>
              几乎每一次上游技术的更新，都会促发下游从工程到应用出现新的概念和组织形式。而这一切，从 GPT 时刻开始，都只发生在这短短的三四年间。
            </Prose>
          </section>

          <section id="project" class={styles.section} data-reveal>
            <h2>WaytoLLM 项目</h2>
            <Prose>
              基于上言，整个大模型的发展可以说日新月异，这个月正在爆火的概念下个月也许就会被推翻，新的观点和架构也在层出不穷。这就造成入门的同学很难从一个角度出发，快速了解整个行业全貌，因为也许这个角度过两个月就又过时了；另一方面，深入在某个领域的技术或业务同学，也需要不断的更新知识，来适应不断更迭的概念。
            </Prose>
            <Prose>
              此项目正是想从整个生态中抽丝剥茧，帮助大家由浅入深地探索“大模型之路”。
            </Prose>
            <PrefaceFigure
              src="/preface/gpt35-moment.webp"
              alt="早期 ChatGPT 对话界面，用户请模型写一封介绍自己的短信"
              caption="GPT3.5 时刻 - OpenAI 给出的官方示例"
              href="https://openai.com/index/chatgpt/"
            />
          </section>

          <section id="audience" class={styles.section} data-reveal>
            <h2>适合人群</h2>
            <Prose>
              本指南适合的人群很广，如果你是刚入门的 AI 技术小白或是业务同学，可以从一些基础章节开始平滑学习大模型。对比较公知的内容，章节会给出概览和总结，并挑选网络上优秀的项目和文章，方便进一步学习；而一些关键的内容，如 ReAct 等概念，则会深入讲解概念本身以及如何落地到框架场景。
            </Prose>
            <Prose>
              对于专业领域的同学，作者会从实际接触过的项目出发，加之其他优秀作者的落地经验，从技术到产品多角度展开，把办公、科研、教育、制造等各类场景呈现给大家。
            </Prose>
            <Prose>
              同时项目也会实时跟进最新的技术博客和框架解析，方便同学能更加高效的更新知识储备。
            </Prose>
          </section>

          <section id="closing" class={styles.section} data-reveal>
            <h2>最后</h2>
            <Prose>
              摊子铺的比较大，为了保持快速更新，文章会以类似 awesome projects（优秀的项目和文章合集） 加深度解析的形式串联。集百家之长，也方便读者扩展阅读，拓宽更多视角。
            </Prose>
            <Prose>
              同时作为开源项目，随时欢迎大家提供宝贵的项目和学习资料，一起共建！
            </Prose>
            <p class={styles.signed}>写于 26 年 9 月。</p>
          </section>
        </div>
      </div>

      <TocNav active={active()} onJump={jumpTo} variant="rail" />
    </article>
  );
};
