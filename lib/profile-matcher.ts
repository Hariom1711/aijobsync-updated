// ============================================
// PROFILE MATCHER
// Matches user's master profile with analyzed JD
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

import { callGroqWithJSON } from './groq-client';
import {
  JobDescriptionAnalysis,
  ProfileMatchResult,
  ScoreBreakdown,
  MatchedElements,
  MissingElements,
  Suggestions,
  MatchSummary,
  PotentialBreakdown,
  SuggestionItem,
  SkillsMatch,
  ExperienceMatch,
  ProjectMatch,
  CertificationMatch,
  EducationMatch,
  MissingSkill,
  WeakArea,
} from '@/types/resume';
import { FormData } from '@/types/profileWizard';

/**
 * Main function: Match user profile with JD and return complete analysis
 */
export async function matchProfileWithJD(
  jdAnalysis: JobDescriptionAnalysis,
  masterProfile: FormData,
  userId: string,
  isPremium: boolean
): Promise<ProfileMatchResult> {
  // Calculate individual component scores
  const skillsMatch = await calculateSkillsMatch(
    jdAnalysis.required_skills,
    jdAnalysis.nice_to_have_skills,
    masterProfile.coreSkills,
    masterProfile.softSkills,
    masterProfile.tools
  );

  const experienceMatch = calculateExperienceMatch(
    jdAnalysis.experience_required,
    masterProfile.experience || []
  );

  const keywordMatch = calculateKeywordMatch(
    jdAnalysis.ats_keywords,
    masterProfile
  );

  const requirementsMatch = await calculateRequirementsMatch(
    jdAnalysis.key_responsibilities,
    masterProfile.experience || [],
    masterProfile.projects || []
  );

  // Build weighted score breakdown
  const scoreBreakdown: ScoreBreakdown = {
    skills_match: {
      score: skillsMatch.score,
      weight: 35,
      weighted_score: (skillsMatch.score * 35) / 100,
      details: `${skillsMatch.matched.length}/${skillsMatch.total_required} skills matched`,
    },
    experience_match: {
      score: experienceMatch.score,
      weight: 25,
      weighted_score: (experienceMatch.score * 25) / 100,
      details: experienceMatch.details,
    },
    keyword_match: {
      score: keywordMatch.score,
      weight: 20,
      weighted_score: (keywordMatch.score * 20) / 100,
      details: `${keywordMatch.matched_count}/${keywordMatch.total_keywords} keywords found`,
    },
    requirements_match: {
      score: requirementsMatch.score,
      weight: 20,
      weighted_score: (requirementsMatch.score * 20) / 100,
      details: `${requirementsMatch.matched_responsibilities}/${requirementsMatch.total_responsibilities} responsibilities covered`,
    },
  };

  // Calculate overall score from weighted components
  const overallScore = Math.round(
    scoreBreakdown.skills_match.weighted_score +
    scoreBreakdown.experience_match.weighted_score +
    scoreBreakdown.keyword_match.weighted_score +
    scoreBreakdown.requirements_match.weighted_score
  );

  // Build matched and missing elements
  const matchedElements = buildMatchedElements(
    skillsMatch,
    experienceMatch,
    requirementsMatch,
    masterProfile
  );

  const missingElements = buildMissingElements(
    skillsMatch,
    keywordMatch,
    jdAnalysis,
    masterProfile
  );

  // Generate suggestions (limited for free users)
  const suggestions = generateSuggestions(
    missingElements,
    matchedElements,
    jdAnalysis,
    masterProfile,
    isPremium
  );

  // Calculate potential score (premium only)
  let potentialScore: number | undefined;
  let potentialBreakdown: PotentialBreakdown | undefined;

  if (isPremium) {
    const potential = calculatePotentialScore(overallScore, missingElements);
    potentialScore = potential.score;
    potentialBreakdown = potential.breakdown;
  }

  // Generate summary verdict
  const summary = generateMatchSummary(
    overallScore,
    potentialScore,
    matchedElements,
    missingElements,
    jdAnalysis
  );

  const match_id = generateMatchId();

  return {
    match_id,
    jd_id: jdAnalysis.jd_id,
    user_id: userId,
    profile_id: 'default',
    overall_score: overallScore,
    score_breakdown: scoreBreakdown,
    matched_elements: matchedElements,
    missing_elements: missingElements,
    suggestions,
    potential_score: potentialScore,
    potential_breakdown: potentialBreakdown,
    summary,
    created_at: new Date().toISOString(),
  };
}

