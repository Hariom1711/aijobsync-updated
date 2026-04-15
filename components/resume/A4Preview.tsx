

// A4Preview.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ResumeData } from "@/types/resume";
import ResumeContentVisible from "./ResumeContentVisible";

const A4_WIDTH = 794, A4_HEIGHT = 1160, SCALE = 0.75;

export default function A4Preview({
  resumeData,
  sectionKeys,
  editingSection,
  onPrev,
  onNext,
  currentPage = 0,
  totalPages = 1,
  templateId = "TemplateModern", // NEW: Default template // NEW: Template selector

}: {
  resumeData: ResumeData;
  sectionKeys: Array<{ section: string; type: 'header' | 'item'; itemIndex?: number }>; // CHANGED TYPE
  editingSection: keyof ResumeData | null;
  onPrev: () => void;
  onNext: () => void;
  currentPage?: number;
  totalPages?: number;
  templateId?: string; // NEW: Template selector
}) {
  // Show header only on first page (page index 0)
  const showHeader = currentPage === 0;

  return (
    <div className="flex justify-center -translate-y-20">
      <div className="relative">
        <button 
          onClick={onPrev} 
          disabled={currentPage === 0}
          className="absolute left-[-28px] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg font-bold w-8 h-8 flex items-center justify-center"
        >
          ‹
        </button>
        <button 
          onClick={onNext} 
          disabled={currentPage >= totalPages - 1}
          className="absolute right-[-28px] top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md z-20 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-lg font-bold w-8 h-8 flex items-center justify-center"
        >
          ›
        </button>

        <motion.div 
          initial={{ scale: SCALE }} 
          animate={{ scale: SCALE }} 
          transition={{ duration: 0.25 }}
        >
          <Card 
           id={`resume-page-${currentPage}`}
            className="relative bg-white shadow-2xl" 
            style={{ 
              width: `${A4_WIDTH}px`, 
              height: `${A4_HEIGHT}px`,
              overflow: 'hidden' // CRITICAL: Prevent any overflow
            }}
          >
            {/* CRITICAL FIX: Remove overflow-hidden from CardContent, add explicit height constraint */}
            <CardContent 
              className="pl-10 pr-10 pb-0" 
              style={{
                height: '100%',
                overflow: 'hidden', // Clips content that exceeds page
                // boxSizing: 'border-box'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPage} // Key by page index for smooth transitions
                  initial={{ opacity: 0, x: 12 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -12 }} 
                  transition={{ duration: 0.28 }}
                  style={{
                    height: '100%',
                    overflow: 'hidden' // Ensure content doesn't overflow motion div
                  }}
                >
                  <ResumeContentVisible 
                    resumeData={resumeData} 
                    pageItems={sectionKeys} 
                    editingSection={editingSection}
                    showHeader={showHeader}
                    templateId={templateId} // NEW: Pass template
                  />
                </motion.div>
              </AnimatePresence>
            </CardContent>
            <div className="absolute bottom-6 right-8 text-xs text-gray-400">
              Page {currentPage + 1} of {totalPages}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
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
//   templateId = "TemplateModern",
// }: {
//   resumeData: ResumeData;
//   sectionKeys: Array<{ section: string; type: 'header' | 'item'; itemIndex?: number }>;
//   editingSection: keyof ResumeData | null;
//   onPrev: () => void;
//   onNext: () => void;
//   currentPage?: number;
//   totalPages?: number;
//   templateId?: string;
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
//             id="resume-preview-container"
//             className="relative bg-white shadow-2xl" 
//             style={{ 
//               width: `${A4_WIDTH}px`, 
//               height: `${A4_HEIGHT}px`,
//               overflow: 'hidden'
//             }}
//           >
//             <CardContent 
//               className="pl-10 pr-10 pb-0" 
//               style={{
//                 height: '100%',
//                 overflow: 'hidden',
//               }}
//             >
//               <AnimatePresence mode="wait">
//                 <motion.div 
//                   key={currentPage}
//                   initial={{ opacity: 0, x: 12 }} 
//                   animate={{ opacity: 1, x: 0 }} 
//                   exit={{ opacity: 0, x: -12 }} 
//                   transition={{ duration: 0.28 }}
//                   style={{
//                     height: '100%',
//                     overflow: 'hidden'
//                   }}
//                 >
//                   <ResumeContentVisible 
//                     resumeData={resumeData} 
//                     pageItems={sectionKeys} 
//                     editingSection={editingSection}
//                     showHeader={showHeader}
//                     templateId={templateId}
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