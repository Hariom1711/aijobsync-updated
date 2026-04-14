// app/api/resume/list/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, serverError } from "@/lib/api-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        template: true,
        score: true,
        version: true,
        createdAt: true,
        updatedAt: true,
        jobDescription: { select: { jobTitle: true, companyName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, resumes });
  } catch (error) {
    console.error("[resume/list]", error);
    return serverError("Failed to fetch resumes.");
  }
}
