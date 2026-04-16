// utils/exportResumePDF.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exports all resume pages to a multi-page PDF.
 * Looks for elements with id="resume-page-0", "resume-page-1", etc.
 * Falls back to id="resume-preview-container" for single page.
 */
export async function exportResumeToPDF(filename = "resume.pdf"): Promise<boolean> {
  try {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Collect all page elements
    const pageEls: HTMLElement[] = [];
    let i = 0;
    while (true) {
      const el = document.getElementById(`resume-page-${i}`);
      if (!el) break;
      pageEls.push(el);
      i++;
    }

    // Fallback to single container
    if (pageEls.length === 0) {
      const single = document.getElementById("resume-preview-container");
      if (single) pageEls.push(single);
    }

    if (pageEls.length === 0) {
      console.error("No resume page elements found");
      return false;
    }

    for (let p = 0; p < pageEls.length; p++) {
      const element = pageEls[p];

      // Temporarily make fully visible for capture
      const prevVisibility = element.style.visibility;
      const prevPosition = element.style.position;
      element.style.visibility = "visible";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Force white background and fix color spaces
          const allEls = clonedDoc.querySelectorAll<HTMLElement>("*");
          allEls.forEach((el) => {
            const cs = window.getComputedStyle(el);
            // Strip unsupported oklch/oklab from inline styles
            if (el.getAttribute("style")?.includes("oklch") || el.getAttribute("style")?.includes("oklab")) {
              el.style.cssText = el.style.cssText
                .replace(/oklch\([^)]+\)/g, "")
                .replace(/oklab\([^)]+\)/g, "");
            }
            // Apply computed rgb equivalents for background
            if (cs.backgroundColor && !cs.backgroundColor.startsWith("rgb")) {
              el.style.backgroundColor = cs.backgroundColor;
            }
          });
          // Force white on the page itself
          const pageEl = clonedDoc.getElementById(`resume-page-${p}`) ||
                         clonedDoc.getElementById("resume-preview-container");
          if (pageEl) pageEl.style.backgroundColor = "#ffffff";
        },
      });

      element.style.visibility = prevVisibility;

      if (p > 0) pdf.addPage();

      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // If a single page overflows A4, we split it
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight, undefined, "FAST");
      } else {
        // Split oversized content across multiple PDF pages
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
        heightLeft -= pdfHeight;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
          heightLeft -= pdfHeight;
        }
      }
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error("PDF export error:", err);
    return false;
  }
}
