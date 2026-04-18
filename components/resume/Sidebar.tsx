

// "use client";

// import React, { useState } from "react";
// import { ResumeData } from "@/types/resume";
// import {
//   User,
//   FileText,
//   Briefcase,
//   Wrench,
//   GraduationCap,
//   Trophy,
//   Award,
//   Plus,
//   Eye,
//   EyeOff,
//   Pencil,
//   GripVertical,
// } from "lucide-react";
// import { exportResumeToPDF } from "@/utils/exportResumePDF";
// import { toast } from "sonner";
// import { Download, Loader2 } from "lucide-react"; // already in file, bas add karo
// interface SidebarProps {
//   resumeData: ResumeData;
//   toggleSection: (key: keyof ResumeData) => void;
//   onEdit: (key: keyof ResumeData) => void;
//   onAddSection: () => void;
//   sectionOrder: (keyof ResumeData)[];
//   setSectionOrder: React.Dispatch<React.SetStateAction<(keyof ResumeData)[]>>;
//   /** The active template component name, e.g. "TemplateModern" */
//   templateId?: string;
// }

// // icon mapping
// const iconMap: Record<string, any> = {
//   personalInfo: User,
//   summary: FileText,
//   skills: Wrench,
//   experience: Briefcase,
//   education: GraduationCap,
//   projects: FileText,
//   achievements: Trophy,
//   certifications: Award,
// };

// export default function Sidebar({
//   resumeData,
//   toggleSection,
//   onEdit,
//   onAddSection,
//   sectionOrder,
//   setSectionOrder,
//   templateId = "TemplateModern",
// }: SidebarProps) {
//   const [draggedItem, setDraggedItem] = useState<string | null>(null);
//   const [isExporting, setIsExporting] = useState(false);
//   const handleDragStart = (key: string) => {
//     setDraggedItem(key);
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//   };

//   const handleDrop = (targetKey: string) => {
//     if (!draggedItem || draggedItem === targetKey) return;

//     const newOrder = [...sectionOrder];
//     const fromIndex = newOrder.indexOf(draggedItem as any);
//     const toIndex = newOrder.indexOf(targetKey as any);

//     // remove dragged item
//     newOrder.splice(fromIndex, 1);
//     // insert at new position
//     newOrder.splice(toIndex, 0, draggedItem as any);

//     setSectionOrder(newOrder);
//     setDraggedItem(null);
//   };

//   const handleExportPDF = async () => {
//     setIsExporting(true);
//     const tid = toast.loading("Generating PDF…");
//     try {
//       const ok = await exportResumeToPDF(resumeData, "resume.pdf", templateId);
//       if (ok) {
//         toast.success("PDF downloaded!", { id: tid });
//       } else {
//         toast.error("Export failed — no resume found on page.", { id: tid });
//       }
//     } catch {
//       toast.error("Export failed. Please try again.", { id: tid });
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-fit">
//       {/* Header */}
//       <h2 className="text-white text-lg font-semibold mb-4">
//         🧾 Resume Sections
//       </h2>

//       {/* Sections */}
//       <div className="space-y-2">
//         {sectionOrder.map((key) => {
//           const section = resumeData[key] as any;
//           const Icon = iconMap[key] || FileText;

//           return (
//             <div
//               key={key}
//               draggable
//               onDragStart={() => handleDragStart(key as string)}
//               onDragOver={handleDragOver}
//               onDrop={() => handleDrop(key as string)}
//               className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
//               ${
//                 section?.visible
//                   ? "bg-white/10 border-white/10"
//                   : "bg-white/5 border-white/5 opacity-60"
//               }
//               hover:bg-white/20`}
//             >
//               {/* Left */}
//               <div className="flex items-center gap-3">
//                 <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
//                 <Icon className="w-4 h-4 text-purple-400" />
//                 <span className="text-sm text-white font-medium capitalize">
//                   {key}
//                 </span>
//               </div>

//               {/* Right Actions */}
//               <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
//                 {/* Edit */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onEdit(key);
//                   }}
//                   className="text-purple-300 hover:text-white"
//                 >
//                   <Pencil size={14} />
//                 </button>

//                 {/* Toggle */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleSection(key);
//                   }}
//                   className="text-gray-300 hover:text-white"
//                 >
//                   {section?.visible ? <Eye size={14} /> : <EyeOff size={14} />}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Add Section */}
//       <button
//         onClick={onAddSection}
//         className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-medium"
//       >
//         <Plus size={16} />
//         Add Section
//       </button>
//       <button
//         onClick={handleExportPDF}
//         disabled={isExporting}
//         className="mt-2 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 disabled:cursor-not-allowed transition text-white text-sm font-medium"
//       >
//         {isExporting ? (
//           <>
//             <Loader2 size={16} className="animate-spin" /> Exporting…
//           </>
//         ) : (
//           <>
//             <Download size={16} /> Download PDF
//           </>
//         )}
//       </button>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import { ResumeData } from "@/types/resume";
import {
  User,
  FileText,
  Briefcase,
  Wrench,
  GraduationCap,
  Trophy,
  Award,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  GripVertical,
  Sparkles,
  Loader2,
  Download,
  Crown,
} from "lucide-react";
import { exportResumeToPDF } from "@/utils/exportResumePDF";
import { toast } from "sonner";

