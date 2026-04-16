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
"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS EXISTS
//
// html2canvas v1.4.x reads computed styles directly from the DOM via
// getComputedStyle(). In Chrome 111+, getComputedStyle() returns oklch()
// strings for CSS variables (Tailwind v4 uses oklch everywhere). html2canvas
// then tries to parse those oklch values, converts them to lab() internally,
// and crashes: "Attempting to parse an unsupported color function 'lab'".
//
// Injecting a <style> override doesn't help — html2canvas bypasses
// stylesheets entirely and reads element.style / getComputedStyle directly.
//
// THE FIX (same approach Notion / Linear use for client-side PDF):
//   1. Collect all resume-page-N elements from the real DOM.
//   2. Deep-clone each into a temporary off-screen container.
//   3. Walk every element in the CLONE; for each color property, read the
//      computed value from the corresponding LIVE element (browser returns
//      rgb() even for oklch vars), and stamp that rgb() as an inline style
//      on the clone. Now html2canvas only ever sees rgb().
//   4. Run html2canvas on the clone at scale:3 for crisp text.
//   5. Assemble pages into jsPDF and save.
// ─────────────────────────────────────────────────────────────────────────────

const COLOR_PROPS: (keyof CSSStyleDeclaration)[] = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "fill",
  "stroke",
];

/**
 * Stamp computed rgb() values from a live element onto its clone.
 * The browser always resolves oklch → rgb in getComputedStyle, so reading
 * from the live element gives us safe values to write onto the clone.
 */
function bakeColors(liveEl: HTMLElement, cloneEl: HTMLElement): void {
  const cs = window.getComputedStyle(liveEl);
  for (const prop of COLOR_PROPS) {
    const val = cs[prop] as string;
    // Only override if it's a real color value (not 'none', 'transparent', etc.)
    if (val && val !== "none" && val !== "transparent" && val !== "initial" && val !== "inherit") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (cloneEl.style as any)[prop] = val;
    }
  }
}

/**
 * Walk liveRoot and cloneRoot in parallel (they have identical DOM structure)
 * and bake all computed colors from live → clone.
 */
function bakeAllColors(liveRoot: HTMLElement, cloneRoot: HTMLElement): void {
  // Root itself
  bakeColors(liveRoot, cloneRoot);

  // All descendants — querySelectorAll order is document order, so indices match
  const liveEls  = liveRoot.querySelectorAll<HTMLElement>("*");
  const cloneEls = cloneRoot.querySelectorAll<HTMLElement>("*");
  const len      = Math.min(liveEls.length, cloneEls.length);

  for (let i = 0; i < len; i++) {
    bakeColors(liveEls[i], cloneEls[i]);
  }
}

