import { item, type Essay } from "./types";

export const postTraining: Essay = {
  title: "模型后训练",
  items: [
    item("项目", "TRL", "https://github.com/huggingface/trl", "Hugging Face 的 SFT / RLHF / DPO 训练库。"),
    item("项目", "LLaMA-Factory", "https://github.com/hiyouga/LLaMA-Factory", "中文社区常用的微调套件，界面和脚本都全。"),
    item("项目", "Axolotl", "https://github.com/axolotl-ai-cloud/axolotl", "用 YAML 配微调，SFT 和偏好训练都能跑。"),
    item("文章", "InstructGPT", "https://arxiv.org/abs/2203.02155", "对齐过的小模型，人工评估可以压过更大的未对齐模型。"),
    item("文章", "FLAN", "https://arxiv.org/abs/2210.11416", "多任务指令微调，把「会续写」拉向「会办事」。"),
    item("文章", "DPO", "https://arxiv.org/abs/2305.18290", "不用单独训奖励模型，直接从偏好对里学。"),
    item("文章", "DeepSeek-R1", "https://arxiv.org/abs/2501.12948", "用强化学习把推理轨迹打出来，后训练的新主线。"),
    item("文章", "Instruction Tuning 阶段综述", "https://yaofu.notion.site/June-2023-A-Stage-Review-of-Instruction-Tuning-f59dbfc36e2d4e12a33443bd6b2012c2", "Yao Fu 把指令微调按阶段拆开讲。"),
  ],
};

export const quantization: Essay = {
  title: "模型量化",
  items: [
    item("项目", "bitsandbytes", "https://github.com/bitsandbytes-foundation/bitsandbytes", "8 bit / 4 bit 量化，QLoRA 常用后端。"),
    item("项目", "llm-compressor", "https://github.com/vllm-project/llm-compressor", "vLLM 这边的量化与压缩工具。"),
    item("项目", "llama.cpp", "https://github.com/ggerganov/llama.cpp", "GGUF 量化，端侧和本地部署最常见。"),
    item("文章", "GPTQ", "https://arxiv.org/abs/2210.17323", "用校准数据补量化误差，权重-only 的常用方法。"),
    item("文章", "AWQ", "https://arxiv.org/abs/2306.00978", "按激活敏感度保护通道。"),
    item("文章", "QLoRA", "https://arxiv.org/abs/2305.14314", "4 bit 底座 + LoRA，很多业务微调走这条。"),
    item("项目", "Awesome-LLM-Compression", "https://github.com/HuangOwen/Awesome-LLM-Compression", "压缩和量化论文索引。"),
  ],
};
