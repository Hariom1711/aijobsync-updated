

// src/types/template.ts - FIXED

import { ResumeData } from "./resume";

export interface TemplateMeasurements {
  // Page settings
  headerHeight: number;        // Height of main header section (contact info)
  sectionGap: number;          // Space between sections (space-y-6 = 24px)
  buffer: number;              // Safety buffer at page bottom
  
  // Section-specific heights
  sectionHeaderHeight: number; // Height of each section title
  summaryHeight: number;       // Height for summary section content
  skillsHeight: number;        // Height for skills section content
  
  // Item heights (for array-based sections)
  experienceItemHeight: number;
  projectItemHeight: number;
  educationItemHeight: number;
  achievementItemHeight: number;
  certificationItemHeight: number;
  
  // Optional: Dynamic calculation function for complex cases
  calculateItemHeight?: (section: string, item: any, itemIndex: number) => number;
}

export interface TemplateProps {
  resumeData: ResumeData;
  pageItems: Array<{ section: string; type: 'header' | 'item'; itemIndex?: number }>;
  editingSection: keyof ResumeData | null; // ← FIXED: Changed from 'string | null'
  showHeader?: boolean;
}

export interface TemplateConfig {
  id: string;
  name: string;
  component: React.ComponentType<TemplateProps>;
  measurements: TemplateMeasurements;
  description?: string;
  preview?: string; // thumbnail path
}