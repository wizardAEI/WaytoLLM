// "ATTENTION IS ALL YOU NEED" 在 GPT-5.x / O1/O3 分词器下的真实拆分结果(6 个 Token)
// 参考:public/tokenizer-example.webp(OpenAI Tokenizer 工具截图)

export interface BpeToken {
  text: string;
  isFragment: boolean;
  groupWord?: string;
  toneIndex: number;
}

export interface TokenTone {
  bg: string;
  border: string;
  text: string;
}

export const TOKEN_TONES: TokenTone[] = [
  { bg: "#eef2fb", border: "#c9d9f5", text: "#3355a8" },
  { bg: "#eaf6ee", border: "#c3e6cf", text: "#2c7a49" },
  { bg: "#fdf3e7", border: "#f3ddb8", text: "#a06a12" },
  { bg: "#fbebe9", border: "#f0c9c4", text: "#af4136" },
  { bg: "#eee9fb", border: "#d6c9f0", text: "#5b3fa0" },
  { bg: "#eaf3f6", border: "#c3e0e6", text: "#1f7488" },
];

export const BPE_TOKENS: BpeToken[] = [
  { text: "ATT", isFragment: true, groupWord: "ATTENTION", toneIndex: 0 },
  { text: "ENTION", isFragment: true, groupWord: "ATTENTION", toneIndex: 1 },
  { text: "IS", isFragment: false, toneIndex: 2 },
  { text: "ALL", isFragment: false, toneIndex: 3 },
  { text: "YOU", isFragment: false, toneIndex: 4 },
  { text: "NEED", isFragment: false, toneIndex: 5 },
];

export function getTokenTone(token: BpeToken): TokenTone {
  return TOKEN_TONES[token.toneIndex % TOKEN_TONES.length];
}

export interface TokenExplanation {
  lead: string;
  detail: string;
}

export function getTokenExplanation(token: BpeToken): TokenExplanation {
  if (token.isFragment && token.groupWord) {
    return {
      lead: `"${token.groupWord}" 没有被词表直接收录`,
      detail: `分词器使用字节对编码(BPE):从单字节/单字符出发,依据训练语料中相邻符号对的出现频次,逐轮合并成更长的子词,直到词表达到设定规模。"${token.groupWord}" 整体出现的频次不够高,没能换来一个独立编号,于是被拆成了两段更常见的子词——每一段都能在词表里查到自己的 ID。`,
    };
  }

  return {
    lead: `"${token.text}" 是一个高频独立词`,
    detail: `像 "${token.text}" 这样的常见短词,在训练语料中出现次数极高,词表在合并的早期阶段就为它分配了专属编号,因此不再需要继续拆分,可以直接作为一个 Token 使用。`,
  };
}
