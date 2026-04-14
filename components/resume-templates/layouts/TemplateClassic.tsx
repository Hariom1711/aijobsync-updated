
// /* eslint-disable @typescript-eslint/no-explicit-any */


// import React from "react";
// import { FaGithub, FaExternalLinkAlt, FaLink } from "react-icons/fa";
// import { ResumeData } from "@/types/resume";
// import { TemplateMeasurements } from "@/types/template";

// interface TemplateClassicProps {
//   resumeData: ResumeData;
//   pageItems: Array<{
//     section: string;
//     type: "header" | "item";
//     itemIndex?: number;
//   }>;
//   editingSection: keyof ResumeData | null;
//   showHeader?: boolean;
// }

// export default function TemplateClassic({
//   resumeData,
//   pageItems,
//   editingSection,
//   showHeader = true,
// }: TemplateClassicProps) {
//   // Group items by section
//   const sections: Record<string, { header: boolean; items: number[] }> = {};
//   pageItems.forEach((item) => {
//     if (!sections[item.section]) {
//       sections[item.section] = { header: false, items: [] };
//     }
//     if (item.type === "header") sections[item.section].header = true;
//     else if (item.itemIndex !== undefined) sections[item.section].items.push(item.itemIndex);
//   });

//   const personal = (resumeData as any).personal?.data || null;

//   const renderContactInfo = () => {
//     if (!personal) return null;
//     const items: React.ReactNode[] = [];

//     if (personal.email) items.push(<span key="email">{personal.email}</span>);
//     if (personal.phone) items.push(<span key="phone">{personal.phone}</span>);
//     if (personal.location) items.push(<span key="location">{personal.location}</span>);

//     if (personal.linkedin) {
//       items.push(
//         <a
//           key="linkedin"
//           href={personal.linkedin}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:underline"
//         >
//           LinkedIn
//         </a>
//       );
//     }
//     if (personal.github) {
//       items.push(
//         <a
//           key="github"
//           href={personal.github}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:underline inline-flex items-center gap-1"
//         >
//           <FaGithub className="inline" /> GitHub
//         </a>
//       );
//     }
//     if (personal.website) {
//       items.push(
//         <a
//           key="website"
//           href={personal.website}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:underline inline-flex items-center gap-1"
//         >
//           <FaExternalLinkAlt className="inline" /> Website
//         </a>
//       );
//     }

//     return (
//       <div className="flex flex-col gap-1 text-xs text-gray-700">
//         {items.map((item, i) => (
//           <div key={i}>{item}</div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="flex gap-4 text-gray-900 min-h-full overflow-visible page-break-inside-avoid">
//       {/* Left Sidebar */}
//       {showHeader && (
//         <div className="w-1/3 bg-gray-50 p-4 border-r border-gray-300 space-y-4 self-start">
//           {/* Header Info */}
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               {personal?.name || "John Doe"}
//             </h1>
//             {personal?.title && (
//               <div className="mt-1 text-xs text-gray-600">{personal.title}</div>
//             )}
//           </div>

