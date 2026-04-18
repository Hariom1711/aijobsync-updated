// app/api/interview/complete/route.ts
// HOTFIX: Uses in-memory session store instead of DB
import { NextRequest } from "next/server";
import { getAuthUser, unauthorized, apiError, apiSuccess, serverError } from "@/lib/api-helpers";
import { interviewSessions } from "../generate/route";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  if (user.plan !== "PRO") {
    return apiError("AI Interviewer is a Pro feature.", 403);
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) return apiError("sessionId is required.");

    const session = interviewSessions.get(sessionId);

    if (!session || session.userId !== user.id) {
      return apiError("Interview session not found.", 404);
    }

    const feedback  = session.feedback  ?? [];
    const questions = session.questions ?? [];
    const answers   = session.answers   ?? [];

    // Calculate overall score
    const scores   = feedback.map((f: any) => f.score ?? 5);
    const avgScore = scores.length
      ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
      : 0;

    const scorecard = {
      overallScore:      avgScore,
      totalQuestions:    questions.length,
      answeredQuestions: answers.length,
      strengths:  feedback.filter((f: any) => f.score >= 7).map((f: any) => f.feedback).slice(0, 3),
      weakAreas:  feedback.filter((f: any) => f.score <  6).map((f: any) => f.missed).filter(Boolean).slice(0, 3),
      topSuggestion: [...feedback].sort((a: any, b: any) => a.score - b.score)[0]?.suggestion ?? "Keep practicing!",
      perQuestion: feedback,
    };

    // Mark session complete in memory
    session.status = "completed";
    interviewSessions.set(sessionId, session);

    // Clean up old sessions (keep last 50 per process)
    if (interviewSessions.size > 50) {
      const oldest = [...interviewSessions.entries()]
        .sort((a, b) => a[1].createdAt.getTime() - b[1].createdAt.getTime())
        .slice(0, 10)
        .map(([key]) => key);
      oldest.forEach((k) => interviewSessions.delete(k));
    }

    return apiSuccess({ scorecard });
  } catch (err) {
    console.error("[interview/complete]", err);
    return serverError("Failed to complete interview.");
  }
}
