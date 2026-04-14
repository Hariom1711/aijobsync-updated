// // PaginationControls.tsx
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function PaginationControls({
//   currentPage = 0,
//   totalPages = 1,
//   onPrev,
//   onNext,
//   onJump,

// }: {
//   currentPage: number;
//   totalPages: number;
//   onPrev: () => void;
//   onNext: () => void;
//   onJump: (i: number) => void;
// }) {
//   return (
//     <div className="flex items-center justify-between ">
//       <div className="flex items-center gap-3">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onPrev}
//           disabled={currentPage === 0}
//           className="text-white hover:bg-white/10"
//         >
//           <ChevronLeft className="w-4 h-4 mr-2" /> Prev
//         </Button>

//         <span className="text-sm font-medium px-3 py-1 bg-white/10 text-white rounded">
//           Page {currentPage + 1} of {totalPages}
//         </span>

//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onNext}
//           disabled={currentPage === totalPages - 1}
//           className="text-white hover:bg-white/10"
//         >
//           Next <ChevronRight className="w-4 h-4 ml-2" />
//         </Button>
//       </div>

//       <div className="flex gap-2">
//         {Array.from({ length: totalPages }).map((_, idx) => (
//           <button
//             key={idx}
//             onClick={() => onJump(idx)}
//             className={`w-2 h-2 rounded-full transition-all ${
//               idx === currentPage
//                 ? "bg-white w-6"
//                 : "bg-white/40 hover:bg-white/60"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */



// PaginationControls.tsx — hardened + debug-friendly
import React, { useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({
  currentPage = 0,
  totalPages = 1,
  onPrev,
  onNext,
  onJump,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (i: number) => void;
}) {
  // debug: show incoming prop changes (remove in production)
  useEffect(() => {
    // console.log("[PaginationControls] props:", { currentPage, totalPages, hasPrev: currentPage > 0, hasNext: currentPage < totalPages - 1 });
  }, [currentPage, totalPages]);

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // console.log("[PaginationControls] Prev clicked (disabled?)", currentPage === 0);
      if (currentPage === 0) return;
      if (typeof onPrev === "function") onPrev();
    },
    [currentPage, onPrev]
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // console.log("[PaginationControls] Next clicked (disabled?)", currentPage >= totalPages - 1);
      if (currentPage >= totalPages - 1) return;
      if (typeof onNext === "function") onNext();
    },
    [currentPage, totalPages, onNext]
  );

  const handleJump = useCallback(
    (i: number) =>
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log("[PaginationControls] Jump to", i);
        if (i === currentPage) return;
        if (typeof onJump === "function") onJump(i);
      },
    [currentPage, onJump]
  );

  // Defensive clamp for UI rendering (avoid negative or huge lengths)
  const safeTotal = Math.max(1, Math.floor(Number(totalPages) || 1));
  const safeCurrent = Math.max(0, Math.min(safeTotal - 1, Math.floor(Number(currentPage) || 0)));

  return (
    <div className="flex items-center justify-between" style={{ zIndex: 30 }}>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          disabled={safeCurrent === 0}
          className="text-white hover:bg-white/10"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Prev
        </Button>

        <span className="text-sm font-medium px-3 py-1 bg-white/10 text-white rounded select-none">
          Page {safeCurrent + 1} of {safeTotal}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={safeCurrent === safeTotal - 1}
          className="text-white hover:bg-white/10"
          aria-label="Next page"
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="flex gap-2" role="tablist" aria-label="Page jump">
        {Array.from({ length: safeTotal }).map((_, idx) => {
          const isActive = idx === safeCurrent;
          return (
            <button
              key={idx}
              type="button"
              onClick={handleJump(idx)}
              aria-current={isActive ? "true" : "false"}
              aria-label={`Jump to page ${idx + 1}`}
              className={`rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isActive ? "bg-white w-6 h-2 rounded-full" : "bg-white/40 hover:bg-white/60 w-2 h-2"
              }`}
              style={{ display: "inline-block" }}
            />
          );
        })}
      </div>
    </div>
  );
}