// ============================================
// SKILLS MATCHING
// ============================================

/**
 * Compare JD skills with user skills using exact, fuzzy, and semantic matching
 */
async function calculateSkillsMatch(
  requiredSkills: JobDescriptionAnalysis['required_skills'],
  niceToHaveSkills: JobDescriptionAnalysis['nice_to_have_skills'],
  coreSkills: FormData['coreSkills'],
  softSkills: FormData['softSkills'],
  tools: FormData['tools']
): Promise<{
  score: number;
  matched: string[];
  total_required: number;
  details: {
    exact_matches: string[];
    fuzzy_matches: string[];
    semantic_matches: string[];
  };
}> {
  // Flatten user's skills into single normalized array
  const allUserSkills = [
    ...flattenCoreSkills(coreSkills || {}),
    ...(softSkills || []),
    ...(tools || []),
  ].map(s => s.toLowerCase().trim());

  const allRequiredSkills = [...requiredSkills, ...niceToHaveSkills];
  const exactMatches: string[] = [];
  const fuzzyMatches: string[] = [];
  const semanticMatches: string[] = [];

  let totalPoints = 0;
  const maxPoints = allRequiredSkills.reduce((sum, skill) => {
    const weight = getSkillWeight(skill.importance);
    return sum + weight;
  }, 0);

  // Check each required skill against user's skills
  for (const requiredSkill of allRequiredSkills) {
    const skillName = requiredSkill.skill.toLowerCase().trim();
    const weight = getSkillWeight(requiredSkill.importance);

    // Exact match check
    if (allUserSkills.includes(skillName)) {
      exactMatches.push(requiredSkill.skill);
      totalPoints += weight;
      continue;
    }

    // Fuzzy match check (Levenshtein distance)
    const fuzzyMatch = allUserSkills.find(userSkill => 
      calculateSimilarity(userSkill, skillName) > 0.85
    );

    if (fuzzyMatch) {
      fuzzyMatches.push(requiredSkill.skill);
      totalPoints += weight * 0.9; // 90% credit
      continue;
    }

    // Semantic match check (aliases and related terms)
    const semanticMatch = checkSemanticMatch(skillName, allUserSkills);
    if (semanticMatch) {
      semanticMatches.push(requiredSkill.skill);
      totalPoints += weight * 0.7; // 70% credit
    }
  }

  const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  const matched = [...exactMatches, ...fuzzyMatches, ...semanticMatches];

  return {
    score,
    matched,
    total_required: allRequiredSkills.length,
    details: {
      exact_matches: exactMatches,
      fuzzy_matches: fuzzyMatches,
      semantic_matches: semanticMatches,
    },
  };
}

// Convert skill importance to numeric weight
function getSkillWeight(importance: string): number {
  const weights: Record<string, number> = {
    critical: 100,
    high: 80,
    medium: 60,
    low: 40,
  };
  return weights[importance] || 50;
}

// Flatten nested coreSkills object to array
function flattenCoreSkills(coreSkills: Record<string, string[]>): string[] {
  const skills: string[] = [];
  for (const category in coreSkills) {
    if (Array.isArray(coreSkills[category])) {
      skills.push(...coreSkills[category]);
    }
  }
  return skills;
}

// Calculate string similarity using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance algorithm for fuzzy string matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Check semantic equivalence using common aliases
function checkSemanticMatch(skill: string, userSkills: string[]): boolean {
  const semanticMap: Record<string, string[]> = {
    'react': ['reactjs', 'react.js'],
    'node': ['nodejs', 'node.js'],
    'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
    'typescript': ['ts'],
    'docker': ['containerization', 'containers'],
    'kubernetes': ['k8s'],
    'postgresql': ['postgres', 'psql'],
    'mongodb': ['mongo'],
    'aws': ['amazon web services'],
    'gcp': ['google cloud', 'google cloud platform'],
    'ci/cd': ['continuous integration', 'continuous deployment', 'cicd'],
    'rest': ['rest api', 'restful', 'rest apis'],
    'graphql': ['graph ql'],
  };

  const aliases = semanticMap[skill] || [];
  return userSkills.some(userSkill => 
    aliases.includes(userSkill) || 
    userSkill.includes(skill) || 
    skill.includes(userSkill)
  );
}

// ============================================
// EXPERIENCE MATCHING
// ============================================

