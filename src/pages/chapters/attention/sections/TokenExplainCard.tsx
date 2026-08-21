import { createSignal, onCleanup, onMount, type Component, type JSX } from "solid-js";
import gsap from "gsap";
import styles from "./TokenExplainCard.module.css";
import { getTokenExplanation, getTokenTone, type BpeToken } from "./bpeTokens";

interface TokenExplainCardProps {
  token: BpeToken;
  index: number;
  total: number;
  anchor: DOMRect | null;
  onClose: () => void;
}

const CARD_MARGIN = 16;

export const TokenExplainCard: Component<TokenExplainCardProps> = (props) => {
  let cardEl: HTMLDivElement | undefined;
  const [style, setStyle] = createSignal<JSX.CSSProperties>({ opacity: 0 });

  onMount(() => {
    const place = () => {
      if (!cardEl) return;
      const rect = cardEl.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const anchor = props.anchor;

      let left: number;
      let top: number;

      if (anchor) {
        const fitsRight = anchor.right + CARD_MARGIN + rect.width <= vw;
        left = fitsRight ? anchor.right + CARD_MARGIN : anchor.left - CARD_MARGIN - rect.width;
        top = anchor.top + anchor.height / 2 - rect.height / 2;
      } else {
        left = vw / 2 - rect.width / 2;
        top = vh / 2 - rect.height / 2;
      }

      left = Math.min(Math.max(left, CARD_MARGIN), Math.max(CARD_MARGIN, vw - rect.width - CARD_MARGIN));
      top = Math.min(Math.max(top, CARD_MARGIN), Math.max(CARD_MARGIN, vh - rect.height - CARD_MARGIN));

      setStyle({ left: `${left}px`, top: `${top}px`, opacity: 1 });
    };

    place();
    window.addEventListener("resize", place);

    gsap.fromTo(
      cardEl!,
      { opacity: 0, scale: 0.94, filter: "blur(8px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.35, ease: "power2.out" }
    );

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose();
    };
    document.addEventListener("keydown", handleKey);

    onCleanup(() => {
      window.removeEventListener("resize", place);
      document.removeEventListener("keydown", handleKey);
      gsap.killTweensOf(cardEl!);
    });
  });

  const explanation = () => getTokenExplanation(props.token);
  const tone = () => getTokenTone(props.token);

  return (
    <div class={styles.overlay} onClick={() => props.onClose()}>
      <div
        ref={cardEl}
        class={styles.card}
        style={style()}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Token "${props.token.text}" 说明`}
      >
        <button type="button" class={styles.closeBtn} onClick={() => props.onClose()} aria-label="关闭说明卡片">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <div class={styles.headRow}>
          <span
            class={styles.tokenChip}
            style={{
              "background-color": tone().bg,
              "border-color": tone().border,
              color: tone().text,
            }}
          >
            {props.token.text}
          </span>
          <span class={styles.badge}>
            Token {props.index + 1} / {props.total}
          </span>
        </div>

        <p class={styles.lead}>{explanation().lead}</p>
        <p class={styles.detail}>{explanation().detail}</p>

        <div class={styles.stepsBlock}>
          <p class={styles.stepsTitle}>词表是怎么训练出来的</p>
          <ol class={styles.stepsList}>
            <li>从单字节 / 单字符出发,构建最初的词表</li>
            <li>统计语料中相邻符号对的出现频次,合并频次最高的一对</li>
            <li>重复合并,直到词表达到设定规模(通常 5 万 ~ 20 万)</li>
          </ol>
        </div>

        <figure class={styles.figure}>
          <img
            src="/tokenizer-example.png"
            alt="OpenAI Tokenizer 工具对 “ATTENTION IS ALL YOU NEED” 的分词结果"
            class={styles.screenshot}
            loading="lazy"
          />
          <figcaption class={styles.caption}>
            OpenAI Tokenizer 对同一句话的真实分词结果——同样切成 6 个 Token,与本页一致。
          </figcaption>
        </figure>
      </div>
    </div>
  );
};