//           {/* Contact Info */}
//           <div className="space-y-2 text-xs">
//             <div>
//               <div className="font-semibold text-gray-700">CONTACT</div>
//               {renderContactInfo() || (
//                 <div className="text-gray-600">
//                   john.doe@email.com
//                   <br />
//                   +91 98765 43210
//                   <br />
//                   linkedin.com/in/johndoe
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar: Skills */}
//           {resumeData.skills?.visible && (
//             <div className="space-y-2 mt-4">
//               <h3 className="text-sm font-bold text-gray-800 uppercase">
//                 Skills
//               </h3>
//               {resumeData?.skills?.data?.technical && (
//                 <div className="text-xs">
//                   <div className="font-semibold text-gray-700">Technical</div>
//                   <div className="text-gray-600">
//                     {resumeData?.skills?.data?.technical.join(", ")}
//                   </div>
//                 </div>
//               )}
//               {resumeData?.skills?.data?.tools && (
//                 <div className="text-xs mt-2">
//                   <div className="font-semibold text-gray-700">Tools</div>
//                   <div className="text-gray-600">
//                     {resumeData?.skills?.data?.tools.join(", ")}
//                   </div>
//                 </div>
//               )}
//               {resumeData?.skills?.data?.soft && (
//                 <div className="text-xs mt-2">
//                   <div className="font-semibold text-gray-700">Soft Skills</div>
//                   <div className="text-gray-600">
//                     {resumeData?.skills?.data?.soft.join(", ")}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Sidebar: Certifications */}
//           {resumeData.certifications?.visible &&
//             Array.isArray(resumeData?.certifications?.data) &&
//             resumeData?.certifications?.data.length > 0 && (
//               <div className="space-y-2 mt-4">
//                 <h3 className="text-sm font-bold text-gray-800 uppercase">
//                   Certifications
//                 </h3>
//                 <div className="space-y-1 text-xs text-gray-700">
//                   {resumeData.certifications.data.map((cert, i) => (
//                     <div key={i} className="flex items-center gap-1">
//                       <span>
//                         <span className="font-semibold">{cert.title}</span> —{" "}
//                         {cert.issuer}
//                         {cert.year && (
//                           <span className="text-gray-500"> ({cert.year})</span>
//                         )}
//                       </span>
//                       {cert?.link && (
//                         <a
//                           href={cert?.link}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-gray-600 hover:text-black inline-flex items-center gap-1"
//                         >
//                           <FaLink size={10} />
//                         </a>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//           {/* Sidebar: Achievements */}
//           {resumeData.achievements?.visible &&
//             Array.isArray(resumeData?.achievements?.data) &&
//             resumeData?.achievements?.data.length > 0 && (
//               <div className="space-y-2 mt-4">
//                 <h3 className="text-sm font-bold text-gray-800 uppercase">
//                   Achievements
//                 </h3>
//                 <ul className="list-disc list-inside text-xs text-gray-700 ml-1 space-y-0.5">
//                   {resumeData?.achievements?.data.map((a, i) => (
//                     <li key={i}>{a}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="flex-1 space-y-5 pr-4 self-start">
//         {Object.entries(sections).map(([sectionKey, sectionData]) => {
//           if (["skills", "certifications", "achievements"].includes(sectionKey))
//             return null;

//           const section = resumeData[sectionKey as keyof ResumeData] as any;
//           if (!section || !section.visible) return null;

//           return (
//             <div
//               key={sectionKey}
//               className={`space-y-2 ${
//                 editingSection === sectionKey
//                   ? "ring-2 ring-blue-400 rounded p-2 bg-blue-50"
//                   : ""
//               }`}
//             >
//               {sectionData.header && (
//                 <h2 className="text-base font-bold uppercase text-gray-800 border-b-2 border-gray-400 pb-1">
//                   {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
//                 </h2>
//               )}

//               {/* Summary */}
//               {sectionKey === "summary" && (
//                 <p className="text-xs leading-relaxed text-gray-700">
//                   {section?.data}
//                 </p>
//               )}

//               {/* Experience */}
//               {sectionKey === "experience" && Array.isArray(section.data) && (
//                 <div className="space-y-3">
//                   {sectionData.items.map((idx: number) => {
//                     const exp = section.data[idx];
//                     return (
//                       <div key={idx} className="space-y-1">
//                         <div className="flex justify-between items-baseline">
//                           <h3 className="font-bold text-sm">{exp.title}</h3>
//                           <span className="text-xs text-gray-500">
//                             {exp?.startDate} - {exp?.endDate}
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-600">
//                           {exp?.company} | {exp?.location}
//                         </div>
//                         <ul className="list-disc list-inside text-xs text-gray-700 ml-3 space-y-0.5">
//                           {(exp.description || []).map((b: string, i: number) => (
//                             <li key={i}>{b}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Education */}
//               {sectionKey === "education" && Array.isArray(section.data) && (
//                 <div className="space-y-2">
//                   {sectionData.items.map((idx: number) => {
//                     const edu = section.data[idx];
//                     return (
//                       <div key={idx}>
//                         <div className="flex justify-between items-baseline">
//                           <div className="font-bold text-sm">
//                             {edu?.degree} in {edu?.field}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {edu?.startDate} - {edu?.endDate}
//                           </div>
//                         </div>
//                         <div className="text-xs text-gray-600">
//                           {edu?.institution}, {edu?.location}
//                         </div>
//                         {edu.grade && (
//                           <div className="text-xs text-gray-600">
//                             Grade: {edu.grade}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Projects */}
//               {sectionKey === "projects" && Array.isArray(section.data) && (
//                 <div className="space-y-2">
//                   {sectionData.items.map((idx: number) => {
//                     const proj = section.data[idx];
//                     return (
//                       <div key={idx}>
//                         <div className="flex items-center justify-between">
//                           <div className="font-bold text-sm">
//                             {proj?.name} {proj?.role ? `| ${proj?.role}` : ""}
//                           </div>
//                           <div className="flex items-center gap-2">
//                             {proj?.github && (
//                               <a
//                                 href={proj?.github}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-gray-600 hover:text-black inline-flex items-center gap-1"
//                               >
//                                 <FaGithub size={12} />
//                               </a>
//                             )}
//                             {proj?.link && (
//                               <a
//                                 href={proj?.link}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-gray-600 hover:text-black inline-flex items-center gap-1"
//                               >
//                                 <FaExternalLinkAlt size={10} />
//                               </a>
//                             )}
//                           </div>
//                         </div>