/**
 * Calculate how well user's experience matches JD requirements
 */
function calculateExperienceMatch(
  requiredExp: JobDescriptionAnalysis['experience_required'],
  userExperiences: NonNullable<FormData['experience']>
): {
  score: number;
  details: string;
  yearsMatch: number;
  levelMatch: number;
} {
  const totalYears = calculateTotalYears(userExperiences);

  // Calculate years match score
  let yearsMatch = 0;
  if (totalYears >= requiredExp.min_years && totalYears <= requiredExp.max_years) {
    yearsMatch = 100; // Perfect fit
  } else if (totalYears < requiredExp.min_years) {
    const deficit = requiredExp.min_years - totalYears;
    yearsMatch = Math.max(0, 100 - (deficit * 20)); // -20% per year below
  } else {
    const excess = totalYears - requiredExp.max_years;
    yearsMatch = Math.max(80, 100 - (excess * 5)); // -5% per year above, min 80%
  }

  // Calculate level match score
  const userLevel = determineUserLevel(userExperiences);
  const levelMatch = calculateLevelMatch(userLevel, requiredExp.level);

  // Weighted combination (60% years, 40% level)
  const score = Math.round((yearsMatch * 0.6) + (levelMatch * 0.4));
  const details = `${totalYears} years (required: ${requiredExp.min_years}-${requiredExp.max_years}), Level: ${userLevel}`;

  return { score, details, yearsMatch, levelMatch };
}

// Calculate total years of experience from all jobs
function calculateTotalYears(experiences: NonNullable<FormData['experience']>): number {
  let totalMonths = 0;

  experiences.forEach(exp => {
    const start = new Date(exp.startDate);
    const end = exp.currentlyWorking ? new Date() : new Date(exp.endDate || new Date());
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    totalMonths += Math.max(0, months);
  });

  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal
}

// Determine user's experience level from job titles and years
function determineUserLevel(experiences: NonNullable<FormData['experience']>): string {
  if (experiences.length === 0) return 'entry';

  // Get most recent role
  const sortedExps = [...experiences].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const latestRole = sortedExps[0].role.toLowerCase();

  if (latestRole.includes('principal') || latestRole.includes('architect')) return 'principal';
  if (latestRole.includes('lead') || latestRole.includes('staff')) return 'lead';
  if (latestRole.includes('senior') || latestRole.includes('sr')) return 'senior';
  if (latestRole.includes('junior') || latestRole.includes('jr')) return 'junior';
  
  // Fallback to years of experience
  const totalYears = calculateTotalYears(experiences);
  if (totalYears >= 8) return 'senior';
  if (totalYears >= 5) return 'mid';
  if (totalYears >= 2) return 'junior';
  return 'entry';
}

// Calculate how close user's level is to required level
function calculateLevelMatch(userLevel: string, requiredLevel: string): number {
  const levels = ['entry', 'junior', 'mid', 'senior', 'lead', 'principal'];
  const userIndex = levels.indexOf(userLevel);
  const requiredIndex = levels.indexOf(requiredLevel);

  if (userIndex === requiredIndex) return 100;
  
  const difference = Math.abs(userIndex - requiredIndex);
  if (difference === 1) return 85;
  if (difference === 2) return 65;
  return Math.max(40, 100 - (difference * 20));
}

// ============================================
// KEYWORD MATCHING
// ============================================

/**
 * Check how many ATS keywords from JD appear in user's profile
 */
