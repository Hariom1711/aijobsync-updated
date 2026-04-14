// app/api/resume/get/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError, apiError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const resumeId = new URL(req.url).searchParams.get("resume_id");
  if (!resumeId) return apiError("Missing resume_id.", 400);

  try {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: user.id },
    });

    if (!resume) return notFound("Resume");

    return NextResponse.json({ success: true, resume });
  } catch (error) {
    console.error("[resume/get]", error);
    return serverError("Failed to fetch resume.");
  }
}
