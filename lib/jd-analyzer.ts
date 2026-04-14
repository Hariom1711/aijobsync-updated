// ============================================
// JOB DESCRIPTION ANALYZER
// Core logic for analyzing JDs with Groq AI
// ============================================
/* eslint-disable @typescript-eslint/no-explicit-any */

import { callGroqWithJSON } from './groq-client';
import { JobDescriptionAnalysis } from '@/types/resume';

/**
 * Analyze a job description and extract structured data
 */
export async function analyzeJobDescription(
  jdText: string,
  userId: string
): Promise<JobDescriptionAnalysis> {
  // Validate input
  validateJDInput(jdText);

  // Clean text
  const cleanedText = cleanJDText(jdText);

  // Build Groq prompt
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(cleanedText);

  // Call Groq API
  const rawAnalysis = await callGroqWithJSON<GroqJDAnalysisResponse>(
    systemPrompt,
    userPrompt,
    {
      temperature: 0,
      maxTokens: 8000,
    }
  );

  // Post-process and structure
  const analysis = postProcessAnalysis(rawAnalysis, jdText);

  return analysis;
}

/**
 * Validate JD input
 */
function validateJDInput(jdText: string): void {
  if (!jdText || typeof jdText !== 'string') {
    throw new Error('Job description text is required');
  }

  const trimmed = jdText.trim();

  if (trimmed.length < 100) {
    throw new Error('Job description too short (minimum 100 characters). Please provide a complete job description.');
  }

  if (trimmed.length > 50000) {
    throw new Error('Job description too long (maximum 50,000 characters). Please shorten it.');
  }

  // Check if it looks like a JD (basic heuristic)
  const hasKeywords = /experience|skill|requirement|responsibilit|qualifi|candidate/i.test(trimmed);
  if (!hasKeywords) {
    throw new Error('This doesn\'t appear to be a job description. Please paste a valid JD.');
  }
}

/**
 * Clean JD text
 */
function cleanJDText(jdText: string): string {
  return jdText
    .trim()
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\x20-\x7E\n]/g, ''); // Remove non-printable characters
}

/**
 * Build system prompt for Groq
 */
function buildSystemPrompt(): string {
  return `You are an expert ATS (Applicant Tracking System) and recruitment specialist with deep knowledge of:
- Job description analysis
- Skills extraction and categorization
- Technical requirements identification
- Keyword extraction for ATS optimization
- Experience level determination

Your task is to analyze job descriptions and extract structured, accurate data.

Rules:
1. Be precise and factual - only extract what's explicitly mentioned
2. Categorize skills properly (frontend, backend, database, tools, cloud, devops)
3. Distinguish between "required" (must-have) and "nice-to-have" skills
4. Count exact mentions of skills/keywords
5. Determine experience level from job title and requirements
6. Extract action verbs and keywords important for ATS
7. Return ONLY valid JSON, no markdown formatting
8. If information is missing, use appropriate defaults (empty arrays, null values)`;
}

/**
 * Build user prompt for Groq
 */
