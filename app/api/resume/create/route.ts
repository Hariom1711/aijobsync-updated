// app/api/resume/create/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError, apiError, apiSuccess } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const { content, template, score, jobDesc, jdId, matchId, version = 1 } = await req.json();

    if (!content || !template || !jobDesc)
      return apiError("content, template, and jobDesc are required.", 400);

    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        jdId: jdId ?? null,
        matchId: matchId ?? null,
        jobDesc,
        content,
        template,
        score: score ?? null,
        version,
      },
    });

    return apiSuccess({ resume_id: resume.id }, 201);
  } catch (error) {
    console.error("[resume/create]", error);
    return serverError("Failed to create resume.");
  }
}
