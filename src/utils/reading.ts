const CHARS_PER_MINUTE = 400;

/** GPT3.5、LangChain、Co-Work、minimax-m3 这类英文单词 / 专名各算 1 */
const LATIN_TOKEN = /[A-Za-z][A-Za-z0-9]*(?:[.\-][A-Za-z0-9]+)*/g;

export function countChars(text: string): number {
  return Array.from(text.replace(LATIN_TOKEN, "x").replace(/\s+/g, "")).length;
}

export function estimateMinutes(chars: number): number {
  return Math.max(1, Math.round(chars / CHARS_PER_MINUTE));
}

export function formatReading(text: string): string {
  const chars = countChars(text);
  const minutes = estimateMinutes(chars);
  return `共 ${chars} 字，预计阅读 ${minutes} 分钟`;
}

export function articlePlainText(root: ParentNode): string {
  const scoped = root.querySelector("[data-reading-root]");
  const el = (scoped ?? root) as HTMLElement;
  return (el.innerText ?? el.textContent ?? "").trim();
}
