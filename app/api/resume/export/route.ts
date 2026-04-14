// app/api/resume/export/route.ts
// Replaced puppeteer with html2canvas + jsPDF approach (client-driven)
// Server route now returns resume data; client handles PDF generation
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError, apiError } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const { resume_id } = await req.json();
    if (!resume_id) return apiError("resume_id is required.", 400);

    const resume = await prisma.resume.findFirst({
      where: { id: resume_id, userId: user.id },
      select: { id: true, content: true, template: true, jobDesc: true, score: true },
    });

    if (!resume) return notFound("Resume");

    // Return resume data — PDF is generated client-side via html2canvas + jsPDF
    // This avoids puppeteer's 200MB+ overhead and cold-start latency
    return NextResponse.json({
      success: true,
      resume_id: resume.id,
      content: resume.content,
      template: resume.template,
      score: resume.score,
    });
  } catch (error) {
    console.error("[resume/export]", error);
    return serverError("Failed to export resume.");
  }
}
