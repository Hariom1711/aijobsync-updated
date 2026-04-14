// // src/types/profileWizard.ts

import { ReactNode } from "react";



export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface ExperienceItem {
  title: ReactNode;
  company: string;
  role: string;
  location?: string;  
  startDate: string;         // YYYY-MM format
  endDate?: string;          // YYYY-MM format
  currentlyWorking: boolean;
  responsibilities: string;  // Multi-line text
  skillsUsed: string[];      // Optional: link to professional skills
  summary?: string;          // Optional notes or highlights

}

export interface Project {
  name: ReactNode;
  title: string;
  description: string;
  summary: string;              // NEW
  technologies: string[];
  liveUrl?: string;             // renamed from 'link'
  githubUrl?: string;           // NEW
  startDate: string;
  endDate: string;
  isOngoing: boolean;           // NEW
  role?: string;                // NEW
  teamSize?: string;            // NEW
  highlights?: string;          // NEW
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
  description?: string;
  neverExpires: boolean;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  category: string;
  organization?: string;
  location?: string;
  recognition?: string;
  impact?: string;
}


export interface CodingProfile {
  platform: string;
  username: string;
  url: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface CoreSkills {
  [category: string]: string[];
}

export interface TechnicalSkills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
}

export interface FormData {
  // Personal Info
  id?: string;
method?: string;

  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;

  // Arrays
  education: Education[];
  experience: ExperienceItem[];
  projects: Project[];

  // Skills
  coreSkills: CoreSkills;
  softSkills: string[];
  tools: string[];

  // Others
  certifications: Certification[];
  achievements: Achievement[];
  codingProfiles: CodingProfile[];
  languages: Language[];
}

export interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
  desc: string;
}

// Props interfaces for each step component
export interface BaseStepProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  addArrayItem: <K extends keyof FormData>(field: K, item: any) => void;
  removeArrayItem: <K extends keyof FormData>(field: K, index: number) => void;
}

export interface PersonalInfoStepProps extends BaseStepProps {}

export interface EducationStepProps extends BaseStepProps {}

export interface ExperienceStepProps extends BaseStepProps {}


export interface ProjectsStepProps extends BaseStepProps {}

export interface SkillsStepProps extends BaseStepProps {}

export interface ExtrasStepProps extends BaseStepProps {}
