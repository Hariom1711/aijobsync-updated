import { FormData } from "@/types/profileWizard";

export type ProfileCompletion = {
  completeness: number;
  missingSections: string[];
  completedSections: string[];
};

export function calculateProfileCompletion(
  formData: FormData
): ProfileCompletion {
  const sections = [
    { id: "personal", isEmpty: !formData.fullName },
    { id: "education", isEmpty: !formData.education?.length },
    { id: "experience", isEmpty: !formData.experience?.length },
    { id: "projects", isEmpty: !formData.projects?.length },
    {
      id: "skills",
      isEmpty:
        Object.keys(formData.coreSkills || {}).length === 0 &&
        !formData.softSkills?.length &&
        !formData.tools?.length,
    },
    {
      id: "extras",
      isEmpty:
        !formData.certifications?.length &&
        !formData.achievements?.length,
    },
  ];

  const completed = sections.filter((s) => !s.isEmpty);
  const missing = sections.filter((s) => s.isEmpty);

  return {
    completeness: Math.round((completed.length / sections.length) * 100),
    completedSections: completed.map((s) => s.id),
    missingSections: missing.map((s) => s.id),
  };
}
