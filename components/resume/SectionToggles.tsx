// "use client";

// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { ResumeData } from "../resume-templates/TemplateModern";

// interface SectionTogglesProps {
//   resumeData: ResumeData;
//   toggleSection: (key: keyof ResumeData) => void;
// }

// export default function SectionToggles({
//   resumeData,
//   toggleSection,
// }: SectionTogglesProps) {
//   const sections = Object.keys(resumeData).filter(
//     (key) => key !== "personal"
//   ) as (keyof ResumeData)[];

//   return (
//     <div className="space-y-3">
//       {sections.map((key) => (
//         <div
//           key={key}
//           className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition"
//         >
//           <Label className="capitalize text-white">{key}</Label>
//           <Switch
//             checked={(resumeData[key] as any).visible}
//             onCheckedChange={() => toggleSection(key)}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit2, Sparkles, Plus } from "lucide-react";
import { Reorder } from "framer-motion";
import { useState } from "react";
import { ResumeData } from "@/types/resume";

interface SectionTogglesProps {
  resumeData: ResumeData;
  toggleSection: (key: keyof ResumeData) => void;
  onEdit: (key: keyof ResumeData) => void;
  onAddSection: () => void;
  sectionOrder: (keyof ResumeData)[];
  setSectionOrder: React.Dispatch<React.SetStateAction<(keyof ResumeData)[]>>;
}

export default function SectionToggles({
  resumeData,
  toggleSection,
  onEdit,
  onAddSection,
  sectionOrder,
  setSectionOrder,
}: SectionTogglesProps) {
  const visibleSections = Object.keys(resumeData).filter(
    (key) => key !== "personal"
  ) as (keyof ResumeData)[];

  return (
    <div className="space-y-3">
      <Reorder.Group
        axis="y"
        values={sectionOrder}
        onReorder={setSectionOrder}
        className="space-y-3"
      >
        {sectionOrder.map((key) => (
          <Reorder.Item
            key={key}
            value={key}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="text-white/60 h-4 w-4 cursor-grab" />
              <Label className="capitalize text-white">{key}</Label>
            </div>

            <div className="flex items-center gap-2">
              {(resumeData[key] as any).visible && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-purple-400 hover:text-purple-300"
                    onClick={() => onEdit(key)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-pink-400 hover:text-pink-300"
                    onClick={() => alert(`AI enhancement for ${key} coming soon!`)}
                  >
                    <Sparkles size={16} />
                  </Button>
                </>
              )}
              <Switch
                checked={(resumeData[key] as any).visible}
                onCheckedChange={() => toggleSection(key)}
              />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Button
        variant="secondary"
        size="sm"
        className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white"
        onClick={onAddSection}
      >
        <Plus size={14} className="mr-2" /> Add Section
      </Button>
    </div>
  );
}