/** Capture one DOM element as a high-quality canvas, oklch-safe. */
async function captureElement(liveEl: HTMLElement): Promise<HTMLCanvasElement> {
  const w = liveEl.offsetWidth  || liveEl.scrollWidth;
  const h = liveEl.offsetHeight || liveEl.scrollHeight;

  // Build an off-screen host that won't affect layout
  const host = document.createElement("div");
  host.style.cssText = [
    "position:fixed",
    "top:-99999px",
    "left:-99999px",
    `width:${w}px`,
    `height:${h}px`,
    "overflow:hidden",
    "pointer-events:none",
    "z-index:-1",
  ].join(";");
  document.body.appendChild(host);

  // Deep-clone the live element
  const clone = liveEl.cloneNode(true) as HTMLElement;
  clone.style.transform       = "none"; // strip any scale() applied for the preview
  clone.style.transformOrigin = "top left";
  clone.style.width           = `${w}px`;
  clone.style.height          = `${h}px`;
  clone.style.overflow        = "visible"; // let html2canvas see full content
  clone.style.backgroundColor = "#ffffff";
  host.appendChild(clone);

  // ── CORE FIX: bake all computed rgb() values onto the clone ──────────────
  // Must happen AFTER the clone is in the DOM (so getComputedStyle works on live)
  bakeAllColors(liveEl, clone);

  try {
    const canvas = await html2canvas(clone, {
      scale:           3,        // 3× = ~300 dpi equivalent — crisp on retina
      useCORS:         true,
      logging:         false,
      backgroundColor: "#ffffff",
      width:           w,
      height:          h,
      // onclone is a second safety net: fix any colors html2canvas re-reads
      // from the cloned document's stylesheet (not element styles)
      onclone: (_doc: Document, el: HTMLElement) => {
        el.style.backgroundColor = "#ffffff";
        // Strip any remaining oklch from inline style attributes
        // (e.g. set by Framer Motion or dynamic JS after our bake pass)
        el.querySelectorAll<HTMLElement>("[style]").forEach((node) => {
          const s = node.getAttribute("style") ?? "";
          if (s.includes("oklch") || s.includes("oklab") || s.includes("lab(")) {
            node.setAttribute(
              "style",
              s
                .replace(/oklch\s*\([^)]*\)/gi, "rgb(0,0,0)")
                .replace(/oklab\s*\([^)]*\)/gi, "rgb(0,0,0)")
                .replace(/lab\s*\([^)]*\)/gi,   "rgb(0,0,0)")
            );
          }
        });
      },
    });
    return canvas;
  } finally {
    document.body.removeChild(host);
  }
}

/**
 * Export all resume pages to a multi-page A4 PDF.
 *
 * Looks for DOM elements with id="resume-page-0", "resume-page-1", …
 * Falls back to id="resume-preview-container" for single-page resumes.
 */
export async function exportResumeToPDF(filename = "resume.pdf"): Promise<boolean> {
  try {
    // ── 1. Collect page elements ───────────────────────────────────────────
    const pageEls: HTMLElement[] = [];
    let i = 0;
    while (true) {
      const el = document.getElementById(`resume-page-${i}`);
      if (!el) break;
      pageEls.push(el);
      i++;
    }
    if (pageEls.length === 0) {
      const single = document.getElementById("resume-preview-container");
      if (single) pageEls.push(single);
    }
    if (pageEls.length === 0) {
      console.error("[exportResumeToPDF] No resume page elements found in the DOM.");
      return false;
    }

    // ── 2. Set up jsPDF ────────────────────────────────────────────────────
    const pdf      = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const PDF_W    = 210; // mm
    const PDF_H    = 297; // mm

    // ── 3. Capture each page and add to PDF ───────────────────────────────
    for (let p = 0; p < pageEls.length; p++) {
      const el = pageEls[p];

      // Capture at full real size (794 × 1122 px), scale:3 inside
      const canvas = await captureElement(el);

      if (p > 0) pdf.addPage();

      // Fit canvas proportionally into A4
      // canvas dimensions: (el.offsetWidth * 3) × (el.offsetHeight * 3)
      const imgData   = canvas.toDataURL("image/jpeg", 0.97);
      const imgW      = PDF_W;
      const imgH      = (canvas.height / canvas.width) * PDF_W;

      if (imgH <= PDF_H) {
        // Fits on one page — center vertically if short
        const yOffset = imgH < PDF_H ? (PDF_H - imgH) / 2 : 0;
        pdf.addImage(imgData, "JPEG", 0, yOffset, imgW, imgH, undefined, "FAST");
      } else {
        // Taller than A4 — tile across pages (edge case: should not happen
        // when pagination is working correctly, but handled gracefully)
        let remaining = imgH;
        let yPos      = 0;
        pdf.addImage(imgData, "JPEG", 0, yPos, imgW, imgH, undefined, "FAST");
        remaining -= PDF_H;
        while (remaining > 0) {
          yPos -= PDF_H;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, yPos, imgW, imgH, undefined, "FAST");
          remaining -= PDF_H;
        }
      }
    }

    // ── 4. Save ────────────────────────────────────────────────────────────
    pdf.save(filename);
    return true;

  } catch (err) {
    console.error("[exportResumeToPDF] Error:", err);
    return false;
  }
}