function calculateKeywordMatch(
  atsKeywords: string[],
  masterProfile: FormData
): {
  score: number;
  matched_count: number;
  total_keywords: number;
  matched_keywords: string[];
  missing_keywords: string[];
} {
  const profileText = combineProfileText(masterProfile).toLowerCase();

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  // Check each keyword presence in profile
  atsKeywords.forEach(keyword => {
    const normalizedKeyword = keyword.toLowerCase();
    
    if (profileText.includes(normalizedKeyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const score = atsKeywords.length > 0 
    ? Math.round((matchedKeywords.length / atsKeywords.length) * 100)
    : 100;

  return {
    score,
    matched_count: matchedKeywords.length,
    total_keywords: atsKeywords.length,
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
  };
}

// Combine all profile text for keyword searching
function combineProfileText(profile: FormData): string {
  const textParts: string[] = [];

  if (profile.summary) textParts.push(profile.summary);

  if (profile.experience) {
    profile.experience.forEach(exp => {
      textParts.push(exp.role || '');
      textParts.push(exp.company || '');
      textParts.push(exp.responsibilities || '');
      textParts.push(exp.summary || '');
      if (exp.skillsUsed) textParts.push(...exp.skillsUsed);
    });
  }

  if (profile.projects) {
    profile.projects.forEach(proj => {
      textParts.push(proj.title || '');
      textParts.push(proj.description || '');
      textParts.push(proj.summary || '');
      textParts.push(proj.highlights || '');
      if (proj.technologies) textParts.push(...proj.technologies);
    });
  }

  if (profile.achievements) {
    profile.achievements.forEach(ach => {
      textParts.push(ach.title || '');
      textParts.push(ach.description || '');
      textParts.push(ach.impact || '');
    });
  }

  return textParts.join(' ');
}

// ============================================
// REQUIREMENTS MATCHING
// ============================================

/**
 * Match JD responsibilities with user's experience and projects
 */
async function calculateRequirementsMatch(
  responsibilities: string[],
  userExperiences: NonNullable<FormData['experience']>,
  userProjects: NonNullable<FormData['projects']>
): Promise<{
  score: number;
  matched_responsibilities: number;
  total_responsibilities: number;
  details: Array<{ responsibility: string; match_score: number; source: string }>;
}> {
  if (responsibilities.length === 0) {
    return {
      score: 100,
      matched_responsibilities: 0,
      total_responsibilities: 0,
      details: [],
    };
  }

  const details: Array<{ responsibility: string; match_score: number; source: string }> = [];
  let totalScore = 0;

  // Match each responsibility with best experience/project
  for (const responsibility of responsibilities.slice(0, 10)) {
    const bestMatch = findBestMatchForResponsibility(
      responsibility,
      userExperiences,
      userProjects
    );

    details.push({
      responsibility,
      match_score: bestMatch.score,
      source: bestMatch.source,
    });

    totalScore += bestMatch.score;
  }

  const averageScore = Math.round(totalScore / responsibilities.length);
  const matchedCount = details.filter(d => d.match_score >= 70).length;

  return {
    score: averageScore,
    matched_responsibilities: matchedCount,
    total_responsibilities: responsibilities.length,
    details,
  };
}

// Find best matching experience/project for a responsibility using keyword overlap
function findBestMatchForResponsibility(
  responsibility: string,
  experiences: NonNullable<FormData['experience']>,
  projects: NonNullable<FormData['projects']>
): { score: number; source: string } {
  const experienceTexts = experiences.map(exp => 
    `${exp.role} at ${exp.company}: ${exp.responsibilities || exp.summary || ''}`
  );

  const projectTexts = projects.map(proj => 
    `Project ${proj.title}: ${proj.description || proj.summary || ''}`
  );

  const allTexts = [...experienceTexts, ...projectTexts];

  if (allTexts.length === 0) {
    return { score: 0, source: 'No experience or projects found' };
  }

  let bestScore = 0;
  let bestSource = 'No match found';

  const responsibilityWords = responsibility.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  allTexts.forEach((text, index) => {
    const textLower = text.toLowerCase();
    let matchCount = 0;

    responsibilityWords.forEach(word => {
      if (textLower.includes(word)) {
        matchCount++;
      }
    });

    const score = (matchCount / responsibilityWords.length) * 100;

    if (score > bestScore) {
      bestScore = score;
      bestSource = index < experiences.length 
        ? `Experience: ${experiences[index].role}` 
        : `Project: ${projects[index - experiences.length].title}`;
    }
  });

  return {
    score: Math.round(bestScore),
    source: bestSource,
  };
}

// ============================================
// BUILD MATCHED ELEMENTS
// ============================================

/**
 * Structure all matched elements from profile
 */
function buildMatchedElements(
  skillsMatch: Awaited<ReturnType<typeof calculateSkillsMatch>>,
  experienceMatch: ReturnType<typeof calculateExperienceMatch>,
  requirementsMatch: Awaited<ReturnType<typeof calculateRequirementsMatch>>,
  masterProfile: FormData
): MatchedElements {
  const skills: SkillsMatch = {
    matched: skillsMatch.matched,
    count: skillsMatch.matched.length,
    total_required: skillsMatch.total_required,
    match_percentage: skillsMatch.score,
    details: skillsMatch.details,
  };

  const experiences: ExperienceMatch[] = (masterProfile.experience || [])
    .map(exp => ({
      experience_id: generateId('exp'),
      company: exp.company || '',
      role: exp.role || '',
      relevance_score: calculateExpRelevance(exp, requirementsMatch.details),
      matching_points: extractMatchingPoints(exp),
      duration: `${exp.startDate} - ${exp.currentlyWorking ? 'Present' : exp.endDate}`,
    }))
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 5);

  const projects: ProjectMatch[] = (masterProfile.projects || [])
    .map(proj => ({
      project_id: generateId('proj'),
      title: proj.title || '',
      relevance_score: Math.round(Math.random() * 30 + 70), // 70-100 range
      matching_points: [proj.summary || proj.description || ''].filter(Boolean),
      technologies_matched: proj.technologies || [],
    }))
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 3);

  const certifications: CertificationMatch[] = (masterProfile.certifications || [])
    .map(cert => ({
      cert_id: generateId('cert'),
      name: cert.name || '',
      relevance_score: 70,
      skills_covered: cert.skills || [],
    }))
    .slice(0, 5);

  const education: EducationMatch[] = (masterProfile.education || [])
    .map(edu => ({
      degree: edu.degree || '',
      field: edu.field || '',
      institution: edu.institution || '',
      relevance_score: 80,
    }));

  return { skills, experiences, projects, certifications, education };
}

// Calculate experience relevance based on requirement matches
function calculateExpRelevance(
  experience: NonNullable<FormData['experience']>[0],
  requirementMatches: Array<{ responsibility: string; match_score: number; source: string }>
): number {
  const expText = `${experience.role} at ${experience.company}`;
  const relevantMatches = requirementMatches.filter(rm => rm.source.includes(experience.role || ''));
  
  if (relevantMatches.length > 0) {
    return Math.round(relevantMatches.reduce((sum, rm) => sum + rm.match_score, 0) / relevantMatches.length);
  }

  return 60;
}

// Extract key points from experience
function extractMatchingPoints(experience: NonNullable<FormData['experience']>[0]): string[] {
  const points: string[] = [];

  if (experience.responsibilities) {
    const sentences = experience.responsibilities.split('.').filter(s => s.trim().length > 20);
    points.push(...sentences.slice(0, 3));
  }

  if (experience.skillsUsed && experience.skillsUsed.length > 0) {
    points.push(`Skills: ${experience.skillsUsed.slice(0, 5).join(', ')}`);
  }

  return points;
}

// ============================================
// BUILD MISSING ELEMENTS
// ============================================

/**
 * Identify gaps between JD requirements and user profile
 */
function buildMissingElements(
  skillsMatch: Awaited<ReturnType<typeof calculateSkillsMatch>>,
  keywordMatch: ReturnType<typeof calculateKeywordMatch>,
  jdAnalysis: JobDescriptionAnalysis,
  masterProfile: FormData
): MissingElements {
  const allMatchedSkills = skillsMatch.matched.map(s => s.toLowerCase());

  // Missing critical skills
  const criticalSkills: MissingSkill[] = jdAnalysis.required_skills
    .filter(skill => skill.importance === 'critical' && !allMatchedSkills.includes(skill.skill.toLowerCase()))
    .map(skill => ({
      skill: skill.skill,
      importance: 'critical',
      mentions_in_jd: skill.mentions,
      impact: `+${Math.min(5, skill.mentions)}%`,
      category: skill.category,
    }));

  // Missing nice-to-have skills
  const niceToHaveSkills: MissingSkill[] = jdAnalysis.nice_to_have_skills
    .filter(skill => !allMatchedSkills.includes(skill.skill.toLowerCase()))
    .map(skill => ({
      skill: skill.skill,
      importance: skill.importance as 'high' | 'medium' | 'low',
      mentions_in_jd: skill.mentions,
      impact: `+${Math.min(3, skill.mentions)}%`,
      category: skill.category,
    }))
    .slice(0, 10);

  const missingKeywords = keywordMatch.missing_keywords.slice(0, 15);

  // Identify weak areas
  const weakAreas: WeakArea[] = [];

  if (!checkForQuantification(masterProfile)) {
    weakAreas.push({
      area: 'Achievement Quantification',
      issue: 'Experiences lack quantified achievements',
      suggestion: 'Add metrics: "Improved performance by 40%", "Led team of 5"',
      impact: 'medium',
    });
  }

  if (!checkForStrongVerbs(masterProfile)) {
    weakAreas.push({
      area: 'Action Verbs',
      issue: 'Using weak verbs like "worked on", "responsible for"',
      suggestion: 'Use: led, architected, optimized, delivered, implemented',
      impact: 'low',
    });
  }

  return {
    critical_skills: criticalSkills,
    nice_to_have_skills: niceToHaveSkills,
    missing_keywords: missingKeywords,
    weak_areas: weakAreas,
  };
}

// Check if profile has quantified achievements with numbers
function checkForQuantification(profile: FormData): boolean {
  const text = combineProfileText(profile);
  return /\d+%|\d+x|\d+\+|\$\d+/i.test(text);
}

// Check if profile uses strong action verbs
function checkForStrongVerbs(profile: FormData): boolean {
  const text = combineProfileText(profile).toLowerCase();
  const weakVerbs = ['worked on', 'responsible for', 'helped with', 'assisted'];
  const strongVerbs = ['led', 'architected', 'optimized', 'delivered', 'implemented', 'designed', 'built'];

  const weakVerbCount = weakVerbs.filter(verb => text.includes(verb)).length;
  const strongVerbCount = strongVerbs.filter(verb => text.includes(verb)).length;

  return strongVerbCount > weakVerbCount;
}

// ============================================
// GENERATE SUGGESTIONS
// ============================================

/**
 * Create actionable suggestions (limited for free users)
 */
function generateSuggestions(
  missingElements: MissingElements,
  matchedElements: MatchedElements,
  jdAnalysis: JobDescriptionAnalysis,
  masterProfile: FormData,
  isPremium: boolean
): Suggestions {
  const immediateActions: SuggestionItem[] = [];
  const profileImprovements: SuggestionItem[] = [];
  const contentOptimization: SuggestionItem[] = [];

  // Add critical missing skills
  missingElements.critical_skills.forEach((skill, index) => {
    if (immediateActions.length < 5) {
      immediateActions.push({
        type: 'add_skill',
        action: `Add "${skill.skill}" to your skills section`,
        impact: 'high',
        improvement: skill.impact,
        priority: 10 - index,
      });
    }
  });

  // Add nice-to-have skills
  missingElements.nice_to_have_skills.slice(0, 3).forEach((skill, index) => {
    immediateActions.push({
      type: 'add_skill',
      action: `Consider adding "${skill.skill}" if you have experience`,
      impact: 'medium',
      improvement: skill.impact,
      priority: 5 - index,
    });
  });

  // Profile improvements
  missingElements.weak_areas.forEach(wa => {
    profileImprovements.push({
      type: wa.area === 'Achievement Quantification' ? 'quantify_achievement' : 'action_verb',
      action: wa.suggestion,
      impact: wa.impact as 'high' | 'medium' | 'low',
      priority: 8,
    });
  });

  // Add certifications suggestion
  if (jdAnalysis.required_skills.some(skill => skill.category === 'cloud')) {
    profileImprovements.push({
      type: 'add_certification',
      action: 'Consider cloud certifications (AWS, Azure, or GCP)',
      impact: 'medium',
      priority: 6,
    });
  }

  // Premium only: Content optimization
  if (isPremium) {
    missingElements.missing_keywords.slice(0, 5).forEach((keyword, index) => {
      contentOptimization.push({
        type: 'keyword_enhancement',
        action: `Include "${keyword}" naturally in your experience descriptions`,
        impact:'low',
        priority: 5 - index,
      });
    });

    // Suggest reordering experiences to highlight most relevant
    if (matchedElements.experiences.length > 0) {
      contentOptimization.push({
        type: 'reorder_section',
        action: `Highlight your most relevant experience: "${matchedElements.experiences[0].role}" at ${matchedElements.experiences[0].company}`,
        impact: 'medium',
        priority: 7,
      });
    }

    // Suggest improving weak areas with specific examples
    missingElements.weak_areas.forEach(wa => {
      contentOptimization.push({
        type: wa.area === 'Achievement Quantification' ? 'quantify_achievement' : 'action_verb',
        action: wa.suggestion,
        impact: wa.impact as 'high' | 'medium' | 'low',
        priority: 4,
      });
    });

    // Suggest adding relevant projects if user has few
    if (matchedElements.projects.length < 2) {
      contentOptimization.push({
        type: 'add_project',
        action: 'Add more relevant projects to demonstrate your skills',
        impact: 'medium',
        priority: 5,
      });
    }

    // Suggest adding experience details if descriptions are short
    const hasShortDescriptions = (masterProfile.experience || []).some(exp => {
      const descLength = (exp.responsibilities || exp.summary || '').length;
      return descLength < 100;
    });

    if (hasShortDescriptions) {
      contentOptimization.push({
        type: 'add_experience_detail',
        action: 'Expand experience descriptions with more details about your contributions',
        impact: 'medium',
        priority: 6,
      });
    }
  }

  // Apply FREE tier limits
  if (!isPremium) {
    const limitedImmediate = immediateActions.slice(0, 3);
    const limitedProfile = profileImprovements.slice(0, 2);
    
    const totalHidden = (immediateActions.length - 3) + 
                        (profileImprovements.length - 2) + 
                        contentOptimization.length;

    return {
      immediate_actions: limitedImmediate,
      profile_improvements: limitedProfile,
      content_optimization: [],
      upgrade_message: totalHidden > 0 
        ? `Upgrade to PRO to unlock ${totalHidden} more personalized suggestions and boost your match score!`
        : undefined,
    };
  }

  // Premium: all suggestions sorted by priority
  return {
    immediate_actions: immediateActions.sort((a, b) => (b.priority || 0) - (a.priority || 0)),
    profile_improvements: profileImprovements.sort((a, b) => (b.priority || 0) - (a.priority || 0)),
    content_optimization: contentOptimization.sort((a, b) => (b.priority || 0) - (a.priority || 0)),
  };
}

// ============================================
// CALCULATE POTENTIAL SCORE
// ============================================

/**
 * Calculate potential score if user implements suggestions (premium only)
 */
function calculatePotentialScore(
  currentScore: number,
  missingElements: MissingElements
): { score: number; breakdown: PotentialBreakdown } {
  let potentialIncrease = 0;
  const details: Array<{ action: string; impact: string; difficulty: 'easy' | 'medium' | 'hard' }> = [];

  // Critical skills impact
  const criticalImpact = missingElements.critical_skills.reduce((sum, skill) => {
    const impact = parseInt(skill.impact.replace('+', '').replace('%', ''));
    details.push({
      action: `Add ${skill.skill}`,
      impact: `+${impact}%`,
      difficulty: 'medium',
    });
    return sum + impact;
  }, 0);

  // Nice-to-have skills impact (limit to top 5)
  const niceToHaveImpact = missingElements.nice_to_have_skills.slice(0, 5).reduce((sum, skill) => {
    const impact = parseInt(skill.impact.replace('+', '').replace('%', ''));
    details.push({
      action: `Add ${skill.skill}`,
      impact: `+${impact}%`,
      difficulty: 'easy',
    });
    return sum + impact;
  }, 0);

  // Content improvements impact (2% per improvement)
  const contentImpact = missingElements.weak_areas.length * 2;
  if (missingElements.weak_areas.length > 0) {
    details.push({
      action: 'Quantify achievements and use strong action verbs',
      impact: `+${contentImpact}%`,
      difficulty: 'easy',
    });
  }

  // Keyword optimization impact (1% per 5 missing keywords)
  const keywordImpact = Math.min(3, Math.ceil(missingElements.missing_keywords.length / 5));
  if (keywordImpact > 0) {
    details.push({
      action: 'Add missing ATS keywords to your profile',
      impact: `+${keywordImpact}%`,
      difficulty: 'easy',
    });
  }

  potentialIncrease = criticalImpact + niceToHaveImpact + contentImpact + keywordImpact;

  // Cap at realistic maximum (95%)
  const maxScore = 95;
  const potentialScore = Math.min(maxScore, currentScore + potentialIncrease);

  return {
    score: Math.round(potentialScore),
    breakdown: {
      current: currentScore,
      add_critical_skills: `+${criticalImpact}%`,
      add_nice_to_have: `+${niceToHaveImpact}%`,
      content_improvements: `+${contentImpact}%`,
      total_potential: Math.round(potentialScore),
      detailed_breakdown: details,
    },
  };
}

// ============================================
// GENERATE MATCH SUMMARY
// ============================================

/**
 * Create human-readable summary of match results
 */
function generateMatchSummary(
  overallScore: number,
  potentialScore: number | undefined,
  matchedElements: MatchedElements,
  missingElements: MissingElements,
  jdAnalysis: JobDescriptionAnalysis
): MatchSummary {
  let verdict: MatchSummary['verdict'];
  let message: string;

  // Determine verdict based on overall score
  if (overallScore >= 85) {
    verdict = 'excellent';
    message = `Excellent match! Your profile aligns very well with this ${jdAnalysis.job_title} position.`;
  } else if (overallScore >= 75) {
    verdict = 'strong_match';
    message = `Strong match! You meet most requirements for this ${jdAnalysis.job_title} role.`;
  } else if (overallScore >= 65) {
    verdict = 'moderate_match';
    message = `Moderate match. You have relevant experience, but there are some gaps to address.`;
  } else if (overallScore >= 50) {
    verdict = 'weak_match';
    message = `Weak match. Significant skill and experience gaps exist for this ${jdAnalysis.job_title} position.`;
  } else {
    verdict = 'poor_match';
    message = `Poor match. This role may not be the best fit for your current profile.`;
  }

  // Add potential score context if available
  if (potentialScore && potentialScore > overallScore + 5) {
    message += ` However, you could reach ${potentialScore}% with some improvements!`;
  }

  // Identify main strengths
  const mainStrengths: string[] = [];
  
  if (matchedElements.skills.match_percentage >= 70) {
    mainStrengths.push(`Strong skill match (${matchedElements.skills.match_percentage}%)`);
  }
  
  if (matchedElements.experiences.length > 0 && matchedElements.experiences[0].relevance_score >= 80) {
    mainStrengths.push(`Highly relevant experience at ${matchedElements.experiences[0].company}`);
  }
  
  if (matchedElements.projects.length >= 2) {
    mainStrengths.push(`${matchedElements.projects.length} relevant projects demonstrating skills`);
  }
  
  if (matchedElements.certifications.length > 0) {
    mainStrengths.push(`Professional certifications (${matchedElements.certifications.length})`);
  }
  
  if (matchedElements.skills.details.exact_matches.length >= 5) {
    mainStrengths.push(`${matchedElements.skills.details.exact_matches.length} exact skill matches`);
  }

  // Identify main weaknesses
  const mainWeaknesses: string[] = [];
  
  if (missingElements.critical_skills.length > 0) {
    mainWeaknesses.push(`Missing ${missingElements.critical_skills.length} critical skill${missingElements.critical_skills.length > 1 ? 's' : ''}: ${missingElements.critical_skills.slice(0, 3).map(s => s.skill).join(', ')}`);
  }
  
  if (matchedElements.skills.match_percentage < 60) {
    mainWeaknesses.push(`Low skill match (${matchedElements.skills.match_percentage}%)`);
  }
  
  if (missingElements.weak_areas.length > 0) {
    mainWeaknesses.push(missingElements.weak_areas[0].issue);
  }
  
  if (missingElements.missing_keywords.length > 10) {
    mainWeaknesses.push(`Missing ${missingElements.missing_keywords.length} important ATS keywords`);
  }

  // Estimate ATS pass rate based on overall score
  let atsPassRate: string;
  if (overallScore >= 85) {
    atsPassRate = '90-98%';
  } else if (overallScore >= 75) {
    atsPassRate = '75-90%';
  } else if (overallScore >= 65) {
    atsPassRate = '60-75%';
  } else if (overallScore >= 50) {
    atsPassRate = '40-60%';
  } else {
    atsPassRate = '20-40%';
  }

  // Identify competitive advantage
  let competitiveAdvantage: string | undefined;
  
  if (matchedElements.certifications.length > 0) {
    competitiveAdvantage = `Your ${matchedElements.certifications[0].name} certification gives you a competitive edge.`;
  } else if (matchedElements.experiences.length > 0 && matchedElements.experiences[0].relevance_score >= 90) {
    competitiveAdvantage = `Your highly relevant experience at ${matchedElements.experiences[0].company} is a strong advantage.`;
  } else if (matchedElements.skills.details.exact_matches.length >= 8) {
    competitiveAdvantage = `Your strong technical skill set with ${matchedElements.skills.details.exact_matches.length} exact matches stands out.`;
  } else if (matchedElements.projects.length >= 3) {
    competitiveAdvantage = `Your portfolio of ${matchedElements.projects.length} projects demonstrates practical experience.`;
  }

  return {
    verdict,
    message,
    estimated_ats_pass_rate: atsPassRate,
    competitive_advantage: competitiveAdvantage,
    main_strengths: mainStrengths,
    main_weaknesses: mainWeaknesses,
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate unique ID with prefix
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate unique match ID
 */
function generateMatchId(): string {
  return generateId('match');
}