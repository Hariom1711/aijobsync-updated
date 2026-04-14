/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { ResumeData } from "@/types/resume";
import { formatSkills } from "@/utils/formatSkills";

interface TemplateMinimalProps {
  resumeData: ResumeData;
  pageItems: Array<{
    section: string;
    type: "header" | "item";
    itemIndex?: number;
  }>;
  editingSection: keyof ResumeData | null;
  showHeader?: boolean;
}

export default function TemplateMinimal({
  resumeData,
  pageItems,
  editingSection,
  showHeader = true,
}: TemplateMinimalProps) {
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

  const personal = resumeData.personal?.data;

  return (
    <div className="space-y-5 text-gray-900 h-full overflow-hidden px-1">
      {/* ================= HEADER ================= */}
      {showHeader && personal && (
        <div className="text-center pb-4 border-b border-gray-300">
          <h1 className="text-3xl font-bold tracking-tight">
            {personal.fullName}
          </h1>

          <div className="flex justify-center gap-3 text-xs text-gray-600 mt-2 flex-wrap">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>| {personal.phone}</span>}
            {personal.linkedin && <span>| {personal.linkedin}</span>}
          </div>
        </div>
      )}

      {/* ================= SECTIONS ================= */}
      {Object.entries(sections).map(([sectionKey, sectionData]) => {
        const section = resumeData[sectionKey as keyof ResumeData] as any;
        if (!section || !section.visible) return null;

        return (
          <div
            key={sectionKey}
            className={`space-y-2 ${
              editingSection === sectionKey
                ? "ring-2 ring-green-400 rounded p-2 bg-green-50"
                : ""
            }`}
          >
            {/* ---------- SECTION HEADER ---------- */}
            {sectionData.header && (
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
                {sectionKey}
              </h2>
            )}

            {/* ---------- SUMMARY ---------- */}
            {sectionKey === "summary" && (
              <p className="text-xs leading-relaxed">{section.data}</p>
            )}

            {/* ---------- SKILLS (Dynamic like Modern) ---------- */}
            {sectionKey === "skills" && typeof section.data === "object" && (
              <div className="text-xs space-y-1">
                {Object.entries(section.data).map(([category, skills]) => (
                  <div key={category}>
                    <span className="font-semibold">{category}: </span>
                    <span>{formatSkills(skills, " • ")}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ---------- EXPERIENCE ---------- */}
            {sectionKey === "experience" && Array.isArray(section.data) && (
              <div className="space-y-3">
                {sectionData.items.map((idx: number) => {
                  const exp = section.data[idx];
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-sm">{exp?.role}</h3>
                        <span className="text-xs text-gray-600">
                          {exp.duration}
                        </span>
                      </div>

                      <div className="text-xs">
                        {exp?.company}, {exp?.location}
                      </div>

                      {exp?.responsibilities && (
                        <p className="text-xs text-gray-700">
                          {exp?.responsibilities}
                        </p>
                      )}

                      {exp?.skillsUsed && (
                        <div className="text-xs italic text-gray-500">
                          {exp?.skillsUsed.join(" • ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---------- EDUCATION ---------- */}
            {sectionKey === "education" && Array.isArray(section.data) && (
              <div className="space-y-2">
                {sectionData.items.map((idx: number) => {
                  const edu = section.data[idx];
                  return (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between">
                        <div className="font-bold">
                          {edu?.degree} – {edu?.field}
                        </div>
                        <div className="text-gray-600">
                          {edu?.startDate} – {edu?.endDate}
                        </div>
                      </div>

                      <div>
                        {edu?.institution}, {edu?.location}
                      </div>

                      {edu?.grade && (
                        <div className="text-gray-600">Grade: {edu?.grade}</div>
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
                    <div key={idx} className="text-xs">
                      <div className="font-bold">
                        {proj?.name}
                        {proj?.role ? ` — ${proj?.role}` : ""}
                      </div>

                      {proj?.technologies && (
                        <div className="italic text-gray-600">
                          {proj?.technologies.join(" • ")}
                        </div>
                      )}

                      <div className="text-gray-700">{proj?.description}</div>

                      {proj?.impact && (
                        <div className="text-gray-600 whitespace-pre-line">
                          {proj?.impact}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---------- ACHIEVEMENTS ---------- */}
            {sectionKey === "achievements" && Array.isArray(section.data) && (
              <ul className="text-xs text-gray-700 ml-4 space-y-0.5 list-none">
                {sectionData.items.map((idx: number) => {
                  const a = section.data[idx];
                  return (
                    <li
                      key={idx}
                      className="before:content-['✓'] before:mr-2 before:text-green-600"
                    >
                      <span className="font-semibold">{a.title}</span> —{" "}
                      {a.organization} ({a.date})
                    </li>
                  );
                })}
              </ul>
            )}

            {/* ---------- CERTIFICATIONS ---------- */}
            {sectionKey === "certifications" && Array.isArray(section.data) && (
              <div className="space-y-1 text-xs">
                {sectionData.items.map((idx: number) => {
                  const c = section.data[idx];
                  return (
                    <div key={idx}>
                      <span className="font-semibold">{c.name}</span>
                      {" — "}
                      {c.issuer}
                      {c.issueDate && (
                        <span className="text-gray-500"> ({c.issueDate})</span>
                      )}
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

// src/components/resume-templates/layouts/TemplateMinimal.tsx
// import React from "react";
// import { ResumeData } from "@/types/resume";
// import { TemplateMeasurements } from "@/types/template";

// interface TemplateMinimalProps {
//   resumeData: ResumeData;
//   pageItems: Array<{ section: string; type: 'header' | 'item'; itemIndex?: number }>;
//   editingSection: keyof ResumeData | null;
//   showHeader?: boolean;
// }

// export default function TemplateMinimal({
//   resumeData,
//   pageItems,
//   editingSection,
//   showHeader = true
// }: TemplateMinimalProps) {
//   const sections: Record<string, { header: boolean; items: number[] }> = {};

//   pageItems.forEach(item => {
//     if (!sections[item.section]) {
//       sections[item.section] = { header: false, items: [] };
//     }
//     if (item.type === 'header') {
//       sections[item.section].header = true;
//     } else if (item.itemIndex !== undefined) {
//       sections[item.section].items.push(item.itemIndex);
//     }
//   });

//   return (
//     <div className="space-y-5 text-gray-900 h-full overflow-hidden px-1">
//       {showHeader && (
//         <div className="text-center pb-4 border-b border-gray-300">
//           <h1 className="text-3xl font-bold tracking-tight">JOHN DOE</h1>
//           <div className="flex justify-center gap-4 text-xs text-gray-600 mt-2">
//             <span>john.doe@email.com</span>
//             <span>|</span>
//             <span>+91 98765 43210</span>
//             <span>|</span>
//             <span>linkedin.com/in/johndoe</span>
//           </div>
//         </div>
//       )}

//       {Object.entries(sections).map(([sectionKey, sectionData]) => {
//         const section = resumeData[sectionKey as keyof ResumeData] as any;
//         if (!section || !section.visible) return null;

//         return (
//           <div
//             key={sectionKey}
//             className={`space-y-2 ${editingSection === sectionKey ? "ring-2 ring-green-400 rounded p-2 bg-green-50" : ""}`}
//           >
//             {sectionData.header && (
//               <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
//                 {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
//               </h2>
//             )}

//             {sectionKey === "summary" && (
//               <p className="text-xs leading-relaxed">{section.data}</p>
//             )}

//             {sectionKey === "skills" && (
//               <div className="text-xs space-y-1">
//                 {section.data.technical && (
//                   <div>
//                     <span className="font-semibold">Technical: </span>
//                     <span>{section.data.technical.join(" • ")}</span>
//                   </div>
//                 )}
//                 {section.data.soft && (
//                   <div>
//                     <span className="font-semibold">Soft Skills: </span>
//                     <span>{section.data.soft.join(" • ")}</span>
//                   </div>
//                 )}
//                 {section.data.tools && (
//                   <div>
//                     <span className="font-semibold">Tools: </span>
//                     <span>{section.data.tools.join(" • ")}</span>
//                   </div>
//                 )}
//               </div>
//             )}

//             {sectionKey === "experience" && Array.isArray(section.data) && (
//               <div className="space-y-3">
//                 {sectionData.items.map((idx: number) => {
//                   const exp = section.data[idx];
//                   return (
//                     <div key={idx} className="space-y-0.5">
//                       <div className="flex justify-between items-baseline">
//                         <h3 className="font-bold text-sm">{exp.title}</h3>
//                         <span className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</span>
//                       </div>
//                       <div className="text-xs">{exp.company}, {exp.location}</div>
//                       <ul className="text-xs text-gray-700 ml-4 space-y-0.5 list-none">
//                         {(exp.description || []).map((b: string, i: number) => (
//                           <li key={i} className="before:content-['—'] before:mr-2">{b}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {sectionKey === "education" && Array.isArray(section.data) && (
//               <div className="space-y-2">
//                 {sectionData.items.map((idx: number) => {
//                   const edu = section.data[idx];
//                   return (
//                     <div key={idx} className="text-xs">
//                       <div className="flex justify-between">
//                         <div className="font-bold">{edu.degree} in {edu.field}</div>
//                         <div className="text-gray-600">{edu.startDate} - {edu.endDate}</div>
//                       </div>
//                       <div>{edu.institution}, {edu.location}</div>
//                       {edu.grade && <div className="text-gray-600">CGPA: {edu.grade}</div>}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {sectionKey === "projects" && Array.isArray(section.data) && (
//               <div className="space-y-2">
//                 {sectionData.items.map((idx: number) => {
//                   const proj = section.data[idx];
//                   return (
//                     <div key={idx} className="text-xs">
//                       <div className="font-bold">
//                         {proj.name} {proj.role ? `— ${proj.role}` : ""}
//                       </div>
//                       {proj.technologies && (
//                         <div className="italic text-gray-600">{proj.technologies.join(" • ")}</div>
//                       )}
//                       <div className="text-gray-700 mt-0.5">{proj.description}</div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {sectionKey === "achievements" && Array.isArray(section.data) && (
//               <ul className="text-xs text-gray-700 ml-4 space-y-0.5 list-none">
//                 {sectionData.items.map((idx: number) => (
//                   <li key={idx} className="before:content-['✓'] before:mr-2 before:text-green-600">{section.data[idx]}</li>
//                 ))}
//               </ul>
//             )}

//             {sectionKey === "certifications" && Array.isArray(section.data) && (
//               <div className="space-y-1 text-xs">
//                 {sectionData.items.map((idx: number) => {
//                   const c = section.data[idx];
//                   return (
//                     <div key={idx}>
//                       <span className="font-semibold">{c.title}</span> — {c.issuer}
//                       {c.year && <span className="text-gray-500"> ({c.year})</span>}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // 🎯 MEASUREMENT CONFIG
// export const TemplateMinimalConfig: TemplateMeasurements = {
//   headerHeight: 95,
//   sectionGap: 20,
//   buffer: 45,
//   sectionHeaderHeight: 35,
//   summaryHeight: 60,
//   skillsHeight: 85,
//   experienceItemHeight: 88,
//   projectItemHeight: 72,
//   educationItemHeight: 68,
//   achievementItemHeight: 30,
//   certificationItemHeight: 38,
// };
