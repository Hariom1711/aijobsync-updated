// app/api/resume/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateResumeContent } from "@/lib/resume-generator";
import { getAuthUser, unauthorized, notFound, serverError, apiError } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const { jd_id, match_id } = await req.json();
    if (!jd_id || !match_id) return apiError("jd_id and match_id are required.", 400);

    // Fetch profile, JD, and match in parallel
    const [profile, jd, match] = await Promise.all([
      prisma.masterProfile.findUnique({ where: { userId: user.id } }),
      prisma.jobDescription.findFirst({ where: { id: jd_id, userId: user.id } }),
      prisma.profileMatch.findFirst({ where: { id: match_id, userId: user.id } }),
    ]);

    console.log("match FOUND:", match,"profile FOUND:", profile);

    if (!profile) return apiError("Master profile not found.", 400);
    if (!jd) return notFound("Job description");
    if (!match) return notFound("Profile match");

    const resumeContent = await generateResumeContent({
      jdAnalysis: jd.analysis,
      matchResult: match.matchData,
      masterProfile: profile,
    });

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        jdId: jd.id,
        matchId: match.id,
        jobDesc: jd.jdText,
        content: resumeContent as object,
        template: "classic",
        score: match.overallScore,
        version: 1,
      },
    });

    return NextResponse.json({ success: true, resume_id: resume.id });
  } catch (error) {
    console.error("[resume/generate]", error);
    return serverError("Resume generation failed.");
  }
}
