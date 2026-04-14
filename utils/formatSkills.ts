export function formatSkills(skills: unknown, separator = ", "): string {
  if (Array.isArray(skills)) {
    return skills.join(separator);
  }

  if (typeof skills === "string") {
    return skills;
  }

  if (skills && typeof skills === "object") {
    return Object.values(skills)
      .flat()
      .filter(Boolean)
      .join(separator);
  }

  return "";
}