//                         {proj?.technologies && (
//                           <div className="text-xs italic text-gray-600">
//                             {proj?.technologies.join(", ")}
//                           </div>
//                         )}
//                         <div className="text-xs text-gray-700 mt-0.5">
//                           {proj?.description}
//                         </div>
//                         {proj?.impact && (
//                           <div className="text-xs text-gray-600 mt-0.5 whitespace-pre-line">
//                             {proj?.impact}
//                           </div>
//                         )}
//                         {Array.isArray(proj?.highlights) &&
//                           proj.highlights.length > 0 && (
//                             <ul className="list-disc list-inside text-xs text-gray-700 ml-3 space-y-0.5">
//                               {proj.highlights.map((h: string, i: number) => (
//                                 <li key={i}>{h}</li>
//                               ))}
//                             </ul>
//                           )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export const TemplateClassicConfig: TemplateMeasurements = {
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
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { FaGithub, FaExternalLinkAlt, FaLink } from "react-icons/fa";
import { ResumeData } from "@/types/resume";
import { formatSkills } from "@/utils/formatSkills";

interface TemplateClassicProps {
  resumeData: ResumeData;
  pageItems: Array<{
    section: string;
    type: "header" | "item";
    itemIndex?: number;
  }>;
  editingSection: keyof ResumeData | null;
  showHeader?: boolean;
}

