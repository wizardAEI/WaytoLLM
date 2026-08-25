import { item, type Essay } from "./types";

export const privateDeployment: Essay = {
  title: "私有化部署",
  items: [
    item("项目", "vLLM", "https://github.com/vllm-project/vllm", "高吞吐推理引擎，PagedAttention 管 KV cache，接口跟 OpenAI 兼容。"),
    item("项目", "llama.cpp", "https://github.com/ggerganov/llama.cpp", "C/C++ 本地推理，CPU 也能跑，量化格式多。"),
    item("项目", "Ollama", "https://github.com/ollama/ollama", "本地下载并跑开源模型，命令行和本地 API 都简单。"),
    item("项目", "Hugging Face Transformers", "https://github.com/huggingface/transformers", "权重、tokenizer、模型卡片的通用入口。"),
    item("文章", "LLaMA", "https://arxiv.org/abs/2302.13971", "Meta 2023 年把基础模型权重开出来，后面私有化这条路才走得通。"),
    item("文章", "Llama 2", "https://arxiv.org/abs/2307.09288", "可商用的开源对话模型，很多内部部署的起步权重。"),
    item("项目", "Awesome-LLM", "https://github.com/Hannibal046/Awesome-LLM", "开源模型、论文、推理工具的总索引。"),
    item("项目", "Awesome-Chinese-LLM", "https://github.com/HqWu-HITCS/Awesome-Chinese-LLM", "可私有化的中文模型整理。"),
  ],
};

export const llmGateway: Essay = {
  title: "大模型网关",
  items: [
    item("项目", "LiteLLM", "https://github.com/BerriAI/litellm", "一份 OpenAI SDK，转接多家模型和本地服务。"),
    item("项目", "One API", "https://github.com/songquanpeng/one-api", "国内常用的统一网关，管密钥、渠道和额度。"),
    item("项目", "New API", "https://github.com/Calcium-Ion/new-api", "One API 的活跃分支，功能和界面都更勤快。"),
    item("项目", "vLLM", "https://github.com/vllm-project/vllm", "网关后面最常见的推理后端。"),
    item("文章", "PagedAttention", "https://arxiv.org/abs/2309.06180", "vLLM 那篇论文：KV cache 怎么分页，吞吐从哪来。"),
    item("项目", "Awesome-LLM-Inference", "https://github.com/DefTruth/Awesome-LLM-Inference", "推理和服务相关论文整理。"),
    item("项目", "Awesome-LLMOps", "https://github.com/tensorchord/Awesome-LLMOps", "服务、观测、平台工具索引。"),
  ],
};

export const llmops: Essay = {
  title: "LLMOps",
  items: [
    item("项目", "Langfuse", "https://github.com/langfuse/langfuse", "Prompt、链路、评分的开源观测。"),
    item("项目", "Phoenix", "https://github.com/Arize-ai/phoenix", "追踪和评测，偏 embedding / RAG 排查。"),
    item("项目", "Promptfoo", "https://github.com/promptfoo/promptfoo", "用测试用例回归 Prompt 和模型。"),
    item("项目", "Awesome-LLMOps", "https://github.com/tensorchord/Awesome-LLMOps", "LLM 工程工具地图。"),
    item("文章", "HELM", "https://arxiv.org/abs/2211.09110", "别只报一个分数：准确率、校准、鲁棒、偏见一起看。"),
    item("文章", "Prompt Engineering", "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/", "Lilian Weng 把 Prompt 写成可讨论的技术，不是玄学。"),
  ],
};

export const onDevice: Essay = {
  title: "端侧模型",
  items: [
    item("项目", "llama.cpp", "https://github.com/ggerganov/llama.cpp", "端侧推理的事实起点，量化好、能上 CPU。"),
    item("项目", "Ollama", "https://github.com/ollama/ollama", "笔记本上跑本地模型最省事的一层。"),
    item("项目", "MLC LLM", "https://github.com/mlc-ai/mlc-llm", "把模型编译到手机、浏览器、各种后端。"),
    item("文章", "GPTQ", "https://arxiv.org/abs/2210.17323", "权重量化，4 bit 能塞进消费级显存的常见路线。"),
    item("文章", "AWQ", "https://arxiv.org/abs/2306.00978", "保护对激活敏感的通道，少伤真正在干活的权重。"),
  ],
};

export const denseMoe: Essay = {
  title: "Dense & MoE 选型",
  items: [
    item("文章", "Switch Transformers", "https://arxiv.org/abs/2101.03961", "稀疏 MoE 怎么扩到万亿参数，Google 把骨架写清楚了。"),
    item("文章", "Mixtral of Experts", "https://arxiv.org/abs/2401.04088", "两个专家激活的开源 MoE，后来很多选型会拿它当参照。"),
    item("文章", "DeepSeek-V2", "https://arxiv.org/abs/2405.04434", "经济型 MoE，MLA 和稀疏算力绑在一起讲。"),
    item("文章", "DeepSeek-V3", "https://arxiv.org/abs/2412.19437", "更大的 MoE 技术报告，训练和推理成本写得很细。"),
    item("项目", "vLLM", "https://github.com/vllm-project/vllm", "Dense 和 MoE 都能服，选型之后实际跑负载的地方。"),
  ],
};
