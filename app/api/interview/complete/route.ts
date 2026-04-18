// app/api/interview/complete/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, apiError, apiSuccess, serverError } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (user.plan !== "PRO") {
    return apiError("AI Interviewer is a Pro feature.", 403);
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) return apiError("sessionId is required.");

    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId, userId: user.id },
    });

    if (!session) return apiError("Interview session not found.", 404);

    const feedback   = (session.feedback as any[]) ?? [];
    const questions  = (session.questions as any[]) ?? [];
    const answers    = (session.answers as any[]) ?? [];

    // Calculate overall score
    const scores     = feedback.map((f) => f.score ?? 5);
    const avgScore   = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Build scorecard
    const scorecard = {
      overallScore:      avgScore,
      totalQuestions:    questions.length,
      answeredQuestions: answers.length,
      strengths:         feedback.filter((f) => f.score >= 7).map((f) => f.feedback).slice(0, 3),
      weakAreas:         feedback.filter((f) => f.score < 6).map((f) => f.missed).filter(Boolean).slice(0, 3),
      topSuggestion:     feedback.sort((a, b) => a.score - b.score)[0]?.suggestion ?? "Keep practicing!",
      perQuestion:       feedback,
    };

    // Mark session complete
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: "completed", scorecard },
    });

    return apiSuccess({ scorecard });
  } catch (err) {
    console.error("[interview/complete]", err);
    return serverError("Failed to complete interview.");
  }
}
