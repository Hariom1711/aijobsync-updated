

/* eslint-disable @typescript-eslint/no-explicit-any */

// Sidebar.tsx
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import SectionToggles from "@/components/resume/SectionToggles";
// import { ResumeData } from "@/types/resume";
// import { Download, Loader2 } from "lucide-react";
// import { exportResumeToPDF } from "@/utils/exportResumePDF";

// export default function Sidebar({
//   resumeData,
//   toggleSection,
//   onEdit,
//   onAddSection,
//   sectionOrder,
//   setSectionOrder,
// }: {
//   resumeData: ResumeData;
//   toggleSection: (k: keyof ResumeData) => void;
//   onEdit: (k: keyof ResumeData) => void;
//   onAddSection: () => void;
//   sectionOrder: (keyof ResumeData)[];
//   setSectionOrder: React.Dispatch<React.SetStateAction<(keyof ResumeData)[]>>;
// }) {
//   const [isExporting, setIsExporting] = React.useState(false);

//   const handleExportPDF = async () => {
//     setIsExporting(true);
    
//     try {
//       const success = await exportResumeToPDF('my-resume.pdf');
      
//       if (success) {
//         // Optional: Show success message
//         console.log('PDF exported successfully!');
//       } else {
//         // Optional: Show error message
//         alert('Failed to export PDF. Please try again.');
//       }
//     } catch (error) {
//       console.error('Export error:', error);
//       alert('Failed to export PDF. Please try again.');
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <Card className="border-white/10 bg-white/10 backdrop-blur-xl lg:col-span-1 h-fit sticky top-6">
//       <CardContent className="p-5 space-y-4">
//         <h2 className="text-white text-lg font-bold mb-2">Customize Resume</h2>
        
//         <SectionToggles 
//           resumeData={resumeData} 
//           toggleSection={toggleSection} 
//           onEdit={onEdit} 
//           onAddSection={onAddSection} 
//           sectionOrder={sectionOrder} 
//           setSectionOrder={setSectionOrder} 
//         />
        
//         <Button 
//           className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
//           onClick={handleExportPDF}
//           disabled={isExporting}
//         >
//           {isExporting ? (
//             <>
//               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//               Exporting...
//             </>
//           ) : (
//             <>
//               <Download className="w-4 h-4 mr-2" />
//               Export PDF
//             </>
//           )}
//         </Button>
//       </CardContent>
//     </Card>
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
} from "lucide-react";

interface SidebarProps {
  resumeData: ResumeData;
  toggleSection: (key: keyof ResumeData) => void;
  onEdit: (key: keyof ResumeData) => void;
  onAddSection: () => void;
  sectionOrder: (keyof ResumeData)[];
  setSectionOrder: React.Dispatch<
    React.SetStateAction<(keyof ResumeData)[]>
  >;
}

// icon mapping
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
}: SidebarProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (key: string) => {
    setDraggedItem(key);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetKey: string) => {
    if (!draggedItem || draggedItem === targetKey) return;

    const newOrder = [...sectionOrder];
    const fromIndex = newOrder.indexOf(draggedItem as any);
    const toIndex = newOrder.indexOf(targetKey as any);

    // remove dragged item
    newOrder.splice(fromIndex, 1);
    // insert at new position
    newOrder.splice(toIndex, 0, draggedItem as any);

    setSectionOrder(newOrder);
    setDraggedItem(null);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 h-fit">
      {/* Header */}
      <h2 className="text-white text-lg font-semibold mb-4">
        🧾 Resume Sections
      </h2>

      {/* Sections */}
      <div className="space-y-2">
        {sectionOrder.map((key) => {
          const section = resumeData[key] as any;
          const Icon = iconMap[key] || FileText;

          return (
            <div
              key={key}
              draggable
              onDragStart={() => handleDragStart(key as string)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(key as string)}
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer
              ${
                section?.visible
                  ? "bg-white/10 border-white/10"
                  : "bg-white/5 border-white/5 opacity-60"
              }
              hover:bg-white/20`}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                <Icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white font-medium capitalize">
                  {key}
                </span>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                {/* Edit */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(key);
                  }}
                  className="text-purple-300 hover:text-white"
                >
                  <Pencil size={14} />
                </button>

                {/* Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(key);
                  }}
                  className="text-gray-300 hover:text-white"
                >
                  {section?.visible ? (
                    <Eye size={14} />
                  ) : (
                    <EyeOff size={14} />
                  )}
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
    </div>
  );
}