function buildUserPrompt(jdText: string): string {
  return `Analyze this job description and extract structured information:

JOB DESCRIPTION:
${jdText}

EXTRACT THE FOLLOWING:

1. Job Title (exact as mentioned)
2. Company Name (if mentioned)
3. Experience Required:
   - Minimum years (integer)
   - Maximum years (integer)
   - Level: "entry", "junior", "mid", "senior", "lead", or "principal"
   - Flexibility: "strict", "flexible", or "negotiable"

4. Required Skills (must-have, critical for the role):
   - Skill name
   - Importance: "critical" (mentioned 3+ times or in must-have section)
   - Number of mentions
   - Category: "frontend", "backend", "database", "tools", "cloud", "devops", "mobile", "other"

5. Nice-to-Have Skills (preferred but not required):
   - Same structure as required skills
   - Importance: "high", "medium", or "low"

6. Key Responsibilities (main duties, 5-10 items):
   - Extract from "Responsibilities", "What you'll do", etc.

7. ATS Keywords (important words for resume matching):
   - Action verbs (e.g., "developed", "led", "architected", "optimized")
   - Technical terms
   - Domain-specific keywords
   - Exclude common words

8. Soft Skills mentioned:
   - Leadership, communication, problem-solving, etc.

9. Technical Requirements (categorized):
   - Frontend: frameworks, libraries
   - Backend: languages, frameworks
   - Database: types, systems
   - Tools: version control, IDEs, etc.
   - Cloud: AWS, Azure, GCP
   - DevOps: CI/CD, containerization
   - Mobile: iOS, Android
   - Methodologies: Agile, Scrum, TDD

10. Company Culture indicators (if mentioned):
    - Work environment hints
    - Values mentioned

11. Perks/Benefits mentioned (optional)

Return JSON in this EXACT structure:
{
  "job_title": "string",
  "company_name": "string or null",
  "experience_required": {
    "min_years": number,
    "max_years": number,
    "level": "entry|junior|mid|senior|lead|principal",
    "flexibility": "strict|flexible|negotiable"
  },
  "required_skills": [
    {
      "skill": "string",
      "importance": "critical",
      "mentions": number,
      "category": "frontend|backend|database|tools|cloud|devops|mobile|other",
      "context": "where it was mentioned (optional)"
    }
  ],
  "nice_to_have_skills": [
    {
      "skill": "string",
      "importance": "high|medium|low",
      "mentions": number,
      "category": "string"
    }
  ],
  "key_responsibilities": ["string"],
  "ats_keywords": ["string"],
  "soft_skills": ["string"],
  "technical_requirements": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": ["string"],
    "tools": ["string"],
    "cloud": ["string"],
    "devops": ["string"],
    "mobile": ["string"],
    "methodologies": ["string"]
  },
  "company_culture": "string or null",
  "perks_mentioned": ["string"]
}

CRITICAL: Return ONLY the JSON object, no explanations or markdown.`;
}

/**
 * Groq response interface (what we expect from AI)
 */
interface GroqJDAnalysisResponse {
  job_title: string;
  company_name?: string;
  experience_required: {
    min_years: number;
    max_years: number;
    level: string;
    flexibility?: string;
  };
  required_skills: Array<{
    skill: string;
    importance: string;
    mentions: number;
    category?: string;
    context?: string;
  }>;
  nice_to_have_skills: Array<{
    skill: string;
    importance: string;
    mentions: number;
    category?: string;
  }>;
  key_responsibilities: string[];
  ats_keywords: string[];
  soft_skills: string[];
  technical_requirements: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    tools?: string[];
    cloud?: string[];
    devops?: string[];
    mobile?: string[];
    methodologies?: string[];
  };
  company_culture?: string;
  perks_mentioned?: string[];
}

/**
 * Post-process Groq response into final structure
 */
function postProcessAnalysis(
  rawAnalysis: GroqJDAnalysisResponse,
  originalText: string
): JobDescriptionAnalysis {
  // Generate unique ID
  const jd_id = generateJDId();

  // Normalize experience level
  const normalizedLevel = normalizeExperienceLevel(rawAnalysis.experience_required.level);

  // Deduplicate and clean arrays
  const cleanedRequiredSkills = deduplicateSkills(rawAnalysis.required_skills);
  const cleanedNiceToHaveSkills = deduplicateSkills(rawAnalysis.nice_to_have_skills);
  const cleanedKeywords = Array.from(new Set(rawAnalysis.ats_keywords)).slice(0, 30); // Max 30 keywords

  return {
    jd_id,
    job_title: rawAnalysis.job_title || 'Unknown Position',
    company_name: rawAnalysis.company_name,
    experience_required: {
      min_years: rawAnalysis.experience_required.min_years || 0,
      max_years: rawAnalysis.experience_required.max_years || 0,
      level: normalizedLevel,
      flexibility: rawAnalysis.experience_required.flexibility || 'flexible',
    },
    required_skills: cleanedRequiredSkills,
    nice_to_have_skills: cleanedNiceToHaveSkills,
    key_responsibilities: rawAnalysis.key_responsibilities || [],
    ats_keywords: cleanedKeywords,
    soft_skills: Array.from(new Set(rawAnalysis.soft_skills || [])),
    technical_requirements: rawAnalysis.technical_requirements || {},
    company_culture: rawAnalysis.company_culture,
    perks_mentioned: rawAnalysis.perks_mentioned,
    raw_jd: originalText,
    created_at: new Date().toISOString(),
  };
}

