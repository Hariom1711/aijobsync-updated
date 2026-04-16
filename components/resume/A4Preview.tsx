

// // A4Preview.tsx
// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { ResumeData } from "@/types/resume";
// import ResumeContentVisible from "./ResumeContentVisible";

// const A4_WIDTH = 794, A4_HEIGHT = 1160, SCALE = 0.75;

// export default function A4Preview({
//   resumeData,
//   sectionKeys,
//   editingSection,
//   onPrev,
//   onNext,
//   currentPage = 0,
//   totalPages = 1,
//   templateId = "TemplateModern", // NEW: Default template // NEW: Template selector

// }: {
//   resumeData: ResumeData;
//   sectionKeys: Array<{ section: string; type: 'header' | 'item'; itemIndex?: number }>; // CHANGED TYPE
//   editingSection: keyof ResumeData | null;
//   onPrev: () => void;
//   onNext: () => void;
//   currentPage?: number;
//   totalPages?: number;
//   templateId?: string; // NEW: Template selector
// }) {
//   // Show header only on first page (page index 0)
//   const showHeader = currentPage === 0;

//   return (
//     <div className="flex justify-center -translate-y-20">
//       <div className="relative">
//         <button 
//           onClick={onPrev} 
//           disabled={currentPage === 0}
//           className="absolute left-[-28px] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg font-bold w-8 h-8 flex items-center justify-center"
//         >
//           ‹
//         </button>
//         <button 
//           onClick={onNext} 
//           disabled={currentPage >= totalPages - 1}
//           className="absolute right-[-28px] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg font-bold w-8 h-8 flex items-center justify-center"
//         >
//           ›
//         </button>

//         <motion.div 
//           initial={{ scale: SCALE }} 
//           animate={{ scale: SCALE }} 
//           transition={{ duration: 0.25 }}
//         >
//           <Card 
//            id={`resume-page-${currentPage}`}
//             className="relative bg-white shadow-2xl" 
//             style={{ 
//               width: `${A4_WIDTH}px`, 
//               height: `${A4_HEIGHT}px`,
//               // overflow: 'hidden' // CRITICAL: Prevent any overflow
//             }}
//           >
//             {/* CRITICAL FIX: Remove overflow-hidden from CardContent, add explicit height constraint */}
//             <CardContent 
//               className="pl-10 pr-10 pb-0" 
//               style={{
//                minHeight: '100%',
//                 // overflow: 'hidden', // Clips content that exceeds page
//                 boxSizing: 'border-box'
//               }}
//             >
//               <AnimatePresence mode="wait">
//                 <motion.div 
//                   key={currentPage} // Key by page index for smooth transitions
//                   initial={{ opacity: 0, x: 12 }} 
//                   animate={{ opacity: 1, x: 0 }} 
//                   exit={{ opacity: 0, x: -12 }} 
//                   transition={{ duration: 0.28 }}
//                   style={{
//                     height: '100%',
//                     // overflow: 'hidden' // Ensure content doesn't overflow motion div
//                   }}
//                 >
//                   <ResumeContentVisible 
//                     resumeData={resumeData} 
//                     pageItems={sectionKeys} 
//                     editingSection={editingSection}
//                     showHeader={showHeader}
//                     templateId={templateId} // NEW: Pass template
//                   />
                  
//                 </motion.div>
//               </AnimatePresence>
//             </CardContent>
//             <div className="absolute bottom-6 right-8 text-xs text-gray-400">
//               Page {currentPage + 1} of {totalPages}
//             </div>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


// A4Preview.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeData } from "@/types/resume";
import ResumeContentVisible from "./ResumeContentVisible";

const A4_WIDTH  = 794;
const A4_HEIGHT = 1122; // true A4 height at 96 dpi
const SCALE     = 0.75;

// The scaled card occupies this much space in the layout
const SCALED_WIDTH  = A4_WIDTH  * SCALE; // 595.5 px
const SCALED_HEIGHT = A4_HEIGHT * SCALE; // 841.5 px

export default function A4Preview({
  resumeData,
  sectionKeys,
  editingSection,
  onPrev,
  onNext,
  currentPage = 0,
  totalPages = 1,
  templateId = "TemplateModern",
}: {
  resumeData: ResumeData;
  sectionKeys: Array<{ section: string; type: "header" | "item"; itemIndex?: number }>;
  editingSection: keyof ResumeData | null;
  onPrev: () => void;
  onNext: () => void;
  currentPage?: number;
  totalPages?: number;
  templateId?: string;
}) {
  const showHeader = currentPage === 0;

  return (
    // Outer wrapper: centres the card, reserves exact scaled footprint in layout
    // NO -translate-y-20 (that was pushing the card 80px off-screen)
    <div className="flex justify-center">
      {/* This div reserves the scaled footprint so the surrounding grid stays stable */}
      <div
        style={{
          position: "relative",
          width:  SCALED_WIDTH,
          height: SCALED_HEIGHT,
        }}
      >
        {/* Prev / Next navigation arrows */}
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          className="absolute left-[-32px] top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg font-bold w-8 h-8 flex items-center justify-center"
        >
          ‹
        </button>
        <button
          onClick={onNext}
          disabled={currentPage >= totalPages - 1}
          className="absolute right-[-32px] top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg font-bold w-8 h-8 flex items-center justify-center"
        >
          ›
        </button>

        {/*
          The actual A4 card lives at full 794×1122 px and is scaled down via
          transform. transform-origin: top left means it shrinks into the top-left
          corner of the reserved footprint div above — no layout shift.
        */}
        <div
          id={`resume-page-${currentPage}`}
          style={{
            position:        "absolute",
            top:             0,
            left:            0,
            width:           A4_WIDTH,
            height:          A4_HEIGHT,
            transform:       `scale(${SCALE})`,
            transformOrigin: "top left",
            backgroundColor: "#fff",
            boxShadow:       "0 20px 60px rgba(0,0,0,0.35)",
            borderRadius:    4,
            overflow:        "hidden", // clips content that exceeds A4 bounds
          }}
        >
          {/* 40px padding on all sides — matches what SimpleMeasurementContainer uses */}
          <div
            style={{
              padding:    "40px",
              height:     "100%",
              overflow:   "hidden",
              boxSizing:  "border-box",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                style={{ height: "100%", overflow: "hidden" }}
              >
                <ResumeContentVisible
                  resumeData={resumeData}
                  pageItems={sectionKeys}
                  editingSection={editingSection}
                  showHeader={showHeader}
                  templateId={templateId}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Page number badge */}
          <div
            style={{
              position:   "absolute",
              bottom:     16,
              right:      24,
              fontSize:   11,
              color:      "#9ca3af",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
            }}
          >
            Page {currentPage + 1} of {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
}