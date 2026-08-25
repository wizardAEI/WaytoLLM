import { item, type Essay } from "./types";

export const aiHealthcare: Essay = {
  title: "AI 在医疗卫生领域的应用",
  items: [
    item("文章", "Med-PaLM", "https://arxiv.org/abs/2212.13138", "临床知识能不能被大模型编码，Google 把问题写成了论文。"),
    item("文章", "MedHELM", "https://www.nature.com/articles/s41591-025-04151-2", "把评测从通用问答拉回真实医疗任务。"),
    item("项目", "Awesome-LLM-Healthcare", "https://github.com/mingze-yuan/Awesome-LLM-Healthcare", "医学大模型论文索引。"),
  ],
};

export const aiBanking: Essay = {
  title: "银行中的 AI",
  items: [
    item("文章", "BloombergGPT", "https://arxiv.org/abs/2303.17564", "金融语料训的领域模型，500 亿参数。"),
    item("项目", "FinGPT", "https://github.com/AI4Finance-Foundation/FinGPT", "开源金融大模型和研究资料。"),
    item("文章", "On the Opportunities and Risks of Foundation Models", "https://arxiv.org/abs/2108.07258", "基础模型的机会和风险，金融合规可以对照着读。"),
  ],
};

export const aiTelecom: Essay = {
  title: "了解电信行业中的 AI",
  items: [
    item("文章", "On the Opportunities and Risks of Foundation Models", "https://arxiv.org/abs/2108.07258", "关键基础设施那一节，风险写得很直。"),
    item("文章", "RAG 原论文", "https://arxiv.org/abs/2005.11401", "套餐、制度这类事实，得靠检索锁死。"),
    item("项目", "Dify", "https://github.com/langgenius/dify", "工单、知识库、客服助手这类落地，国内常用这套。"),
  ],
};

export const aiLegal: Essay = {
  title: "法律 AI",
  items: [
    item("文章", "LegalBench", "https://arxiv.org/abs/2308.11462", "162 项法律推理任务，按法律人自己的分类摊开。"),
    item("项目", "LegalBench", "https://hazyresearch.stanford.edu/legalbench/", "任务和数据主页。"),
    item("项目", "LawBench", "https://lawbench.opencompass.org.cn/leaderboard", "中文法律能力评测。"),
  ],
};

export const aiGovernment: Essay = {
  title: "政企 AI 需求",
  items: [
    item("文章", "On the Opportunities and Risks of Foundation Models", "https://arxiv.org/abs/2108.07258", "公共部门风险那几节值得单独读。"),
    item("文章", "HELM Safety", "https://crfm.stanford.edu/2024/11/08/helm-safety.html", "安全评测给不了「已经部署」四个字，只能给风险地图。"),
    item("项目", "Awesome-LLMOps", "https://github.com/tensorchord/Awesome-LLMOps", "私有化、审计、观测相关工具可以从这里找。"),
  ],
};

export const aiEducation: Essay = {
  title: "教育行业 AI 应用",
  items: [
    item("文章", "ChatGPT for Good?", "https://doi.org/10.1016/j.lindif.2023.102274", "教育场景的机会和问题：个性化是真的，代写和偏见也是。"),
    item("文章", "ChatGPT Prompt Engineering for Developers", "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", "DeepLearning.AI 短课，教学提示可以照着改。"),
  ],
};

export const aiEcommerce: Essay = {
  title: "电商领域的 AI",
  items: [
    item("文章", "HSTU", "https://arxiv.org/abs/2402.17152", "Meta 的生成式推荐，下一个动作和下一个 Token 用同类骨架。"),
    item("文章", "RAG 原论文", "https://arxiv.org/abs/2005.11401", "价格、库存、材质必须来自商品库，不能让模型编。"),
    item("项目", "LlamaIndex", "https://github.com/run-llama/llama_index", "商品文档、规格书进检索，电商 RAG 常用。"),
  ],
};

export const aiVideo: Essay = {
  title: "AI 视频/AI 漫剧发展",
  items: [
    item("文章", "Video generation models as world simulators", "https://openai.com/index/video-generation-models-as-world-simulators/", "Sora 技术报告：视频模型在学时间和物理。"),
    item("文章", "DiT", "https://arxiv.org/abs/2212.09748", "扩散模型接到 Transformer 上，后面很多视频模型的底盘。"),
    item("项目", "ComfyUI", "https://github.com/comfyanonymous/ComfyUI", "节点式出图出视频，生产线里用得最多的开源工具之一。"),
    item("项目", "HunyuanVideo", "https://github.com/Tencent-Hunyuan/HunyuanVideo", "腾讯开源的视频生成模型。"),
  ],
};
