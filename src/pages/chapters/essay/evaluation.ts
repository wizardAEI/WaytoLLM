import { item, type Essay } from "./types";

export const safetyEval: Essay = {
  title: "安全评测",
  items: [
    item("项目", "garak", "https://github.com/NVIDIA/garak", "探测提示注入、泄漏、越狱的扫描器。"),
    item("项目", "NeMo Guardrails", "https://github.com/NVIDIA/NeMo-Guardrails", "给模型对话加护栏。"),
    item("项目", "Awesome LLM Security", "https://github.com/corca-ai/awesome-llm-security", "安全工具和资料索引。"),
    item("文章", "HELM Safety", "https://crfm.stanford.edu/2024/11/08/helm-safety.html", "标准化安全评测。结论写得很克制：测的是风险，不是证明安全。"),
    item("文章", "SafetyBench", "https://arxiv.org/abs/2309.07045", "中英安全选择题基准。"),
  ],
};

export const capabilityRegression: Essay = {
  title: "通用能力回归",
  items: [
    item("项目", "lm-evaluation-harness", "https://github.com/EleutherAI/lm-evaluation-harness", "跑公开基准最常用的那套。"),
    item("项目", "OpenCompass", "https://github.com/open-compass/opencompass", "国内常用评测套件，中文任务比较全。"),
    item("项目", "Chatbot Arena", "https://lmarena.ai", "匿名对战，看人更喜欢哪个模型。"),
    item("文章", "MMLU", "https://arxiv.org/abs/2009.03300", "一度代表「通用能力」的那张卷。"),
    item("文章", "HELM", "https://arxiv.org/abs/2211.09110", "同一套场景，准确率以外的指标一起报。"),
    item("项目", "LiveBench", "https://livebench.ai", "题会换，想抗住刷榜和污染。"),
  ],
};

export const scenarioTesting: Essay = {
  title: "场景测试",
  items: [
    item("项目", "Ragas", "https://github.com/explodinggradients/ragas", "RAG 的忠实度、相关度一类指标。"),
    item("项目", "DeepEval", "https://github.com/confident-ai/deepeval", "按测试用例测 LLM 应用。"),
    item("项目", "Promptfoo", "https://github.com/promptfoo/promptfoo", "场景断言、回归、红队都可以写进配置。"),
    item("项目", "BIG-bench", "https://github.com/google/BIG-bench", "任务很杂，适合想场景怎么出题。"),
    item("文章", "HELM", "https://arxiv.org/abs/2211.09110", "先有 scenario，再谈 metric。"),
  ],
};

export const evalDatasets: Essay = {
  title: "测试集从哪来，如何维护?",
  items: [
    item("项目", "HELM", "https://github.com/stanford-crfm/helm", "场景、指标、模型拆开配，评测集怎么组织可以看它。"),
    item("项目", "Argilla", "https://github.com/argilla-io/argilla", "标数据、管数据、看标注质量。"),
    item("文章", "FineWeb", "https://arxiv.org/abs/2406.17557", "网页语料怎么过滤、去重。评测集也需要类似的去污。"),
    item("文章", "Pythia", "https://arxiv.org/abs/2304.01373", "可复现实验怎么依赖数据和检查点。"),
  ],
};
