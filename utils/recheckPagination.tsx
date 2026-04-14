// "use client";

// import React from "react";
// import { createRoot, Root } from "react-dom/client";
// import { ResumeData } from "@/types/resume";
// import { TEMPLATE_COMPONENTS } from "@/components/resume-templates/layouts";

// // --- TYPES ---
// export interface PageItem {
//   section: string;
//   type: "header" | "item";
//   itemIndex?: number;
// }

// /**
//  * Re-check pages by rendering each page off-screen using React 18's createRoot,
//  * measuring scrollHeight, and if overflow detected, move the last item to next page.
//  *
//  * Returns corrected pages.
//  */
// export async function recheckPagination(
//   pages: PageItem[][],
//   templateId: keyof typeof TEMPLATE_COMPONENTS,
//   resumeData: ResumeData
// ): Promise<PageItem[][]> {
//   return new Promise((resolve) => {
//     const A4_WIDTH = 794;
//     const A4_HEIGHT = 1123;
//     const PAGE_MARGIN = 10;

//     // invisible container for off-screen rendering
//     const tempContainer = document.createElement("div");
//     tempContainer.style.position = "absolute";
//     tempContainer.style.left = "-9999px";
//     tempContainer.style.top = "0";
//     tempContainer.style.width = `${A4_WIDTH}px`;
//     tempContainer.style.zIndex = "-1";
//     tempContainer.style.visibility = "hidden";
//     document.body.appendChild(tempContainer);

//     const TemplateComponent = TEMPLATE_COMPONENTS[templateId];
//     const corrected: PageItem[][] = [];

//     // render and measure each page sequentially
//     const renderPage = (i: number) => {
//       if (i >= pages.length) {
//         // done
//         try {
//           document.body.removeChild(tempContainer);
//         } catch (e) {
//           /* ignore */
//         }
//         resolve(corrected);
//         return;
//       }

//       const page = pages[i];
//       const pageWrapper = document.createElement("div");
//       pageWrapper.style.width = `${A4_WIDTH}px`;
//       pageWrapper.style.overflow = "visible";
//       tempContainer.appendChild(pageWrapper);

//       // create a root and render the template for this page
//       let root: Root | null = null;
//       try {
//         root = createRoot(pageWrapper);
//       } catch (err) {
//         console.error("recheckPagination createRoot error:", err);
//         // fallback: push page as-is and continue
//         corrected.push([...page]);
//         tempContainer.removeChild(pageWrapper);
//         setTimeout(() => renderPage(i + 1), 0);
//         return;
//       }

//       try {
//         root.render(
//           <TemplateComponent
//             resumeData={resumeData}
//             pageItems={page}
//             // editingSection is irrelevant for offscreen measurement
//             editingSection={null as any}
//             showHeader={i === 0}
//           />
//         );
//       } catch (err) {
//         console.error("recheckPagination render error:", err);
//         // cleanup and continue
//         try {
//           root.unmount();
//         } catch {}
//         try {
//           tempContainer.removeChild(pageWrapper);
//         } catch {}
//         corrected.push([...page]);
//         setTimeout(() => renderPage(i + 1), 0);
//         return;
//       }

//       // Wait for the browser to paint and layout to stabilize before measuring.
//       // Using requestAnimationFrame twice gives a reliable point after the DOM update.
//       requestAnimationFrame(() => {
//         requestAnimationFrame(() => {
//           try {
//             const h = pageWrapper.scrollHeight;
//             if (h > A4_HEIGHT - PAGE_MARGIN) {
//               // overflow detected: move last item to next page
//               const lastItem = page.pop();
//               if (lastItem) {
//                 if (!pages[i + 1]) pages[i + 1] = [];
//                 pages[i + 1].unshift(lastItem);
//               }
//             }

//             corrected.push([...page]);
//           } catch (err) {
//             console.error("recheckPagination measurement error:", err);
//             corrected.push([...page]);
//           } finally {
//             // unmount and cleanup wrapper, then proceed to next page
//             try {
//               if (root) root.unmount();
//             } catch (e) {
//               /* ignore */
//             }
//             try {
//               tempContainer.removeChild(pageWrapper);
//             } catch (e) {
//               /* ignore */
//             }
//             // small delay to avoid UI thread blocking
//             setTimeout(() => renderPage(i + 1), 0);
//           }
//         });
//       });
//     };

//     // start
//     renderPage(0);
//   });
// }



import { useCallback } from "react";
import ReactDOM from "react-dom/client";
import { ResumeData } from "@/types/resume";

const A4_HEIGHT = 1123;
const PAGE_MARGIN = 50;

export function useRecheckPagination() {
  const recheck = useCallback(
    async (TemplateComponent: any, pages: any[][], resumeData: ResumeData) => {
      const corrected: any[][] = [];
      const container = document.createElement("div");
      container.style.cssText = `
        position:absolute; left:-9999px; top:-9999px;
        width:794px; padding:48px; box-sizing:border-box;
      `;
      document.body.appendChild(container);

      for (let i = 0; i < pages.length; i++) {
        const page = [...pages[i]];
        const wrapper = document.createElement("div");
        wrapper.className = "page-content";
        container.appendChild(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        await new Promise<void>((resolve) => {
          root.render(
            <TemplateComponent
              resumeData={resumeData}
              pageItems={page}
              editingSection={null}
              showHeader={i === 0}
            />
          );
          setTimeout(() => {
            try {
              const h = wrapper.scrollHeight;
              if (h > A4_HEIGHT - PAGE_MARGIN) {
                const lastItem = page.pop();
                if (lastItem) {
                  if (!pages[i + 1]) pages[i + 1] = [];
                  pages[i + 1].unshift(lastItem);
                }
              }
              corrected.push([...page]);
            } catch (e) {
              console.error("⚠️ recheckPagination error", e);
            } finally {
              root.unmount();
              wrapper.remove();
              resolve();
            }
          }, 20); // let DOM paint
        });
      }

      container.remove();
      return corrected;
    },
    []
  );

  return recheck;
}
