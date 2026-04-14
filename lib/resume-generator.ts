// lib/resume-generator.ts
import { callGroqWithRetry } from "./groq-client";
import { RESUME_GENERATOR_SYSTEM_PROMPT } from "./prompts/resumeGeneratorPrompt";
import type { ResumeData } from "@/types/resume";

export async function generateResumeContent(params: {
  jdAnalysis: unknown;
  matchResult: unknown;
  masterProfile: unknown;
}): Promise<ResumeData> {
  const userPrompt = `
JOB DESCRIPTION ANALYSIS:
${JSON.stringify(params.jdAnalysis, null, 2)}

PROFILE MATCH RESULT:
${JSON.stringify(params.matchResult, null, 2)}

CANDIDATE MASTER PROFILE:
${JSON.stringify(params.masterProfile, null, 2)}

Generate the resume now.
`;

  return callGroqWithRetry<ResumeData>(
    RESUME_GENERATOR_SYSTEM_PROMPT,
    userPrompt,
    { maxTokens: 7000 }
  );
}
