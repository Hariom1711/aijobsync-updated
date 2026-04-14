// // aijobsync\components\resume-templates\TemplateCard.tsx

// "use client";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { Crown, Eye } from "lucide-react";

// export default function TemplateCard({ template, onSelect }: any) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="relative group rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl overflow-hidden hover:bg-white/15 transition-all shadow-lg"
//     >
//       <div className="relative w-full h-64 overflow-hidden">
//         <Image
//           src={template.thumbnail}
//           alt={template.name}
//           fill
//           className="object-cover group-hover:scale-105 transition-transform duration-500"
//         />
//       </div>

//       <div className="p-4 text-white space-y-2">
//         <div className="flex items-center justify-between">
//           <h3 className="font-semibold text-lg">{template.name}</h3>
//           {template.type === "PRO" && (
//             <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold">
//               <Crown size={14} /> PRO
//             </div>
//           )}
//         </div>
//         <p className="text-purple-200 text-sm">{template.description}</p>

//         <div className="flex items-center justify-between pt-2">
//           <span className="text-xs text-green-300">
//             ATS Score: {template.atsScore}
//           </span>
//           <Button
//             size="sm"
//             onClick={() => onSelect(template)}
//             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
//           >
//             <Eye className="h-4 w-4 mr-1" /> Preview
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }



// ============================================
// FILE 1: components/resume-templates/TemplateCard.tsx
// ============================================
/* eslint-disable @typescript-eslint/no-explicit-any */


import { motion } from "framer-motion";
import { Crown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  description: string;
  type: "FREE" | "PRO";
  thumbnail: string;
  component: string;
  atsScore: string;
  tags: string[];
}

interface TemplateCardProps {
  template: any;
  onSelect: (template: Template) => void;
  index: number;
}

export default function TemplateCard({ template, onSelect, index }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="relative group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:bg-white/10 transition-all shadow-lg hover:shadow-purple-500/20"
    >
      {/* PRO Badge */}
      {template.type === "PRO" && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          <Crown size={12} /> PRO
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
        {/* Fallback if no image - show first letter */}
        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-6xl font-bold">
          {template.name.charAt(0)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 text-white space-y-3">
        <div>
          <h3 className="font-bold text-lg mb-1">{template.name}</h3>
          <p className="text-purple-200/80 text-sm leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {template.tags.slice(0, 2).map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ATS {template.atsScore}
          </span>
          <Button
            size="sm"
            onClick={() => onSelect(template)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
