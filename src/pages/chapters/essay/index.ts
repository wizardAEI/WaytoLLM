import type { Essay } from "./types";
import {
  denseMoe,
  llmGateway,
  llmops,
  onDevice,
  privateDeployment,
} from "./deployment";
import { capabilityRegression, evalDatasets, safetyEval, scenarioTesting } from "./evaluation";
import { agentFrameworks, ragContext, toolsMcp } from "./frameworks";
import {
  aiBanking,
  aiEcommerce,
  aiEducation,
  aiGovernment,
  aiHealthcare,
  aiLegal,
  aiTelecom,
  aiVideo,
} from "./industry";
import { postTraining, quantization } from "./training";

export const ESSAYS: Record<string, Essay> = {
  "private-deployment": privateDeployment,
  "llm-gateway": llmGateway,
  llmops,
  "on-device": onDevice,
  "dense-moe": denseMoe,
  "post-training": postTraining,
  quantization,
  "rag-context": ragContext,
  "agent-frameworks": agentFrameworks,
  "tools-mcp": toolsMcp,
  "safety-eval": safetyEval,
  "capability-regression": capabilityRegression,
  "scenario-testing": scenarioTesting,
  "eval-datasets": evalDatasets,
  "ai-healthcare": aiHealthcare,
  "ai-banking": aiBanking,
  "ai-telecom": aiTelecom,
  "ai-legal": aiLegal,
  "ai-government": aiGovernment,
  "ai-education": aiEducation,
  "ai-ecommerce": aiEcommerce,
  "ai-video": aiVideo,
};

export function requireEssay(id: string): Essay {
  const essay = ESSAYS[id];
  if (!essay) {
    throw new Error(`Missing essay content for chapter "${id}"`);
  }
  return essay;
}
