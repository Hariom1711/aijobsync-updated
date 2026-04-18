// app/api/interview/answer/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, apiError, apiSuccess, serverError } from "@/lib/api-helpers";
import { callGroq } from "@/lib/groq-client";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (user.plan !== "PRO") {
    return apiError("AI Interviewer is a Pro feature.", 403);
  }

  try {
    const { sessionId, questionId, answer, question, hint } = await req.json();

    if (!sessionId || !questionId || !answer) {
      return apiError("sessionId, questionId, and answer are required.");
    }

    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId, userId: user.id },
    });

    if (!session) return apiError("Interview session not found.", 404);

    const systemPrompt = "You are a technical interviewer evaluating a candidate's answer. Return only valid JSON, no markdown.";

    const userPrompt = `Evaluate this interview answer.

Question: ${question}
Hint (what a good answer should cover): ${hint}
Candidate's Answer: ${answer}

Return ONLY this JSON:
{
  "score": <1-10>,
  "feedback": "<2-3 sentence specific feedback>",
  "missed": "<key points the candidate missed, or empty string if none>",
  "suggestion": "<one concrete tip to improve this answer>"
}`;

    const raw   = await callGroq(systemPrompt, userPrompt, { temperature: 0.4, maxTokens: 500 });
    const clean = raw.replace(/```json|```/g, "").trim();

    let feedbackData: any;
    try {
      feedbackData = JSON.parse(clean);
    } catch {
      feedbackData = { score: 5, feedback: "Answer recorded.", missed: "", suggestion: "Practice more." };
    }

    // Update session with answer + feedback
    const existingAnswers  = (session.answers  as any[]) ?? [];
    const existingFeedback = (session.feedback as any[]) ?? [];

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        answers:  [...existingAnswers,  { questionId, answer }],
        feedback: [...existingFeedback, { questionId, ...feedbackData }],
      },
    });

    return apiSuccess({ feedback: feedbackData });
  } catch (err) {
    console.error("[interview/answer]", err);
    return serverError("Failed to evaluate answer.");
  }
}
