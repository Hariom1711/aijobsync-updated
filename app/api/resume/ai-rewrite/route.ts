// app/api/resume/ai-rewrite/route.ts
import { NextRequest } from "next/server";
import { getAuthUser, unauthorized, apiError, apiSuccess, serverError } from "@/lib/api-helpers";
import { callGroq } from "@/lib/groq-client";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (user.plan !== "PRO") {
    return apiError("AI rewrite is a Pro feature. Upgrade to access it.", 403);
  }

  try {
    const { section, sectionData } = await req.json();

    if (!section || sectionData === undefined) {
      return apiError("section and sectionData are required.");
    }

    const systemPrompt =
      "You are an expert resume writer. Rewrite the given resume section to be more impactful, using strong action verbs, quantified achievements where possible, and ATS-friendly keywords. Return ONLY the rewritten data in the exact same JSON structure as the input — no explanation, no markdown, just the JSON value.";

    const userPrompt = buildRewritePrompt(section, sectionData);

    const raw   = await callGroq(systemPrompt, userPrompt, { temperature: 0.5, maxTokens: 1500 });
    const clean = raw.replace(/```json|```/g, "").trim();

    let rewritten: unknown;
    try {
      rewritten = JSON.parse(clean);
    } catch {
      if (section === "summary") {
        rewritten = clean;
      } else {
        return apiError("AI returned malformed data. Please try again.");
      }
    }

    return apiSuccess({ rewritten });
  } catch (err) {
    console.error("[ai-rewrite]", err);
    return serverError("AI rewrite failed. Please try again.");
  }
}

function buildRewritePrompt(section: string, data: unknown): string {
  const dataStr = typeof data === "string" ? data : JSON.stringify(data, null, 2);

  const instructions: Record<string, string> = {
    summary:
      "Rewrite this professional summary to be concise (3–4 sentences), impactful, and keyword-rich. Return a plain JSON string value.",
    experience:
      "Rewrite each experience entry's bullet points to start with strong action verbs and include quantified results where possible. Return the same array structure.",
    projects:
      "Rewrite each project description to highlight technical impact, tools used, and outcomes. Return the same array structure.",
    skills:
      "Organize and enhance the skills list — ensure it is comprehensive and ATS-friendly. Return the same structure.",
    achievements:
      "Rewrite each achievement to be more specific and impactful with numbers/metrics where possible. Return the same array structure.",
    certifications:
      "Return the certifications as-is but ensure names are formal and complete. Return the same structure.",
    education:
      "Return the education entries as-is but properly formatted. Return the same structure.",
  };

  const instruction =
    instructions[section] ??
    "Rewrite this section to be more professional and impactful. Return the same JSON structure.";

  return `Section: ${section}\nInstruction: ${instruction}\n\nCurrent data:\n${dataStr}`;
}