/**
 * Generate unique JD ID
 */
function generateJDId(): string {
  return `jd_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Normalize experience level
 */
function normalizeExperienceLevel(level: string): JobDescriptionAnalysis['experience_required']['level'] {
  const normalized = level.toLowerCase();
  const validLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'principal'];

  if (validLevels.includes(normalized)) {
    return normalized as JobDescriptionAnalysis['experience_required']['level'];
  }

  // Fallback mapping
  if (normalized.includes('entry') || normalized.includes('intern')) return 'entry';
  if (normalized.includes('junior') || normalized.includes('jr')) return 'junior';
  if (normalized.includes('senior') || normalized.includes('sr')) return 'senior';
  if (normalized.includes('lead') || normalized.includes('staff')) return 'lead';
  if (normalized.includes('principal') || normalized.includes('architect')) return 'principal';

  // Default to mid if unclear
  return 'mid';
}

/**
 * Deduplicate skills (case-insensitive, trim)
 */
function deduplicateSkills(skills: Array<{ skill: string; importance: string; mentions: number; category?: string }>): JobDescriptionAnalysis['required_skills'] {
  type Importance = 'critical' | 'high' | 'medium' | 'low';
  type SkillRequirement = {
    skill: string;
    importance: Importance;
    mentions: number;
    category?: string;
  };

  const normalizeImportance = (imp: string | undefined): Importance => {
    if (!imp) return 'low';
    const s = String(imp).toLowerCase();
    if (s.includes('critical') || s.includes('must') || s.includes('required')) return 'critical';
    if (s.includes('high')) return 'high';
    if (s.includes('medium') || s.includes('preferred')) return 'medium';
    return 'low';
  };

  const seen = new Map<string, SkillRequirement>();

  skills.forEach(skillObj => {
    const normalizedKey = skillObj.skill.toLowerCase().trim();
    const entry: SkillRequirement = {
      skill: skillObj.skill.trim(),
      importance: normalizeImportance(skillObj.importance as string),
      mentions: typeof skillObj.mentions === 'number' ? skillObj.mentions : Number(skillObj.mentions) || 0,
      category: skillObj.category,
    };

    if (!seen.has(normalizedKey)) {
      seen.set(normalizedKey, entry);
    } else {
      // If duplicate, prefer the one with higher mentions, otherwise prefer higher importance
      const existing = seen.get(normalizedKey)!;
      if (entry.mentions > existing.mentions) {
        seen.set(normalizedKey, entry);
      } else {
        const rank = (imp: Importance) => (imp === 'critical' ? 4 : imp === 'high' ? 3 : imp === 'medium' ? 2 : 1);
        if (rank(entry.importance) > rank(existing.importance)) {
          seen.set(normalizedKey, { ...existing, importance: entry.importance });
        }
      }
    }
  });

  return Array.from(seen.values());
}

/**
 * Extract text from PDF file (if JD is uploaded as PDF)
 */
export async function extractTextFromPDFFile(buffer: Buffer): Promise<string> {
  try {
    // console.log('Extracting text from PDF...');

    // Dynamically import to avoid edge runtime issues
    const { PDFParse } = await import('pdf-parse');

    // Create parser instance with buffer data
    const parser = new PDFParse({ data: buffer });
    
    // Extract text from all pages
    const result = await parser.getText();
    
    // Clean up resources
    await parser.destroy();

    // console.log('Successfully extracted text from PDF');
    return result.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text from DOCX file (if JD is uploaded as DOCX)
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    // console.log('Extracting text from DOCX...');

    // Use mammoth to extract text from DOCX
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });

    // console.log('Successfully extracted text from DOCX');
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}