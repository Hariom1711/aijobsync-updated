/* eslint-disable @typescript-eslint/no-explicit-any */


// src/app/api/profile/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { FormData } from "@/types/profileWizard";
import { parseLinkedInPDF } from "@/lib/linkedin-parser";

// POST - Import profile from LinkedIn PDF
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
// console.log(buffer,"buffer");
    // Parse LinkedIn PDF and extract data
    const extractedData = await parseLinkedInPDF(buffer);

    // Transform extracted data to match FormData structure
    const profileData: Partial<FormData> = {
      fullName: extractedData.fullName || "",
      email: session.user.email, // Use authenticated user's email
      phone: extractedData.phone || "",
      location: extractedData.location || "",
      linkedin: extractedData.linkedin || "",
      github: extractedData.github || "",
      portfolio: extractedData.portfolio || "",
      summary: extractedData.summary || "",
      education: extractedData.education || [],
      experience: extractedData.experience || [],
      projects: extractedData.projects || [],
      coreSkills: extractedData.coreSkills || {},
      softSkills: extractedData.softSkills || [],
      tools: extractedData.tools || [],
      certifications: extractedData.certifications || [],
      achievements: extractedData.achievements || [],
      codingProfiles: extractedData.codingProfiles || [],
      languages: extractedData.languages || [],
    };

    return NextResponse.json({
      success: true,
      profile: profileData,
      message: "LinkedIn profile imported successfully",
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        extractedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error importing LinkedIn profile:", error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("parse")) {
        return NextResponse.json(
          { error: "Failed to parse PDF file. Please ensure it's a valid LinkedIn profile PDF." },
          { status: 400 }
        );
      }
      if (error.message.includes("extract")) {
        return NextResponse.json(
          { error: "Failed to extract data from PDF. The file format may not be supported." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to import profile" },
      { status: 500 }
    );
  }
}