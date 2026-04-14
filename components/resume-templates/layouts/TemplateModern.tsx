import React from "react";
import { FaGithub, FaExternalLinkAlt, FaLink } from "react-icons/fa";
import { ResumeData } from "@/types/resume";
import { formatSkills } from "@/utils/formatSkills";

interface TemplateModernProps {
  resumeData: ResumeData;
  pageItems: Array<{
    section: keyof ResumeData;
    type: "header" | "item";
    itemIndex?: number;
  }>;
  editingSection: keyof ResumeData | null;
  showHeader?: boolean;
}

export default function TemplateModern({
  resumeData,
  pageItems,
  editingSection,
  showHeader = true,
}: TemplateModernProps) {
  /* ------------------ GROUP PAGE ITEMS ------------------ */
  const sections: Record<string, { header: boolean; items: number[] }> = {};

  pageItems.forEach((item) => {
    if (!sections[item.section]) {
      sections[item.section] = { header: false, items: [] };
    }
    if (item.type === "header") sections[item.section].header = true;
    if (item.type === "item" && item.itemIndex !== undefined) {
      sections[item.section].items.push(item.itemIndex);
    }
  });

  /* ------------------ PERSONAL DATA ------------------ */
  const personal = resumeData.personal?.data;

  const renderContactRow = () => {
    if (!personal) return null;

    const items: React.ReactNode[] = [];

    if (personal.email) items.push(<span key="email">{personal.email}</span>);
    if (personal.phone) items.push(<span key="phone">{personal.phone}</span>);
    if (personal.location)
      items.push(<span key="location">{personal.location}</span>);

    if (personal.linkedin) {
      items.push(
        <a
          key="linkedin"
          href={personal.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          linkedin
        </a>,
      );
    }

    if (personal.github) {
      items.push(
        <a
          key="github"
          href={personal.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex gap-1 items-center"
        >
          <FaGithub /> github
        </a>,
      );
    }

    if (personal.portfolio) {
      items.push(
        <a
          key="portfolio"
          href={personal.portfolio}
          target="_blank"
          rel="noreferrer"
          className="inline-flex gap-1 items-center"
        >
          <FaExternalLinkAlt /> portfolio
        </a>,
      );
    }

    return (
      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-gray-400">•</span>}
            {item}
          </React.Fragment>
        ))}
      </div>
    );
  };

  /* ------------------ RENDER ------------------ */
  return (
    <div className="space-y-6 text-gray-900 h-full">
      {/* ================= HEADER ================= */}
      {showHeader && personal && (
        <div className="border-b pb-3">
          <h1 className="text-3xl font-bold">{personal.fullName}</h1>
          {personal.title && (
            <div className="text-sm text-gray-700">{personal.title}</div>
          )}
          {renderContactRow()}
        </div>
      )}

      {/* ================= SECTIONS ================= */}
      {Object.entries(sections).map(([sectionKey, sectionData]) => {
        const section = resumeData[sectionKey as keyof ResumeData];
        if (!section || !section.visible) return null;

        return (
          <div
            key={sectionKey}
            className={`space-y-3 ${
              editingSection === sectionKey
                ? "ring-2 ring-purple-500 rounded-lg p-3 bg-purple-50"
                : ""
            }`}
          >
            {/* ---------- SECTION HEADER ---------- */}
            {sectionData.header && (
              <h2 className="text-lg font-bold uppercase tracking-wide border-b pb-1">
                {sectionKey}
              </h2>
            )}

            {/* ---------- SUMMARY ---------- */}
            {sectionKey === "summary" && (
              <p className="text-sm leading-relaxed">{section.data}</p>
            )}

            {/* ---------- SKILLS (DYNAMIC) ---------- */}
            {sectionKey === "skills" && typeof section.data === "object" && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(section.data).map(([category, skills]) => (
                  <div key={category}>
                    <div className="font-semibold">{category}</div>
                    <div className="text-gray-700">
                      {formatSkills(skills)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ---------- EXPERIENCE ---------- */}
            {sectionKey === "experience" && Array.isArray(section.data) && (
              <div className="space-y-4">
                {sectionData.items.map((idx) => {
                  const exp = section.data[idx];
                  // console.log(exp,"experience data");

                  return (
                    <div key={idx}>
                      <div className="flex justify-between">
                        <div className="font-semibold">{exp.role}</div>
                        <div className="text-xs text-gray-600">
                          {exp.duration}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 italic">
                        {exp.company} • {exp.location}
                      </div>
                      {Array.isArray(exp.responsibilities) &&
                        exp.responsibilities.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-0.5">
                            {exp.responsibilities.map(
                              (item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ),
                            )}
                          </ul>
                        )}

                      {typeof exp.responsibilities === "string" && (
                        <p className="text-xs text-gray-700 mt-1">
                          {exp.responsibilities}
                        </p>
                      )}

                      {exp.skillsUsed && (
                        <div className="text-xs italic mt-1">
                          {exp.skillsUsed.join(", ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---------- PROJECTS ---------- */}
            {sectionKey === "projects" && Array.isArray(section.data) && (
              <div className="space-y-2">
                {sectionData.items.map((idx: number) => {
                  const proj = section.data[idx];
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-sm">
                          {proj?.title} {proj?.role ? `| ${proj?.role}` : ""}
                        </div>
                        <div className="flex items-center gap-2">
                          {proj?.github && (
                            <a
                              href={proj?.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-black inline-flex items-center gap-1"
                            >
                              <FaGithub size={12} />
                            </a>
                          )}
                          {proj?.link && (
                            <a
                              href={proj?.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-black inline-flex items-center gap-1"
                            >
                              <FaExternalLinkAlt size={10} />
                            </a>
                          )}
                        </div>
                      </div>

                      {proj?.technologies && (
                        <div className="text-xs italic text-gray-600">
                          {proj?.technologies.join(", ")}
                        </div>
                      )}
                      <div className="text-xs text-gray-700 mt-0.5">
                        {proj?.description}
                      </div>
                      {proj?.impact && (
                        <div className="text-xs text-gray-600 mt-0.5 whitespace-pre-line">
                          {proj?.impact}
                        </div>
                      )}
                      {Array.isArray(proj?.highlights) &&
                        proj.highlights.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-gray-700 ml-3 space-y-0.5">
                            {proj.highlights.map((h: string, i: number) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---------- EDUCATION ---------- */}
            {sectionKey === "education" && Array.isArray(section.data) && (
              <div className="space-y-3">
                {sectionData.items.map((idx) => {
                  const edu = section.data[idx];
                  return (
                    <div key={idx}>
                      <div className="flex justify-between">
                        <div className="font-semibold">
                          {edu?.degree} – {edu?.field}
                        </div>
                        <div className="text-xs text-gray-600">
                          {edu?.startDate} – {edu?.endDate}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {edu?.institution} • {edu?.location}
                      </div>
                      {edu?.grade && (
                        <div className="text-sm text-gray-600">
                          Grade: {edu?.grade}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---------- CERTIFICATIONS ---------- */}
            {sectionKey === "certifications" && Array.isArray(section.data) && (
              <div className="space-y-2 text-sm">
                {sectionData.items.map((idx) => {
                  const c = section.data[idx];
                  return (
                    <div key={idx}>
                      <span className="font-semibold">{c?.name}</span>
                      <span className="text-gray-600"> • {c?.issuer}</span>
                      {c?.issueDate && (
                        <span className="text-gray-500"> ({c?.issueDate})</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---------- ACHIEVEMENTS ---------- */}
            {sectionKey === "achievements" && Array.isArray(section.data) && (
              <div className="space-y-2 text-sm">
                {sectionData.items.map((idx) => {
                  const a = section.data[idx];
                  return (
                    <div key={idx}>
                      <div className="font-semibold">{a?.title}</div>
                      <div className="text-gray-600">
                        {a?.organization} • {a?.date}
                      </div>
                      <div>{a?.description}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
