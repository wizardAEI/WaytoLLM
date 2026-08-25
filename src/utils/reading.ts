const CHARS_PER_MINUTE = 400;

export function countChars(text: string): number {
  return Array.from(text.replace(/\s+/g, "")).length;
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
  return Array.from(root.querySelectorAll("[data-reading]"))
    .map((node) => node.textContent ?? "")
    .join("");
}
