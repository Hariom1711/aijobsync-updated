// // utils/exportResumePDF.ts
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// /**
//  * Exports all resume pages to a multi-page PDF.
//  * Looks for elements with id="resume-page-0", "resume-page-1", etc.
//  * Falls back to id="resume-preview-container" for single page.
//  */
// export async function exportResumeToPDF(filename = "resume.pdf"): Promise<boolean> {
//   try {
//     const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
//     const pdfWidth = 210;
//     const pdfHeight = 297;

//     // Collect all page elements
//     const pageEls: HTMLElement[] = [];
//     let i = 0;
//     while (true) {
//       const el = document.getElementById(`resume-page-${i}`);
//       if (!el) break;
//       pageEls.push(el);
//       i++;
//     }

//     // Fallback to single container
//     if (pageEls.length === 0) {
//       const single = document.getElementById("resume-preview-container");
//       if (single) pageEls.push(single);
//     }

//     if (pageEls.length === 0) {
//       console.error("No resume page elements found");
//       return false;
//     }

//     for (let p = 0; p < pageEls.length; p++) {
//       const element = pageEls[p];

//       // Temporarily make fully visible for capture
//       const prevVisibility = element.style.visibility;
//       const prevPosition = element.style.position;
//       element.style.visibility = "visible";

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: "#ffffff",
//         width: element.scrollWidth,
//         height: element.scrollHeight,
//         onclone: (clonedDoc) => {
//           // Force white background and fix color spaces
//           const allEls = clonedDoc.querySelectorAll<HTMLElement>("*");
//           allEls.forEach((el) => {
//             const cs = window.getComputedStyle(el);
//             // Strip unsupported oklch/oklab from inline styles
//             if (el.getAttribute("style")?.includes("oklch") || el.getAttribute("style")?.includes("oklab")) {
//               el.style.cssText = el.style.cssText
//                 .replace(/oklch\([^)]+\)/g, "")
//                 .replace(/oklab\([^)]+\)/g, "");
//             }
//             // Apply computed rgb equivalents for background
//             if (cs.backgroundColor && !cs.backgroundColor.startsWith("rgb")) {
//               el.style.backgroundColor = cs.backgroundColor;
//             }
//           });
//           // Force white on the page itself
//           const pageEl = clonedDoc.getElementById(`resume-page-${p}`) ||
//                          clonedDoc.getElementById("resume-preview-container");
//           if (pageEl) pageEl.style.backgroundColor = "#ffffff";
//         },
//       });

//       element.style.visibility = prevVisibility;

//       if (p > 0) pdf.addPage();

//       const imgData = canvas.toDataURL("image/png");
//       const imgHeight = (canvas.height * pdfWidth) / canvas.width;

//       // If a single page overflows A4, we split it
//       if (imgHeight <= pdfHeight) {
//         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight, undefined, "FAST");
//       } else {
//         // Split oversized content across multiple PDF pages
//         let heightLeft = imgHeight;
//         let position = 0;
//         pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
//         heightLeft -= pdfHeight;
//         while (heightLeft > 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
//           heightLeft -= pdfHeight;
//         }
//       }
//     }

//     pdf.save(filename);
//     return true;
//   } catch (err) {
//     console.error("PDF export error:", err);
//     return false;
//   }
// }


// utils/exportResumePDF.ts
// utils/exportResumePDF.ts
// ─────────────────────────────────────────────────────────────────────────────
// Notion-quality PDF export using @react-pdf/renderer.
//
// WHY WE DROPPED html2canvas
// ──────────────────────────
// html2canvas v1.4.x reads computed styles via getComputedStyle(). In
// Chrome 111+, Tailwind v4 resolves CSS custom properties (e.g. --background)
// to their oklch() values. html2canvas then tries to internally convert
// oklch → lab() — a color function it never implemented — and crashes:
//
//   "Attempting to parse an unsupported color function 'lab'"
//
// Even stripping oklch from inline styles doesn't help because html2canvas
// also reads the page's stylesheets, which still contain the oklch vars.
//
// THE FIX
// ───────
// @react-pdf/renderer generates PDFs from React component trees using its
// own layout engine + pdfkit. It never touches the DOM, getComputedStyle,
// or any CSS — so oklch, lab, and every other modern color function are
// completely irrelevant. This is the same approach Notion uses internally.
//
// USAGE
// ─────
//   import { exportResumeToPDF } from "@/utils/exportResumePDF";
//   const ok = await exportResumeToPDF(resumeData, "MyResume.pdf", "TemplateModern");
// ─────────────────────────────────────────────────────────────────────────────
// "use client";

// import { pdf, Document, Page } from "@react-pdf/renderer";
// import React from "react";
// import { ResumeData } from "@/types/resume";
// import ResumePDFDocument from "./ResumePDFDocument";

// /**
//  * Generate and download a PDF resume.
//  *
//  * @param resumeData  - The full resume data object
//  * @param filename    - Downloaded file name (default: "resume.pdf")
//  * @param templateId  - "TemplateModern" | "TemplateMinimal" | "TemplateClassic"
//  * @returns           - true on success, false on failure
//  */
// export async function exportResumeToPDF(
//   resumeData: ResumeData,
//   filename = "resume.pdf",
//   templateId = "TemplateModern",
// ): Promise<boolean> {
//   try {
//     // Build the @react-pdf Document element
//     const docElement = React.createElement(
//       Document,
//       {},
//       React.createElement(Page, {}, React.createElement(ResumePDFDocument, { resumeData, templateId }))
//     );

//     // pdf() returns a blob-like object; toBlob() resolves to a real Blob
//     const instance = pdf(docElement);
//     const blob = await instance.toBlob();

//     // Trigger browser download
//     const url = URL.createObjectURL(blob);
//     const a   = document.createElement("a");
//     a.href     = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);

//     // Release the object URL after a short delay
//     setTimeout(() => URL.revokeObjectURL(url), 5000);

//     return true;
//   } catch (err) {
//     console.error("[exportResumeToPDF] Error:", err);
//     return false;
//   }
// }
"use client";

import { pdf } from "@react-pdf/renderer";
import React from "react";
import { ResumeData } from "@/types/resume";
import ResumePDFDocument from "./ResumePDFDocument";

/**
 * Generate and download a PDF resume.
 *
 * @param resumeData  - The full resume data object
 * @param filename    - Downloaded file name (default: "resume.pdf")
 * @param templateId  - "TemplateModern" | "TemplateMinimal" | "TemplateClassic"
 * @returns           - true on success, false on failure
 */
export async function exportResumeToPDF(
  resumeData: ResumeData,
  filename = "resume.pdf",
  templateId = "TemplateModern",
): Promise<boolean> {
  try {
    // ResumePDFDocument already wraps everything in <Document><Page>.
    // Do NOT add another Document/Page layer — that causes a blank first page.
    const docElement = React.createElement(ResumePDFDocument, { resumeData, templateId });

    // pdf() returns a blob-like object; toBlob() resolves to a real Blob
    const instance = pdf(docElement);
    const blob = await instance.toBlob();

    // Trigger browser download
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Release the object URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 5000);

    return true;
  } catch (err) {
    console.error("[exportResumeToPDF] Error:", err);
    return false;
  }
}

