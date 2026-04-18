// app/api/interview/generate/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, apiError, apiSuccess, serverError } from "@/lib/api-helpers";
import { callGroq } from "@/lib/groq-client";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (user.plan !== "PRO") {
    return apiError("AI Interviewer is a Pro feature. Upgrade to access it.", 403);
  }

  try {
    const { resumeId, jdId } = await req.json();

    if (!resumeId) return apiError("resumeId is required.");

    const [resume] = await Promise.all([
      prisma.resume.findUnique({ where: { id: resumeId, userId: user.id } }),
    ]);

    if (!resume) return apiError("Resume not found.", 404);

    let jdText = "";
    if (jdId) {
      const jd = await prisma.jobDescription.findUnique({ where: { id: jdId } });
      jdText = jd?.jdText ?? "";
    }

    const resumeContent = resume.content as any;

    const systemPrompt = "You are an expert technical interviewer. Return only valid JSON, no markdown, no explanation.";

    const userPrompt = `Based on the candidate's resume and job description below, generate a structured interview with exactly 10 questions.

RESUME SUMMARY:
- Name: ${resumeContent?.personalInfo?.data?.fullName ?? "Candidate"}
- Skills: ${JSON.stringify(resumeContent?.skills?.data ?? [])}
- Experience: ${JSON.stringify(resumeContent?.experience?.data ?? [])}
- Projects: ${JSON.stringify(resumeContent?.projects?.data ?? [])}

JOB DESCRIPTION:
${jdText || "General software engineering role"}

Return ONLY this JSON structure:
{
  "questions": [
    {
      "id": 1,
      "type": "technical",
      "question": "...",
      "hint": "What a good answer should cover",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Mix: 5 technical (from JD skills), 3 behavioral (situational), 2 project-specific.`;

    const raw   = await callGroq(systemPrompt, userPrompt, { temperature: 0.6, maxTokens: 2000 });
    const clean = raw.replace(/```json|```/g, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return serverError("AI returned invalid data. Please try again.");
    }

    // Save session to DB
    const session = await prisma.interviewSession.create({
      data: {
        userId:    user.id,
        resumeId,
        jdId:      jdId ?? null,
        questions: parsed.questions ?? [],
        answers:   [],
        feedback:  [],
        status:    "in_progress",
      },
    });

    return apiSuccess({ sessionId: session.id, questions: parsed.questions });
  } catch (err) {
    console.error("[interview/generate]", err);
    return serverError("Failed to generate interview.");
  }
}
