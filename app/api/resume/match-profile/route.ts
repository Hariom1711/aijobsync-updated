// app/api/resume/match-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { matchProfileWithJD } from "@/lib/profile-matcher";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError, apiError } from "@/lib/api-helpers";
import { JobDescriptionAnalysis } from "@/types/resume";
import type { FormData } from "@/types/profileWizard";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const { jd_id } = await req.json();
    if (!jd_id) return apiError("jd_id is required.", 400);

    // Fetch user profile + JD in parallel
    const [profile, jobDescription] = await Promise.all([
      prisma.masterProfile.findUnique({ where: { userId: user.id } }),
      prisma.jobDescription.findFirst({ where: { id: jd_id, userId: user.id } }),
    ]);

    if (!jobDescription) return notFound("Job description");
    if (!profile) return apiError("Create your master profile first.", 400);

    const jdAnalysis = jobDescription.analysis as unknown as JobDescriptionAnalysis;

    const masterProfile: FormData = {
      fullName: profile.fullName ?? "",
      email: user.email,
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      linkedin: profile.linkedin ?? "",
      github: profile.github ?? "",
      portfolio: profile.portfolio ?? "",
      summary: profile.summary ?? "",
      education: (profile.education as FormData["education"]) ?? [],
      experience: (profile.experience as FormData["experience"]) ?? [],
      projects: (profile.projects as FormData["projects"]) ?? [],
      coreSkills: (profile.coreSkills as FormData["coreSkills"]) ?? {},
      softSkills: profile.softSkills ?? [],
      tools: profile.tools ?? [],
      certifications: (profile.certifications as FormData["certifications"]) ?? [],
      achievements: (profile.achievements as FormData["achievements"]) ?? [],
      codingProfiles: (profile.codingProfiles as FormData["codingProfiles"]) ?? [],
      languages: (profile.languages as FormData["languages"]) ?? [],
    };

    const validationError = validateProfile(masterProfile);
    if (validationError) return apiError(validationError, 400);

    const matchResult = await matchProfileWithJD(
      jdAnalysis,
      masterProfile,
      user.id,
      user.plan === "PRO"
    );

    const savedMatch = await prisma.profileMatch.create({
      data: {
        userId: user.id,
        jdId: jobDescription.id,
        profileId: profile.id,
        matchData: matchResult as object,
        overallScore: matchResult.overall_score,
        potentialScore: matchResult.potential_score ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      match_id: savedMatch.id,
      match_result: matchResult,
      metadata: {
        matched_at: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime,
        is_premium: user.plan === "PRO",
      },
    });
  } catch (error) {
    if (error instanceof Error && /Groq|AI/.test(error.message))
      return apiError("AI matching failed. Please try again.", 500);
    console.error("[match-profile POST]", error);
    return serverError();
  }
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const matchId = new URL(req.url).searchParams.get("match_id");
  if (!matchId) return apiError("Missing match_id parameter.", 400);

  try {
    const match = await prisma.profileMatch.findFirst({
      where: { id: matchId, userId: user.id },
    });

    if (!match) return notFound("Match");

    return NextResponse.json({
      success: true,
      match_id: match.id,
      match_result: match.matchData,
      metadata: { matched_at: match.createdAt.toISOString() },
    });
  } catch (error) {
    console.error("[match-profile GET]", error);
    return serverError("Failed to fetch match.");
  }
}

function validateProfile(profile: FormData): string | null {
  if (!profile.fullName?.trim()) return "Add your full name to your profile.";
  if (!profile.experience?.length)
    return "Add at least one work experience.";
  if (!profile.coreSkills || !Object.keys(profile.coreSkills).length)
    return "Add skills to your profile.";
  const hasValidExp = profile.experience.some(
    (e) => e.role && e.company && (e.responsibilities || e.summary)
  );
  if (!hasValidExp)
    return "Add details (role, company, responsibilities) to your experience.";
  return null;
}
