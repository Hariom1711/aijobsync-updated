import React, { useEffect, useRef, useState } from "react";
import { ResumeData } from "@/types/resume";

interface PageItem {
  section: string;
  type: "header" | "item";
  itemIndex?: number;
}

interface SimpleMeasurementContainerProps {
  resumeData: ResumeData;
  sectionOrder: (keyof ResumeData)[];
  onPagesComputed: (pages: PageItem[][]) => void;
  templateId?: string;
  onCalibrating?: (isCalibrating: boolean) => void;
}

export default function SimpleMeasurementContainer({
  resumeData,
  sectionOrder,
  onPagesComputed,
  templateId = "TemplateModern",
  onCalibrating,
}: SimpleMeasurementContainerProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    const A4_HEIGHT = 1122;
    const SAFE_HEIGHT = templateId === "TemplateMinimal" ? 1100 : 1000; // Minimal can fit more
    const CONTENT_WIDTH = 698;

    const calculatePages = async () => {
      if (!measureRef.current) return;

      // console.log(`🎯 Starting Simple DOM Pagination for ${templateId}...`);
      setIsCalculating(true);
      if (onCalibrating) onCalibrating(true);

      await new Promise(resolve => setTimeout(resolve, 100));

      const pages: PageItem[][] = [];
      let currentPage: PageItem[] = [];
      let currentHeight = 0;

      const visibleSections = sectionOrder.filter(
        (key) => (resumeData as any)[key]?.visible
      );

      // Helper to measure element height
      const measureElement = (html: string): number => {
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        tempDiv.style.width = `${CONTENT_WIDTH}px`;
        tempDiv.style.visibility = "hidden";
        tempDiv.innerHTML = html;
        document.body.appendChild(tempDiv);
        const height = tempDiv.offsetHeight;
        document.body.removeChild(tempDiv);
        return height;
      };

      // Template-specific styling classes
      const isModern = templateId === "TemplateModern";
      const isClassic = templateId === "TemplateClassic";
      const isMinimal = templateId === "TemplateMinimal";

      // First page includes header
      let HEADER_HEIGHT = 120;
      if (isModern) HEADER_HEIGHT = 110;
      if (isClassic) HEADER_HEIGHT = 140;
      if (isMinimal) HEADER_HEIGHT = 90; // Minimal has smaller header
      
      currentHeight = HEADER_HEIGHT;
      // console.log(`📄 Page 1 - Starting with header (${HEADER_HEIGHT}px)`);

      for (const sectionKey of visibleSections) {
        const section = (resumeData as any)[sectionKey];
        if (!section) continue;

        // console.log(`\n📦 Processing section: ${sectionKey}`);

        // Measure section header
        let headerHTML = "";
        if (isMinimal) {
          headerHTML = `<h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; 
                             margin-bottom: 8px; color: #1f2937;">
                         ${String(sectionKey).charAt(0).toUpperCase() + String(sectionKey).slice(1)}
                       </h2>`;
        } else if (isModern) {
          headerHTML = `<h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; 
                             border-bottom: 1px solid #333; padding-bottom: 4px; margin-bottom: 16px;">
                         ${String(sectionKey).charAt(0).toUpperCase() + String(sectionKey).slice(1)}
                       </h2>`;
        } else {
          headerHTML = `<h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; 
                             border-bottom: 2px solid #666; padding-bottom: 4px; margin-bottom: 12px;">
                         ${String(sectionKey).charAt(0).toUpperCase() + String(sectionKey).slice(1)}
                       </h2>`;
        }

        const headerHeight = measureElement(headerHTML);

        // Check if header fits
        if (currentHeight + headerHeight > SAFE_HEIGHT && currentPage.length > 0) {
          // console.log(`   🔀 Header doesn't fit, starting new page`);
          pages.push([...currentPage]);
          currentPage = [];
          currentHeight = 0;
        }

        // Add section header
        currentPage.push({ section: String(sectionKey), type: "header" });
        currentHeight += headerHeight;
        // console.log(`   ✅ Added header (height: ${currentHeight}px)`);

        // Process section content
        if (Array.isArray(section.data)) {
          // Array sections
          for (let itemIndex = 0; itemIndex < section.data.length; itemIndex++) {
            const item = section.data[itemIndex];
            let itemHTML = "";

            if (sectionKey === "experience") {
              if (isMinimal) {
                itemHTML = `<div style="margin-bottom: 12px;">
                             <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
                               <h3 style="font-size: 12px; font-weight: bold;">${item?.title || ""}</h3>
                               <span style="font-size: 12px; color: #666;">${item?.startDate} - ${item?.endDate}</span>
                             </div>
                             <div style="font-size: 12px; margin-bottom: 2px;">${item?.company}, ${item?.location}</div>
                             <ul style="margin-left: 16px; font-size: 12px; line-height: 1.4; list-style: none;">
                               ${(item?.description || []).map((d: string) => `<li style="margin-bottom: 2px;"><span style="margin-right: 8px;">—</span>${d}</li>`).join("")}
                             </ul>
                           </div>`;
              } else if (isModern) {
                itemHTML = `<div style="margin-bottom: 20px;">
                             <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                               <h3 style="font-size: 14px; font-weight: 600;">${item?.title || ""}</h3>
                               <span style="font-size: 12px; color: #666;">${item?.startDate} - ${item?.endDate}</span>
                             </div>
                             <div style="font-size: 13px; color: #666; font-style: italic; margin-bottom: 8px;">
                               ${item?.company} • ${item?.location}
                             </div>
                             <ul style="margin-left: 8px; font-size: 13px; line-height: 1.5;">
                               ${(item?.description || []).map((d: string) => `<li style="margin-bottom: 2px;">${d}</li>`).join("")}
                             </ul>
                           </div>`;
              } else {
                itemHTML = `<div style="margin-bottom: 16px;">
                             <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                               <h3 style="font-size: 14px; font-weight: bold;">${item?.title || ""}</h3>
                               <span style="font-size: 12px; color: #666;">${item?.startDate} - ${item?.endDate}</span>
                             </div>
                             <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                               ${item?.company} | ${item?.location}
                             </div>
                             <ul style="margin-left: 20px; font-size: 12px;">
                               ${(item?.description || []).map((d: string) => `<li style="margin-bottom: 4px;">${d}</li>`).join("")}
                             </ul>
                           </div>`;
              }
            } else if (sectionKey === "education") {
              if (isMinimal) {
                itemHTML = `<div style="margin-bottom: 8px;">
                             <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                               <div style="font-size: 12px; font-weight: bold;">${item?.degree} in ${item?.field}</div>
                               <span style="font-size: 12px; color: #666;">${item?.startDate} - ${item?.endDate}</span>
                             </div>
                             <div style="font-size: 12px;">${item?.institution}, ${item?.location}</div>
                             ${item?.grade ? `<div style="font-size: 12px; color: #666;">CGPA: ${item?.grade}</div>` : ""}
                           </div>`;
              } else if (isModern) {
                itemHTML = `<div style="margin-bottom: 16px;">
                             <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                               <div style="font-size: 14px; font-weight: 600;">${item?.degree} in ${item?.field}</div>
                               <span style="font-size: 12px; color: #666;">${item?.startDate} - ${item?.endDate}</span>
                             </div>
                             <div style="font-size: 13px; color: #666;">${item?.institution} — ${item?.location}</div>
                             ${item?.grade ? `<div style="font-size: 13px; color: #666;">Grade: ${item?.grade}</div>` : ""}
                           </div>`;
              } else {
                itemHTML = `<div style="margin-bottom: 12px;">
                             <div style="display: flex; justify-content: space-between;">
                               <div style="font-size: 14px; font-weight: bold;">${item?.degree} in ${item?.field}</div>
                               <span style="font-size: 12px; color: #666;">${item?.startDate} - ${item?.endDate}</span>
                             </div>
                             <div style="font-size: 12px; color: #666;">${item?.institution}, ${item?.location}</div>
                             ${item?.grade ? `<div style="font-size: 12px; color: #666;">Grade: ${item?.grade}</div>` : ""}
                           </div>`;
              }
            } else if (sectionKey === "projects") {
              if (isMinimal) {
                itemHTML = `<div style="margin-bottom: 8px;">
                             <div style="font-size: 12px; font-weight: bold; margin-bottom: 2px;">${item?.name}${item?.role ? ` — ${item?.role}` : ""}</div>
                             ${item?.technologies ? `<div style="font-size: 12px; font-style: italic; color: #666; margin-bottom: 2px;">${item?.technologies.join(" • ")}</div>` : ""}
                             <div style="font-size: 12px; color: #374151; margin-top: 2px;">${item?.description || ""}</div>
                           </div>`;
              } else if (isModern) {
                itemHTML = `<div style="margin-bottom: 16px;">
                             <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${item?.name}${item?.role ? ` — ${item?.role}` : ""}</div>
                             ${item?.technologies ? `<div style="font-size: 12px; font-style: italic; color: #666; margin-bottom: 4px;">${item?.technologies.join(", ")}</div>` : ""}
                             <div style="font-size: 13px; margin-top: 4px;">${item?.description || ""}</div>
                             ${item?.impact ? `<div style="font-size: 13px; color: #666; margin-top: 4px;">${item?.impact}</div>` : ""}
                             ${item?.highlights ? `<ul style="margin-left: 8px; font-size: 13px; margin-top: 4px;">${item?.highlights.map((h: string) => `<li>${h}</li>`).join("")}</ul>` : ""}
                           </div>`;
              } else {
                itemHTML = `<div style="margin-bottom: 12px;">
                             <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">${item?.name}</div>
                             ${item?.technologies ? `<div style="font-size: 12px; color: #666; font-style: italic; margin-bottom: 4px;">${item?.technologies.join(", ")}</div>` : ""}
                             <div style="font-size: 12px; margin-top: 4px;">${item?.description || ""}</div>
                           </div>`;
              }
            } else if (sectionKey === "certifications") {
              itemHTML = `<div style="margin-bottom: 10px; font-size: 13px;">
                            <span style="font-weight: 600;">${item?.title}</span> • ${item?.issuer}
                            ${item?.year ? `<span style="color: #666;"> (${item?.year})</span>` : ""}
                          </div>`;
            } else if (sectionKey === "achievements") {
              if (isMinimal) {
                itemHTML = `<li style="margin-bottom: 2px; font-size: 12px; list-style: none;"><span style="color: #16a34a; margin-right: 8px;">✓</span>${item}</li>`;
              } else {
                itemHTML = `<li style="margin-bottom: 6px; font-size: 13px;">${item}</li>`;
              }
            } else {
              itemHTML = `<div style="margin-bottom: 8px; font-size: 12px;">${JSON.stringify(item)}</div>`;
            }

            const itemHeight = measureElement(itemHTML);
            // console.log(`   📌 Item[${itemIndex}]: ${itemHeight}px`);

            // Check if item fits
            if (currentHeight + itemHeight > SAFE_HEIGHT) {
              // console.log(`   🔀 Item doesn't fit, moving to new page`);
              pages.push([...currentPage]);
              currentPage = [{ section: String(sectionKey), type: "header" }];
              currentHeight = headerHeight;
              // console.log(`   📄 New page with continuation header`);
            }

            currentPage.push({
              section: String(sectionKey),
              type: "item",
              itemIndex: itemIndex,
            });
            currentHeight += itemHeight;
            // console.log(`   ✅ Added item[${itemIndex}] (height: ${currentHeight}px)`);
          }
        } else {
          // Non-array sections (summary, skills)
          let contentHTML = "";

          if (sectionKey === "summary") {
            contentHTML = isMinimal
              ? `<p style="font-size: 12px; line-height: 1.5; margin-bottom: 12px;">${section.data || ""}</p>`
              : isModern
              ? `<p style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">${section.data || ""}</p>`
              : `<p style="font-size: 12px; line-height: 1.6; margin-bottom: 16px;">${section.data || ""}</p>`;
          } else if (sectionKey === "skills") {
            if (isMinimal) {
              contentHTML = `
                <div style="font-size: 12px; margin-bottom: 12px; line-height: 1.4;">
                  ${section.data.technical ? `
                    <div style="margin-bottom: 4px;">
                      <span style="font-weight: 600;">Technical: </span>
                      <span>${section.data.technical.join(" • ")}</span>
                    </div>` : ""}
                  ${section.data.soft ? `
                    <div style="margin-bottom: 4px;">
                      <span style="font-weight: 600;">Soft Skills: </span>
                      <span>${section.data.soft.join(" • ")}</span>
                    </div>` : ""}
                  ${section.data.tools ? `
                    <div>
                      <span style="font-weight: 600;">Tools: </span>
                      <span>${section.data.tools.join(" • ")}</span>
                    </div>` : ""}
                </div>
              `;
            } else if (isModern) {
              contentHTML = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
                  ${section.data.technical ? `
                    <div>
                      <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">Technical</div>
                      <div style="font-size: 13px;">${section.data.technical.join(", ")}</div>
                    </div>` : ""}
                  ${section.data.soft ? `
                    <div>
                      <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">Soft</div>
                      <div style="font-size: 13px;">${section.data.soft.join(", ")}</div>
                    </div>` : ""}
                  ${section.data.tools ? `
                    <div>
                      <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">Tools</div>
                      <div style="font-size: 13px;">${section.data.tools.join(", ")}</div>
                    </div>` : ""}
                </div>
              `;
            } else {
              contentHTML = `
                <div style="margin-bottom: 16px;">
                  ${section.data.technical ? `
                    <div style="margin-bottom: 8px;">
                      <span style="font-weight: 600; font-size: 12px;">Technical:</span>
                      <span style="font-size: 12px;"> ${section.data.technical.join(", ")}</span>
                    </div>` : ""}
                  ${section.data.tools ? `
                    <div style="margin-bottom: 8px;">
                      <span style="font-weight: 600; font-size: 12px;">Tools:</span>
                      <span style="font-size: 12px;"> ${section.data.tools.join(", ")}</span>
                    </div>` : ""}
                  ${section.data.soft ? `
                    <div>
                      <span style="font-weight: 600; font-size: 12px;">Soft Skills:</span>
                      <span style="font-size: 12px;"> ${section.data.soft.join(", ")}</span>
                    </div>` : ""}
                </div>
              `;
            }
          } else {
            contentHTML = `<div style="font-size: 12px; margin-bottom: 12px;">${JSON.stringify(section.data)}</div>`;
          }

          const contentHeight = measureElement(contentHTML);
          // console.log(`   📝 Content height: ${contentHeight}px`);

          // Check if content fits
          if (currentHeight + contentHeight > SAFE_HEIGHT && currentPage.length > 1) {
            // console.log(`   🔀 Content doesn't fit, moving to new page`);
            pages.push([...currentPage]);
            currentPage = [{ section: String(sectionKey), type: "header" }];
            currentHeight = headerHeight;
          }

          currentPage.push({ section: String(sectionKey), type: "item" });
          currentHeight += contentHeight;
          // console.log(`   ✅ Added content (height: ${currentHeight}px)`);
        }
      }

      // Push final page
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      // console.log(`\n✅ Pagination complete! ${pages.length} pages created`);
      pages.forEach((page, i) => {
        const pageInfo = page.map(item =>
          item?.itemIndex !== undefined
            ? `${item?.section}[${item?.itemIndex}]`
            : `${item?.section}:${item?.type}`
        ).join(", ");
        // console.log(`   Page ${i + 1}: ${pageInfo}`);
      });

      setIsCalculating(false);
      if (onCalibrating) onCalibrating(false);
      onPagesComputed(pages.length > 0 ? pages : [[]]);
    };

    calculatePages();
  }, [resumeData, sectionOrder, templateId, onPagesComputed, onCalibrating]);

  return (
    <div
      ref={measureRef}
      style={{
        position: "absolute",
        left: -9999,
        top: -9999,
        visibility: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden
    />
  );
}


// import React, { useEffect, useRef, useState } from "react";
// import { ResumeData } from "@/types/resume";

// interface PageItem {
//   section: string;
//   type: "header" | "item";
//   itemIndex?: number;
// }

// interface SimpleMeasurementContainerProps {
//   resumeData: ResumeData;
//   sectionOrder: (keyof ResumeData)[];
//   onPagesComputed: (pages: PageItem[][]) => void;
//   templateId?: string;
//   onCalibrating?: (isCalibrating: boolean) => void;
// }

// export default function SimpleMeasurementContainer({
//   resumeData,
//   sectionOrder,
//   onPagesComputed,
//   templateId = "TemplateModern",
//   onCalibrating,
// }: SimpleMeasurementContainerProps) {
//   const measureRef = useRef<HTMLDivElement>(null);
//   const [isCalculating, setIsCalculating] = useState(true);

//   useEffect(() => {
//     const A4_HEIGHT = 1122;
//     const SAFE_HEIGHT = 1000; // More conservative buffer
//     const CONTENT_WIDTH = 698;

//     const calculatePages = async () => {
//       if (!measureRef.current) return;

//       // console.log(`🎯 Starting Simple DOM Pagination for ${templateId}...`);
//       setIsCalculating(true);
//       if (onCalibrating) onCalibrating(true);

//       await new Promise(resolve => setTimeout(resolve, 100));

//       const pages: PageItem[][] = [];
//       let currentPage: PageItem[] = [];
//       let currentHeight = 0;

//       const visibleSections = sectionOrder.filter(
//         (key) => (resumeData as any)[key]?.visible
//       );

//       // Helper to measure element height
//       const measureElement = (html: string): number => {
//         const tempDiv = document.createElement("div");
//         tempDiv.style.position = "absolute";
//         tempDiv.style.left = "-9999px";
//         tempDiv.style.width = `${CONTENT_WIDTH}px`;
//         tempDiv.style.visibility = "hidden";
//         tempDiv.innerHTML = html;
//         document.body.appendChild(tempDiv);
//         const height = tempDiv.offsetHeight;
//         document.body.removeChild(tempDiv);
//         return height;
//       };

//       // Template-specific styling classes
//       const isModern = templateId === "TemplateModern";
//       const isClassic = templateId === "TemplateClassic";

//       // First page includes header
//       const HEADER_HEIGHT = isModern ? 110 : isClassic ? 140 : 120;
//       currentHeight = HEADER_HEIGHT;
//       // console.log(`📄 Page 1 - Starting with header (${HEADER_HEIGHT}px)`);

//       for (const sectionKey of visibleSections) {
//         const section = (resumeData as any)[sectionKey];
//         if (!section) continue;

//         // console.log(`\n📦 Processing section: ${sectionKey}`);

//         // Measure section header
//         const headerHTML = isModern
//           ? `<h2 style="font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; 
//                        border-bottom: 1px solid #333; padding-bottom: 4px; margin-bottom: 16px;">
//                ${String(sectionKey).charAt(0).toUpperCase() + String(sectionKey).slice(1)}
//              </h2>`
//           : `<h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; 
//                        border-bottom: 2px solid #666; padding-bottom: 4px; margin-bottom: 12px;">
//                ${String(sectionKey).charAt(0).toUpperCase() + String(sectionKey).slice(1)}
//              </h2>`;

//         const headerHeight = measureElement(headerHTML);

//         // Check if header fits
//         if (currentHeight + headerHeight > SAFE_HEIGHT && currentPage.length > 0) {
//           // console.log(`   🔀 Header doesn't fit, starting new page`);
//           pages.push([...currentPage]);
//           currentPage = [];
//           currentHeight = 0;
//         }

//         // Add section header
//         currentPage.push({ section: String(sectionKey), type: "header" });
//         currentHeight += headerHeight;
//         // console.log(`   ✅ Added header (height: ${currentHeight}px)`);

//         // Process section content
//         if (Array.isArray(section.data)) {
//           // Array sections
//           for (let itemIndex = 0; itemIndex < section.data.length; itemIndex++) {
//             const item = section.data[itemIndex];
//             let itemHTML = "";

//             if (sectionKey === "experience") {
//               itemHTML = isModern
//                 ? `<div style="margin-bottom: 20px;">
//                      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
//                        <h3 style="font-size: 14px; font-weight: 600;">${item.title || ""}</h3>
//                        <span style="font-size: 12px; color: #666;">${item.startDate} - ${item.endDate}</span>
//                      </div>
//                      <div style="font-size: 13px; color: #666; font-style: italic; margin-bottom: 8px;">
//                        ${item.company} • ${item.location}
//                      </div>
//                      <ul style="margin-left: 8px; font-size: 13px; line-height: 1.5;">
//                        ${(item.description || []).map((d: string) => `<li style="margin-bottom: 2px;">${d}</li>`).join("")}
//                      </ul>
//                    </div>`
//                 : `<div style="margin-bottom: 16px;">
//                      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
//                        <h3 style="font-size: 14px; font-weight: bold;">${item.title || ""}</h3>
//                        <span style="font-size: 12px; color: #666;">${item.startDate} - ${item.endDate}</span>
//                      </div>
//                      <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
//                        ${item.company} | ${item.location}
//                      </div>
//                      <ul style="margin-left: 20px; font-size: 12px;">
//                        ${(item.description || []).map((d: string) => `<li style="margin-bottom: 4px;">${d}</li>`).join("")}
//                      </ul>
//                    </div>`;
//             } else if (sectionKey === "education") {
//               itemHTML = isModern
//                 ? `<div style="margin-bottom: 16px;">
//                      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
//                        <div style="font-size: 14px; font-weight: 600;">${item.degree} in ${item.field}</div>
//                        <span style="font-size: 12px; color: #666;">${item.startDate} - ${item.endDate}</span>
//                      </div>
//                      <div style="font-size: 13px; color: #666;">${item.institution} — ${item.location}</div>
//                      ${item.grade ? `<div style="font-size: 13px; color: #666;">Grade: ${item.grade}</div>` : ""}
//                    </div>`
//                 : `<div style="margin-bottom: 12px;">
//                      <div style="display: flex; justify-content: space-between;">
//                        <div style="font-size: 14px; font-weight: bold;">${item.degree} in ${item.field}</div>
//                        <span style="font-size: 12px; color: #666;">${item.startDate} - ${item.endDate}</span>
//                      </div>
//                      <div style="font-size: 12px; color: #666;">${item.institution}, ${item.location}</div>
//                      ${item.grade ? `<div style="font-size: 12px; color: #666;">Grade: ${item.grade}</div>` : ""}
//                    </div>`;
//             } else if (sectionKey === "projects") {
//               itemHTML = isModern
//                 ? `<div style="margin-bottom: 16px;">
//                      <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${item.name}${item.role ? ` — ${item.role}` : ""}</div>
//                      ${item.technologies ? `<div style="font-size: 12px; font-style: italic; color: #666; margin-bottom: 4px;">${item.technologies.join(", ")}</div>` : ""}
//                      <div style="font-size: 13px; margin-top: 4px;">${item.description || ""}</div>
//                      ${item.impact ? `<div style="font-size: 13px; color: #666; margin-top: 4px;">${item.impact}</div>` : ""}
//                      ${item.highlights ? `<ul style="margin-left: 8px; font-size: 13px; margin-top: 4px;">${item.highlights.map((h: string) => `<li>${h}</li>`).join("")}</ul>` : ""}
//                    </div>`
//                 : `<div style="margin-bottom: 12px;">
//                      <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px;">${item.name}</div>
//                      ${item.technologies ? `<div style="font-size: 12px; color: #666; font-style: italic; margin-bottom: 4px;">${item.technologies.join(", ")}</div>` : ""}
//                      <div style="font-size: 12px; margin-top: 4px;">${item.description || ""}</div>
//                    </div>`;
//             } else if (sectionKey === "certifications") {
//               itemHTML = `<div style="margin-bottom: 10px; font-size: 13px;">
//                             <span style="font-weight: 600;">${item.title}</span> • ${item.issuer}
//                             ${item.year ? `<span style="color: #666;"> (${item.year})</span>` : ""}
//                           </div>`;
//             } else if (sectionKey === "achievements") {
//               itemHTML = `<li style="margin-bottom: 6px; font-size: 13px;">${item}</li>`;
//             } else {
//               itemHTML = `<div style="margin-bottom: 8px; font-size: 12px;">${JSON.stringify(item)}</div>`;
//             }

//             const itemHeight = measureElement(itemHTML);
//             // console.log(`   📌 Item[${itemIndex}]: ${itemHeight}px`);

//             // Check if item fits
//             if (currentHeight + itemHeight > SAFE_HEIGHT) {
//               // console.log(`   🔀 Item doesn't fit, moving to new page`);
//               pages.push([...currentPage]);
//               currentPage = [{ section: String(sectionKey), type: "header" }];
//               currentHeight = headerHeight;
//               // console.log(`   📄 New page with continuation header`);
//             }

//             currentPage.push({
//               section: String(sectionKey),
//               type: "item",
//               itemIndex: itemIndex,
//             });
//             currentHeight += itemHeight;
//             // console.log(`   ✅ Added item[${itemIndex}] (height: ${currentHeight}px)`);
//           }
//         } else {
//           // Non-array sections (summary, skills)
//           let contentHTML = "";

//           if (sectionKey === "summary") {
//             contentHTML = isModern
//               ? `<p style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">${section.data || ""}</p>`
//               : `<p style="font-size: 12px; line-height: 1.6; margin-bottom: 16px;">${section.data || ""}</p>`;
//           } else if (sectionKey === "skills") {
//             if (isModern) {
//               // Modern uses grid layout - measure differently
//               contentHTML = `
//                 <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
//                   ${section.data.technical ? `
//                     <div>
//                       <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">Technical</div>
//                       <div style="font-size: 13px;">${section.data.technical.join(", ")}</div>
//                     </div>` : ""}
//                   ${section.data.soft ? `
//                     <div>
//                       <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">Soft</div>
//                       <div style="font-size: 13px;">${section.data.soft.join(", ")}</div>
//                     </div>` : ""}
//                   ${section.data.tools ? `
//                     <div>
//                       <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">Tools</div>
//                       <div style="font-size: 13px;">${section.data.tools.join(", ")}</div>
//                     </div>` : ""}
//                 </div>
//               `;
//             } else {
//               // Classic uses vertical layout
//               contentHTML = `
//                 <div style="margin-bottom: 16px;">
//                   ${section.data.technical ? `
//                     <div style="margin-bottom: 8px;">
//                       <span style="font-weight: 600; font-size: 12px;">Technical:</span>
//                       <span style="font-size: 12px;"> ${section.data.technical.join(", ")}</span>
//                     </div>` : ""}
//                   ${section.data.tools ? `
//                     <div style="margin-bottom: 8px;">
//                       <span style="font-weight: 600; font-size: 12px;">Tools:</span>
//                       <span style="font-size: 12px;"> ${section.data.tools.join(", ")}</span>
//                     </div>` : ""}
//                   ${section.data.soft ? `
//                     <div>
//                       <span style="font-weight: 600; font-size: 12px;">Soft Skills:</span>
//                       <span style="font-size: 12px;"> ${section.data.soft.join(", ")}</span>
//                     </div>` : ""}
//                 </div>
//               `;
//             }
//           } else {
//             contentHTML = `<div style="font-size: 12px; margin-bottom: 12px;">${JSON.stringify(section.data)}</div>`;
//           }

//           const contentHeight = measureElement(contentHTML);
//           // console.log(`   📝 Content height: ${contentHeight}px`);

//           // Check if content fits
//           if (currentHeight + contentHeight > SAFE_HEIGHT && currentPage.length > 1) {
//             // console.log(`   🔀 Content doesn't fit, moving to new page`);
//             pages.push([...currentPage]);
//             currentPage = [{ section: String(sectionKey), type: "header" }];
//             currentHeight = headerHeight;
//           }

//           currentPage.push({ section: String(sectionKey), type: "item" });
//           currentHeight += contentHeight;
//           // console.log(`   ✅ Added content (height: ${currentHeight}px)`);
//         }
//       }

//       // Push final page
//       if (currentPage.length > 0) {
//         pages.push(currentPage);
//       }

//       // console.log(`\n✅ Pagination complete! ${pages.length} pages created`);
//       pages.forEach((page, i) => {
//         const pageInfo = page.map(item =>
//           item.itemIndex !== undefined
//             ? `${item.section}[${item.itemIndex}]`
//             : `${item.section}:${item.type}`
//         ).join(", ");
//         // console.log(`   Page ${i + 1}: ${pageInfo}`);
//       });

//       setIsCalculating(false);
//       if (onCalibrating) onCalibrating(false);
//       onPagesComputed(pages.length > 0 ? pages : [[]]);
//     };

//     calculatePages();
//   }, [resumeData, sectionOrder, templateId, onPagesComputed, onCalibrating]);

//   return (
//     <div
//       ref={measureRef}
//       style={{
//         position: "absolute",
//         left: -9999,
//         top: -9999,
//         visibility: "hidden",
//         pointerEvents: "none",
//       }}
//       aria-hidden
//     />
//   );
// }