interface SidebarProps {
  resumeData: ResumeData;
  toggleSection: (key: keyof ResumeData) => void;
  onEdit: (key: keyof ResumeData) => void;
  onAddSection: () => void;
  sectionOrder: (keyof ResumeData)[];
  setSectionOrder: React.Dispatch<React.SetStateAction<(keyof ResumeData)[]>>;
  templateId?: string;
  isPro?: boolean;
  onAiRewrite?: (section: keyof ResumeData) => void;
  aiRewriting?: string | null;
}

const iconMap: Record<string, any> = {
  personalInfo: User,
  summary: FileText,
  skills: Wrench,
  experience: Briefcase,
  education: GraduationCap,
  projects: FileText,
  achievements: Trophy,
  certifications: Award,
};

export default function Sidebar({
  resumeData,
  toggleSection,
  onEdit,
  onAddSection,
  sectionOrder,
  setSectionOrder,
  templateId = "TemplateModern",
  isPro = false,
  onAiRewrite,
  aiRewriting,
}: SidebarProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDragStart = (key: string) => setDraggedItem(key);
  const handleDragOver  = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (targetKey: string) => {
    if (!draggedItem || draggedItem === targetKey) return;
    const newOrder = [...sectionOrder];
    const fromIndex = newOrder.indexOf(draggedItem as any);
    const toIndex   = newOrder.indexOf(targetKey as any);
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedItem as any);
    setSectionOrder(newOrder);
    setDraggedItem(null);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const tid = toast.loading("Generating PDF…");
    try {
      const ok = await exportResumeToPDF(resumeData, "resume.pdf", templateId);
      if (ok) toast.success("PDF downloaded!", { id: tid });
      else     toast.error("Export failed — no resume found on page.", { id: tid });
    } catch {
      toast.error("Export failed. Please try again.", { id: tid });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAiClick = (e: React.MouseEvent, key: keyof ResumeData) => {
    e.stopPropagation();
    if (!isPro) {
      toast("✨ AI Rewrite is a Pro feature", {
        description: "Upgrade to Pro to rewrite any section with AI, optimized for your JD keywords.",
        action: {
          label: "Upgrade →",
          onClick: () => window.location.href = "/pro",
        },
        duration: 5000,
      });
      return;
    }
    onAiRewrite?.(key);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">🧾 Resume Sections</h2>
        {isPro && (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
            <Crown size={10} /> Pro
          </span>
        )}
      </div>

      {/* AI Rewrite legend */}
      <div className="mb-3 flex items-center gap-2 text-xs text-purple-300/70">
        <Sparkles size={11} className={isPro ? "text-purple-400" : "text-purple-400/40"} />
        <span>
          {isPro
            ? "Click ✨ on any section to rewrite with AI"
            : "Upgrade to Pro to unlock AI rewrite ✨"}
        </span>
      </div>

      {/* Section list */}
      <div className="space-y-2">
        {sectionOrder.map((key) => {
          const section = resumeData[key] as any;
          const Icon    = iconMap[key] || FileText;
          const isThisRewriting = aiRewriting === String(key);

          return (
            <div
              key={key}
              draggable
              onDragStart={() => handleDragStart(key as string)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(key as string)}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
                ${section?.visible
                  ? "bg-white/10 border-white/10"
                  : "bg-white/5 border-white/5 opacity-60"}
                hover:bg-white/20`}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                <Icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white font-medium capitalize">{key}</span>
                {isThisRewriting && (
                  <Loader2 size={12} className="animate-spin text-purple-300" />
                )}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                {/* AI Rewrite */}
                <button
                  onClick={(e) => handleAiClick(e, key)}
                  disabled={isThisRewriting}
                  title={isPro ? "Rewrite with AI" : "Pro feature — upgrade to use"}
                  className={`relative flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg transition
                    ${isPro
                      ? "text-purple-200 bg-purple-500/30 hover:bg-purple-500/50"
                      : "text-purple-400/50 bg-white/5 cursor-pointer"}`}
                >
                  <Sparkles size={11} />
                  {!isPro && (
                    <Crown size={9} className="text-amber-400 absolute -top-1 -right-1" />
                  )}
                </button>

                {/* Edit */}
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(key); }}
                  className="text-purple-300 hover:text-white"
                  title="Edit section"
                >
                  <Pencil size={14} />
                </button>

                {/* Toggle visibility */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSection(key); }}
                  className="text-gray-300 hover:text-white"
                  title={section?.visible ? "Hide section" : "Show section"}
                >
                  {section?.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Section */}
      <button
        onClick={onAddSection}
        className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-medium"
      >
        <Plus size={16} />
        Add Section
      </button>

      {/* Download PDF */}
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="mt-2 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 disabled:cursor-not-allowed transition text-white text-sm font-medium"
      >
        {isExporting ? (
          <><Loader2 size={16} className="animate-spin" /> Exporting…</>
        ) : (
          <><Download size={16} /> Download PDF</>
        )}
      </button>

      {/* Pro upsell in sidebar for free users */}
      {!isPro && (
        <button
          onClick={() => window.location.href = "/pro"}
          className="mt-3 w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30 transition text-amber-300 text-xs font-medium"
        >
          <Crown size={13} />
          Upgrade to Pro — ₹1 for 7 days
        </button>
      )}
    </div>
  );
}
