

/* eslint-disable @typescript-eslint/no-explicit-any */


// ResumeContentVisible.tsx - FIXED
import React from "react";
import { ResumeData } from "@/types/resume";
import { TEMPLATE_COMPONENTS } from "@/components/resume-templates/layouts";

interface ResumeContentVisibleProps {
  resumeData: ResumeData;
  pageItems: Array<{ section: string; type: 'header' | 'item'; itemIndex?: number }>;
  editingSection: keyof ResumeData | null;
  showHeader?: boolean;
  templateId?: string;
}

export default function ResumeContentVisible({ 
  resumeData, 
  pageItems,
  editingSection,
  showHeader = true,
  templateId = "TemplateModern"
}: ResumeContentVisibleProps) {
  // Get the template component dynamically
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId] || TEMPLATE_COMPONENTS.TemplateModern;

  return (
    <TemplateComponent
      resumeData={resumeData}
      pageItems={pageItems}
      editingSection={editingSection}
      showHeader={showHeader}
    />
  );
}