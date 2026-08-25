import { item, type Essay } from "./types";

export const ragContext: Essay = {
  title: "RAG 与上下文工程",
  items: [
    item("项目", "LlamaIndex", "https://github.com/run-llama/llama_index", "文档切分、检索、组装上下文的常用框架。"),
    item("项目", "LangChain", "https://github.com/langchain-ai/langchain", "检索链、重排、引用这一套组件最多。"),
    item("项目", "Haystack", "https://github.com/deepset-ai/haystack", "偏搜索和 RAG 流水线，组件边界比较清楚。"),
    item("项目", "Qdrant", "https://github.com/qdrant/qdrant", "向量库，过滤和 payload 比较好用。"),
    item("文章", "RAG 原论文", "https://arxiv.org/abs/2005.11401", "Lewis 等人 2020 年把检索写进生成。"),
    item("文章", "Lost in the Middle", "https://arxiv.org/abs/2307.03172", "长上下文里，中间的证据最容易被模型丢掉。"),
    item("文章", "The Illustrated Retrieval Transformer", "https://jalammar.github.io/illustrated-retrieval-transformer/", "Jay Alammar 用图把检索怎么进生成讲清楚。"),
    item("文章", "Prompt Engineering", "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/", "窗口里塞什么、怎么排，比换 embedding 更常出事。"),
  ],
};

export const agentFrameworks: Essay = {
  title: "Agent 与 ReAct",
  items: [
    item("项目", "LangGraph", "https://github.com/langchain-ai/langgraph", "把 Agent 循环做成状态图，方便停、重试、人工接管。"),
    item("项目", "AutoGen", "https://github.com/microsoft/autogen", "多 Agent 对话，微软那条线。"),
    item("项目", "Dify", "https://github.com/langgenius/dify", "工作流 + RAG + Agent 的开源套件，国内用得多。"),
    item("项目", "CrewAI", "https://github.com/crewAIInc/crewAI", "按角色组一队 Agent，上手快。"),
    item("文章", "ReAct", "https://arxiv.org/abs/2210.03629", "先想再动手，几乎所有 Agent 框架的骨架。"),
    item("文章", "LLM Powered Autonomous Agents", "https://lilianweng.github.io/posts/2023-06-23-agent/", "规划、记忆、工具三块，现在读仍然清楚。"),
    item("文章", "Chain-of-Thought", "https://arxiv.org/abs/2201.11903", "让模型把中间步骤写出来。"),
    item("文章", "Tree of Thoughts", "https://arxiv.org/abs/2305.10601", "搜索多条思路，而不是一条链走到底。"),
  ],
};

export const toolsMcp: Essay = {
  title: "工具调用、MCP 与 Skills",
  items: [
    item("项目", "Model Context Protocol", "https://modelcontextprotocol.io", "把外部工具交给模型的协议和文档。"),
    item("项目", "MCP servers", "https://github.com/modelcontextprotocol/servers", "官方和维护中的 MCP 服务器例子。"),
    item("项目", "Awesome AI Agents", "https://github.com/e2b-dev/awesome-ai-agents", "Agent 和工具生态索引。"),
    item("文章", "ReAct", "https://arxiv.org/abs/2210.03629", "工具当环境接口，这条线从这里开始。"),
  ],
};
