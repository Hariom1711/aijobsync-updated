// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError, apiError } from "@/lib/api-helpers";
import type { FormData } from "@/types/profileWizard";

// GET — fetch master profile
export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const profile = await prisma.masterProfile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ profile: profile ?? null });
  } catch (error) {
    console.error("[profile GET]", error);
    return serverError("Failed to fetch profile.");
  }
}

// POST — upsert full profile
export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const body: FormData = await req.json();
    const completeness = calcCompleteness(body);

    const profileData = {
      fullName: body.fullName || null,
      phone: body.phone || null,
      location: body.location || null,
      linkedin: body.linkedin || null,
      github: body.github || null,
      portfolio: body.portfolio || null,
      summary: body.summary || null,
      education: body.education ?? [],
      experience: body.experience ?? [],
      projects: body.projects ?? [],
      certifications: body.certifications ?? [],
      achievements: body.achievements ?? [],
      coreSkills: body.coreSkills ?? {},
      softSkills: body.softSkills ?? [],
      tools: body.tools ?? [],
      codingProfiles: body.codingProfiles ?? [],
      languages: body.languages ?? [],
      completeness,
    };

    const profile = await prisma.masterProfile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: { userId: user.id, ...profileData },
    });

    return NextResponse.json({ success: true, profile, message: "Profile saved." });
  } catch (error) {
    console.error("[profile POST]", error);
    return serverError("Failed to save profile.");
  }
}

// PUT — update specific section
export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const { section, data } = await req.json();
    if (!section) return apiError("section is required.", 400);

    const existing = await prisma.masterProfile.findUnique({
      where: { userId: user.id },
    });
    if (!existing) return notFound("Profile");

    const merged = { ...existing, [section]: data };

    const profile = await prisma.masterProfile.update({
      where: { userId: user.id },
      data: {
        [section]: data,
        completeness: calcCompletenessFromProfile(merged),
      },
    });

    return NextResponse.json({ success: true, profile, message: `${section} updated.` });
  } catch (error) {
    console.error("[profile PUT]", error);
    return serverError("Failed to update profile.");
  }
}

// DELETE — remove profile
export async function DELETE() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    await prisma.masterProfile.delete({ where: { userId: user.id } });
    return NextResponse.json({ success: true, message: "Profile deleted." });
  } catch (error) {
    console.error("[profile DELETE]", error);
    return serverError("Failed to delete profile.");
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function calcCompleteness(d: FormData): number {
  let score = 0;
  const w = { personal: 20, education: 15, experience: 15, projects: 15, skills: 15, extras: 20 };
  const personal = [d.fullName, d.email, d.phone, d.location, d.summary];
  score += (personal.filter(Boolean).length / personal.length) * w.personal;
  if (d.education?.length) score += w.education;
  if (d.experience?.length) score += w.experience;
  if (d.projects?.length) score += w.projects;
  if (Object.keys(d.coreSkills ?? {}).length || d.softSkills?.length || d.tools?.length)
    score += w.skills;
  let extras = 0;
  if (d.certifications?.length) extras += 7;
  if (d.achievements?.length) extras += 7;
  if (d.codingProfiles?.length) extras += 3;
  if (d.languages?.length) extras += 3;
  score += Math.min(extras, w.extras);
  return Math.round(score);
}

function calcCompletenessFromProfile(p: Record<string, unknown>): number {
  return calcCompleteness({
    fullName: (p.fullName as string) ?? "",
    email: "",
    phone: (p.phone as string) ?? "",
    location: (p.location as string) ?? "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: (p.summary as string) ?? "",
    education: (p.education as FormData["education"]) ?? [],
    experience: (p.experience as FormData["experience"]) ?? [],
    projects: (p.projects as FormData["projects"]) ?? [],
    coreSkills: (p.coreSkills as FormData["coreSkills"]) ?? {},
    softSkills: (p.softSkills as string[]) ?? [],
    tools: (p.tools as string[]) ?? [],
    certifications: (p.certifications as FormData["certifications"]) ?? [],
    achievements: (p.achievements as FormData["achievements"]) ?? [],
    codingProfiles: (p.codingProfiles as FormData["codingProfiles"]) ?? [],
    languages: (p.languages as FormData["languages"]) ?? [],
  });
}
