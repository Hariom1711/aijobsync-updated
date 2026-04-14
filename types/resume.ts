// ============================================
// JOB DESCRIPTION ANALYSIS TYPES
// ============================================

export interface JobDescriptionAnalysis {
  jd_id: string;
  job_title: string;
  company_name?: string;
  experience_required: ExperienceRequirement;
  required_skills: SkillRequirement[];
  nice_to_have_skills: SkillRequirement[];
  key_responsibilities: string[];
  ats_keywords: string[];
  soft_skills: string[];
  technical_requirements: TechnicalRequirements;
  company_culture?: string;
  perks_mentioned?: string[];
  raw_jd: string;
  created_at: string;
}

export interface ExperienceRequirement {
  min_years: number;
  max_years: number;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'entry';
  flexibility?: string; // "strict", "flexible", "negotiable"
}

export interface SkillRequirement {
  skill: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  mentions: number;
  category?: string; // "frontend", "backend", "database", "tools", "cloud", "devops"
  context?: string; // Where it was mentioned
}

export interface TechnicalRequirements {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  tools?: string[];
  methodologies?: string[];
  cloud?: string[];
  devops?: string[];
  mobile?: string[];
  other?: string[];
}

// ============================================
// PROFILE MATCH TYPES
// ============================================

export interface ProfileMatchResult {
  match_id: string;
  jd_id: string;
  user_id: string;
  profile_id: string;
  overall_score: number;
  score_breakdown: ScoreBreakdown;
  matched_elements: MatchedElements;
  missing_elements: MissingElements;
  suggestions: Suggestions;
  potential_score?: number; // Only for premium
  potential_breakdown?: PotentialBreakdown; // Only for premium
  summary: MatchSummary;
  created_at: string;
}

export interface ScoreBreakdown {
  skills_match: ScoreComponent;
  experience_match: ScoreComponent;
  keyword_match: ScoreComponent;
  requirements_match: ScoreComponent;
}

export interface ScoreComponent {
  score: number; // 0-100
  weight: number; // Percentage weight in overall score
  weighted_score: number; // score × weight / 100
  details?: string; // Explanation
}

export interface MatchedElements {
  skills: SkillsMatch;
  experiences: ExperienceMatch[];
  projects: ProjectMatch[];
  certifications: CertificationMatch[];
  education: EducationMatch[];
}

export interface SkillsMatch {
  matched: string[]; // Skills user has that match JD
  count: number;
  total_required: number;
  match_percentage: number;
  details: {
    exact_matches: string[];
    fuzzy_matches: string[];
    semantic_matches: string[];
  };
}

export interface ExperienceMatch {
  experience_id: string; // ID from master profile
  company: string;
  role: string;
  relevance_score: number; // 0-100
  matching_points: string[]; // What matched
  duration: string;
}

export interface ProjectMatch {
  project_id: string;
  title: string;
  relevance_score: number;
  matching_points: string[];
  technologies_matched: string[];
}

export interface CertificationMatch {
  cert_id: string;
  name: string;
  relevance_score: number;
  skills_covered: string[];
}

export interface EducationMatch {
  degree: string;
  field: string;
  institution: string;
  relevance_score: number;
}

export interface MissingElements {
  critical_skills: MissingSkill[];
  nice_to_have_skills: MissingSkill[];
  missing_keywords: string[];
  weak_areas: WeakArea[];
  experience_gaps?: string[];
}

export interface MissingSkill {
  skill: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  mentions_in_jd: number;
  impact: string; // "+5% if added"
  category?: string;
}

export interface WeakArea {
  area: string;
  issue: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Suggestions {
  immediate_actions: SuggestionItem[];
  profile_improvements: SuggestionItem[];
  content_optimization: SuggestionItem[]; // Premium only
  upgrade_message?: string; // For free users
}

export interface SuggestionItem {
  type: 'add_skill' | 'add_certification' | 'quantify_achievement' | 'add_metrics' | 'keyword_enhancement' | 'action_verb' | 'add_project' | 'reorder_section' | 'add_experience_detail';
  action: string; // User-friendly action text
  target?: string; // What to modify (experience ID, project ID, etc.)
  current?: string; // Current text (if applicable)
  suggested?: string; // Suggested improvement (if applicable)
  impact: 'high' | 'medium' | 'low';
  improvement?: string; // "+5%"
  priority?: number; // 1-10 for ordering
}

export interface PotentialBreakdown {
  current: number;
  add_critical_skills: string; // "+5%"
  add_nice_to_have: string; // "+3%"
  content_improvements: string; // "+2%"
  total_potential: number;
  detailed_breakdown: PotentialDetail[];
}

export interface PotentialDetail {
  action: string;
  impact: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MatchSummary {
  verdict: 'excellent' | 'strong_match' | 'moderate_match' | 'weak_match' | 'poor_match';
  message: string;
  estimated_ats_pass_rate: string; // "85%"
  competitive_advantage?: string;
  main_strengths: string[];
  main_weaknesses: string[];
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface AnalyzeJDRequest {
  jd_text?: string;
  jd_file?: File;
}

export interface AnalyzeJDResponse {
  success: boolean;
  jd_id: string;
  analysis: JobDescriptionAnalysis;
  message: string;
  metadata: {
    analyzed_at: string;
    processing_time_ms: number;
    file_name?: string;
    file_size?: number;
  };
}

export interface MatchProfileRequest {
  jd_id: string;
  profile_id?: string; // Optional, use default if not provided
}

export interface MatchProfileResponse {
  success: boolean;
  match_id: string;
  match_result: ProfileMatchResult;
  message: string;
  metadata: {
    matched_at: string;
    processing_time_ms: number;
    is_premium: boolean;
  };
}

// ============================================
// ERROR TYPES
// ============================================

export interface APIError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
  code?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

export type SubscriptionTier = 'FREE' | 'PRO';

export interface UserSubscription {
  plan: SubscriptionTier;
  resumesThisMonth: number;
  limit: number;
  canAccessPremiumFeatures: boolean;
}
// ============================================
// RESUME DATA TYPES
// ============================================

export type SectionShape<T = unknown> = { visible: boolean; data: T };

export type PersonalDetails = {
  fullName: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export type ResumeData = {
  personal: SectionShape<PersonalDetails>;
  summary: SectionShape<string>;
  skills: SectionShape<Record<string, string[]>>;
  projects: SectionShape<unknown[]>;
  experience: SectionShape<unknown[]>;
  education: SectionShape<unknown[]>;
  achievements: SectionShape<string[]>;
  certifications: SectionShape<unknown[]>;
  [key: string]: SectionShape<unknown>;
};

export const RESUME_INITIAL_DATA: ResumeData = {
  personal: {
    visible: true,
    data: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
  },
  summary: { visible: true, data: "" },
  skills: { visible: true, data: {} },
  projects: { visible: true, data: [] },
  experience: { visible: true, data: [] },
  education: { visible: true, data: [] },
  achievements: { visible: true, data: [] },
  certifications: { visible: true, data: [] },
};
