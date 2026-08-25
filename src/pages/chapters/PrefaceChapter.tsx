import type { Component, JSX } from "solid-js";
import styles from "./PrefaceChapter.module.css";

const Prose: Component<{ children: JSX.Element }> = (props) => (
  <p class={styles.prose}>{props.children}</p>
);

export const PrefaceChapter: Component = () => (
  <article class={styles.preface}>
    <header class={styles.intro} data-reveal>
      <p class={styles.eyebrow}>WAY TO LLM</p>
      <h1>前言</h1>
    </header>

    <section class={styles.section} data-reveal>
      <Prose>
        最近看了一个 B 站视频，讲从游戏的视角，讲这四年 AI 进步了多少。
      </Prose>
      <Prose>
        19 年的 GPT3.5，上下文只有可怜的几 K，换到现在的 Agent 上，应该连提示词都塞不进去。用它来生成的游戏只有一个抽象的草图界面；到 26 年的 GPT5.6，百万上下文，已经可以做出具备优秀阴影、音效和物理引擎的赛车游戏。大模型每一年的进步都是指数级别的，从模型本身，到周边的生态变化，都以月为单位，不断发生着变化。
      </Prose>
      <Prose>
        AI 带给我的感受是“剧烈又老套”。剧烈无需多言，大家应该每天都在感受着变化。在 25 年 10 月份之前，我还不全相信 AI 写的代码，一个月后，我已经不再手写代码了。
      </Prose>
      <Prose>
        而老套则是指大模型的基础逻辑仿佛亘古不变，自诞生起来，模型的基础逻辑就没有变过，遇到的问题也仍然是那些。我在前司三年前就在做的 RAG，Context 工程，现在换了两家公司，依然在做。
      </Prose>
      <Prose>
        这中间自然有很多不小的差距和不断进步的架构设计，但上游<strong>模型幻觉</strong>、<strong>指令遵循</strong>的问题、下游需要<strong>本地知识库</strong>，<strong>私有化大模型</strong>的需求却一直没变。相信每一个在基础一线的同学，都做过一个类似“智能小智”的项目，只不过 23 年的“智”，是智能对话，26 年的“智”，则是智能体，智能办公。
      </Prose>
    </section>

    <section class={styles.section} data-reveal>
      <h2>LLM 生态更迭</h2>
      <Prose>
        从职业角度看，这两年的职业变化很快。很多一线大厂都已经开始用 AI “降本增效”，我的前司，做模型平台的小组，所有的前端同学都已经转岗到了后端，也新增了如“Agent 架构开发”，“FDE”等新兴岗位。小厂变化同样明显，之前几周的工作，现在要压缩到一周去做，方案评审，Code Review 好像已经变成了“古法编程”时代遗留下来的工艺一环。我也曾震惊于新招来的实习生已经完全不会写代码，但也能通过和 Agent 反复沟通，一天完成之前几周的工作。
      </Prose>
      <Prose>
        到了甲方这边，变化也很明显。去年，我短暂的体验了一把 OPC，去和工业界、教育界和服务行业的甲方打交道。从 26 年初的小龙虾风潮刮遍全中国后，越来越多传统行业也开始尝试了解 AI。理由各不相同，有些想通过 AI 提效，或是增加新的增长曲线，有的则是单纯怕落后于其他竞对，错过新的机会。
      </Prose>
      <Prose>
        在形式上，大家也都是摸着石头过河的阶段。B 端不知道自己需要什么，看到一个新名词，就想要试试，结果折腾半天，还不如豆包更新的一个新功能好用。还有一些甲方，因为数据安全等问题，想用上 AI 又不敢用。我之前就遇到一个化妆品类厂商，CEO 亲自带队来听我们的 AI 落地课程，但是真正到公司内部才发现，从人士到财务，都不允许用 AI 去处理数据，怕数据泄露。员工整体上对 AI 能做什么了解非常有限，甚至没有自己家小孩用得流利。
      </Prose>
      <Prose>
        技术层面上，基模厂商基本上都已经适配到了 100M 上下文，omini 全模态模型开始流行（minimax-m3 已支持全模态输入和输出的能力），能力上思考模式变成标配，Agentic 后训练也成为了每个厂商的技术博客中的常客。包括梁文峰投资人会议上一直在强调的大模型持续记忆能力，可能会成为下一个各大基模厂商押注的点。种种现象都在说明模型基座正在以每半年一个全新高度，甚至更快的速度全速狂奔中。
      </Prose>
      <Prose>
        到工程层面，各类技术层层叠加：从 Prompt 工程开始，LangChain 等大模型集成套件开始流行；到上下文工程，记忆管理，开始构造 PydanticAI LangGraph Agent 雏形；Harness 概念的提出，也催发了各种如 Hermes、Pi 架构，Co-Work 模式变得越发成熟，让大众开始接受。
      </Prose>
      <Prose>
        这中间，冒出很多生态概念，如 RAG，MCP，Skills，Scheduler，Agent Gateway 等，也衍生出一些深度领域的 Agent 概念，如 DeepResearch，Evolve，Agent Loop。
      </Prose>
      <Prose>
        几乎每一次上游技术的更新，都会促发下游从工程到应用出现新的概念和组织形式。而这一切，从 GPT 时刻开始，都只发生在这短短的三四年间。
      </Prose>
    </section>

    <section class={styles.section} data-reveal>
      <h2>WaytoLLM 项目</h2>
      <Prose>
        基于上言，整个大模型的发展可以说是日新月异，这个月正在爆火的概念下个月也许就会被推翻，新的观点和架构也在层出不穷。这就造成入门的同学很难从一个角度出发，快速了解整个行业全貌，因为也许这个角度就是错的🤣；另一方面，深入在某个领域的技术或业务同学，也需要不断的更新知识，来适应不断更迭的概念。
      </Prose>
      <Prose>
        此项目正是想从整个生态中找到真正有价值和关键的路径，从而帮助大家串联起整个大模型生态。项目将从模型架构本身，到现有技术架构，项目落地和行业场景，由浅（作者不一定能入深😂，也希望大家一起共建补充）的讲解“大模型之路”。
      </Prose>
    </section>

    <section class={styles.section} data-reveal>
      <h2>适合人群</h2>
      <Prose>
        本指南适合的人群很广，如果你是刚入门的 AI 技术小白或是业务同学，可以从一些基础章节开始平滑学习大模型。对比较公知的内容，章节会给出概览和总结，并挑选网络上优秀的项目和文章，方便进一步学习；而一些关键的内容，如 ReAct 等概念，则会深入讲解概念本身以及如何落地到框架场景。
      </Prose>
      <Prose>
        对于专业领域的同学，作者会从实际接触过的项目出发，加之其他优秀作者的落地经验，从技术到业务多角度出发，把教育、制造、电商等各类场景说明白。
      </Prose>
      <Prose>
        同时项目也会实时跟进最新的技术博客和框架解析，方便希望快速跟进 LLM 生态的同学能更加高效的更新知识储备。
      </Prose>
    </section>

    <section class={styles.section} data-reveal>
      <h2>最后</h2>
      <Prose>
        摊子铺的比较大，为了保持快速更新，文章会以类似 awesome projects（优秀的项目和文章合集） 加深度解析的形式串联。集百家之长，也方便读者扩展阅读，拓宽更多视角。
      </Prose>
      <Prose>
        同时作为开源项目，随时欢迎大家一起贡献有价值的项目和学习资料，一起开启大模型时代。
      </Prose>
      <p class={styles.signed}>写于 26 年 9 月。</p>
    </section>
  </article>
);
