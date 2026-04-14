// app/api/jd/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { analyzeJobDescription, extractTextFromPDFFile, extractTextFromDOCX } from "@/lib/jd-analyzer";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized, notFound, serverError, apiError } from "@/lib/api-helpers";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// POST /api/jd/analyze
export async function POST(req: NextRequest) {
  const startTime = Date.now();

  const user = await getAuthUser();
  if (!user) return unauthorized();

  try {
    const contentType = req.headers.get("content-type") ?? "";
    let jdText: string;
    let fileName: string | null = null;
    let fileSize: number | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) return apiError("No file provided. Upload a PDF or DOCX.", 400);
      if (!VALID_TYPES.includes(file.type))
        return apiError("Only PDF and DOCX files are supported.", 400);
      if (file.size > MAX_FILE_SIZE)
        return apiError("File exceeds 10MB limit.", 400);

      const buffer = Buffer.from(await file.arrayBuffer());
      jdText =
        file.type === "application/pdf"
          ? await extractTextFromPDFFile(buffer)
          : await extractTextFromDOCX(buffer);

      fileName = file.name;
      fileSize = file.size;
    } else {
      const body = await req.json();
      jdText = body.jd_text;
      if (!jdText?.trim())
        return apiError("Provide job description text or upload a file.", 400);
    }

    const analysis = await analyzeJobDescription(jdText, user.id);

    const savedJD = await prisma.jobDescription.create({
      data: {
        userId: user.id,
        jdText: analysis.raw_jd,
        fileName,
        fileSize,
        analysis: analysis as object,
        jobTitle: analysis.job_title,
        companyName: analysis.company_name,
        experienceLevel: analysis.experience_required.level,
      },
    });

    return NextResponse.json({
      success: true,
      jd_id: savedJD.id,
      analysis,
      metadata: {
        analyzed_at: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime,
        file_name: fileName,
        file_size: fileSize,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (/too short|too long|doesn't appear/.test(error.message))
        return apiError(error.message, 400);
      if (error.message.includes("extract text"))
        return apiError("Could not extract text from file.", 400);
      if (error.message.includes("Groq"))
        return apiError("AI analysis failed. Please try again.", 500);
    }
    console.error("[jd/analyze]", error);
    return serverError();
  }
}

// GET /api/jd/analyze?jd_id=xxx
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const jdId = new URL(req.url).searchParams.get("jd_id");
  if (!jdId) return apiError("Missing jd_id parameter.", 400);

  try {
    const jd = await prisma.jobDescription.findFirst({
      where: { id: jdId, userId: user.id },
    });

    if (!jd) return notFound("Job description");

    return NextResponse.json({
      success: true,
      jd_id: jd.id,
      analysis: jd.analysis,
      metadata: {
        analyzed_at: jd.createdAt.toISOString(),
        file_name: jd.fileName,
        file_size: jd.fileSize,
      },
    });
  } catch (error) {
    console.error("[jd/analyze GET]", error);
    return serverError("Failed to fetch job description.");
  }
}
