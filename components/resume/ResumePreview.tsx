/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ResumeData } from "@/types/resume";
import TemplateModern from "../resume-templates/layouts/TemplateModern";

interface ResumePreviewProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export default function ResumePreview({
  resumeData,
  setResumeData,
}: ResumePreviewProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-white/10 bg-white/5">
      <TemplateModern resumeData={resumeData} pageItems={[]} editingSection={null} />
    </div>
  );
}