export default function TemplateClassic({
  resumeData,
  pageItems,
  editingSection,
  showHeader = true,
}: TemplateClassicProps) {
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

  /* ------------------ PERSONAL ------------------ */
  const personal = resumeData.personal?.data;

  const renderContactInfo = () => {
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
          className="text-blue-600 hover:underline"
        >
          LinkedIn
        </a>
      );
    }

    if (personal.github) {
      items.push(
        <a
          key="github"
          href={personal.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <FaGithub size={12} /> GitHub
        </a>
      );
    }

    if (personal.portfolio) {
      items.push(
        <a
          key="portfolio"
          href={personal.portfolio}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <FaExternalLinkAlt size={10} /> Portfolio
        </a>
      );
    }

    return (
      <div className="flex flex-col gap-1 text-xs text-gray-700">
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    );
  };

  /* ------------------ RENDER ------------------ */
  return (
    <div className="flex gap-4 text-gray-900 min-h-full">
      {/* ================= LEFT SIDEBAR ================= */}
      {showHeader && personal && (
        <div className="w-1/3 bg-gray-50 p-4 border-r border-gray-300 space-y-4 self-start">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {personal.fullName}
            </h1>
            {personal.title && (
              <div className="mt-1 text-xs text-gray-600">
                {personal.title}
              </div>
            )}
          </div>

          {/* Contact */}
          <div>
            <div className="font-semibold text-gray-700 text-xs uppercase">
              Contact
            </div>
            {renderContactInfo()}
          </div>

          {/* Skills (Dynamic like Modern) */}
          {resumeData.skills?.visible &&
            typeof resumeData.skills.data === "object" && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase">
                  Skills
                </h3>

                {Object.entries(resumeData.skills.data).map(
                  ([category, skills]) => (
                    <div key={category} className="text-xs">
                      <div className="font-semibold text-gray-700">
                        {category}
                      </div>
                      <div className="text-gray-600">
                        {formatSkills(skills)}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

          {/* Certifications */}
          {resumeData.certifications?.visible &&
            Array.isArray(resumeData.certifications.data) && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase">
                  Certifications
                </h3>

                <div className="space-y-1 text-xs text-gray-700">
                  {resumeData.certifications.data.map((c, i) => (
                    <div key={i}>
                      <span className="font-semibold">{c.name}</span>
                      <span> • {c.issuer}</span>
                      {c.issueDate && (
                        <span className="text-gray-500">
                          {" "}
                          ({c.issueDate})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Achievements */}
          {resumeData.achievements?.visible &&
            Array.isArray(resumeData.achievements.data) && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase">
                  Achievements
                </h3>

                <ul className="list-disc list-inside text-xs text-gray-700 ml-1 space-y-0.5">
                  {resumeData.achievements.data.map((a: any, i) => (
                    <li key={i}>{typeof a === 'string' ? a : a?.title}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 space-y-5 pr-4 self-start">
        {Object.entries(sections).map(([sectionKey, sectionData]) => {
          if (["skills", "certifications", "achievements"].includes(sectionKey))
            return null;

          const section = resumeData[sectionKey as keyof ResumeData] as any;
          if (!section || !section.visible) return null;

          return (
            <div
              key={sectionKey}
              className={`space-y-2 ${
                editingSection === sectionKey
                  ? "ring-2 ring-blue-400 rounded p-2 bg-blue-50"
                  : ""
              }`}
            >
              {/* Section Header */}
              {sectionData.header && (
                <h2 className="text-base font-bold uppercase text-gray-800 border-b-2 border-gray-400 pb-1">
                  {sectionKey}
                </h2>
              )}

              {/* Summary */}
              {sectionKey === "summary" && (
                <p className="text-xs leading-relaxed text-gray-700">
                  {section.data}
                </p>
              )}

              {/* Experience */}
              {sectionKey === "experience" && Array.isArray(section.data) && (
                <div className="space-y-3">
                  {sectionData.items.map((idx: number) => {
                    const exp = section.data[idx];
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-sm">
                            {exp?.role}
                          </h3>
                          <span className="text-xs text-gray-500">
                              {exp.duration}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600">
                          {exp?.company} | {exp?.location}
                        </div>

                        {exp.responsibilities && (
                          <p className="text-xs text-gray-700 mt-1">
                            {exp?.responsibilities}
                          </p>
                        )}

                        {exp?.skillsUsed && (
                          <div className="text-xs italic text-gray-500">
                            {exp?.skillsUsed.join(", ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Education */}
              {sectionKey === "education" && Array.isArray(section.data) && (
                <div className="space-y-2">
                  {sectionData.items.map((idx: number) => {
                    const edu = section.data[idx];
                    // console.log(edu,"educationn");
                    
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-baseline">
                          <div className="font-bold text-sm">
                            {edu?.degree} – {edu?.field}
                          </div>
                          <div className="text-xs text-gray-500">
                            {edu?.startDate} – {edu?.endDate}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {edu?.institution} • {edu?.location}
                        </div>
                        {edu.grade && (
                          <div className="text-xs text-gray-600">
                            Grade: {edu?.grade}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Projects */}
              {sectionKey === "projects" && Array.isArray(section.data) && (
                <div className="space-y-2">
                  {sectionData.items.map((idx: number) => {
                    const proj = section.data[idx];
                    // console.log(proj,"projeeeeeeeeect");
                    
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
                                rel="noreferrer"
                              >
                                <FaGithub size={12} />
                              </a>
                            )}
                            {proj?.link && (
                              <a
                                href={proj?.link}
                                target="_blank"
                                rel="noreferrer"
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

                        <div className="text-xs text-gray-700">
                          {proj?.description}
                        </div>

                        {proj?.impact && (
                          <div className="text-xs text-gray-600 whitespace-pre-line">
                            {proj?.impact}
                          </div>
                        )}

                        {Array.isArray(proj?.highlights) &&
                          proj?.highlights.length > 0 && (
                            <ul className="list-disc list-inside text-xs text-gray-700 ml-3">
                              {proj?.highlights.map((h: string, i: number) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
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
    </div>
  );
}
