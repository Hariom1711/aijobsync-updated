// components/resume/SmartEdit/SmartEditDialog.tsx
"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SummaryEditor from "./editors/SummaryEditor";
import SkillsEditor from "./editors/SkillsEditor";
import EducationEditor from "./editors/EducationEditor";
import ExperienceEditor from "./editors/ExperienceEditor";
import ProjectsEditor from "./editors/ProjectsEditor";
import ListEditor from "./editors/ListEditor";
import CertificationsEditor from "./editors/CertificationsEditor";
import JSONEditor from "./editors/JSONEditor";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

export default function SmartEditDialog({
  section, data, onSave, onClose,
}: {
  section: string | null | undefined;
  data: any;
  onSave: (v: any) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = React.useState<any>(data);
  React.useEffect(() => setLocal(data), [data]);

  const sectionLabel = section
    ? section.charAt(0).toUpperCase() + section.slice(1)
    : "";

  const renderEditor = () => {
    switch (section) {
      case "summary":        return <SummaryEditor value={local} onChange={setLocal} />;
      case "skills":         return <SkillsEditor value={local} onChange={setLocal} />;
      case "education":      return <EducationEditor value={local} onChange={setLocal} />;
      case "experience":     return <ExperienceEditor value={local} onChange={setLocal} />;
      case "projects":       return <ProjectsEditor value={local} onChange={setLocal} />;
      case "achievements":   return <ListEditor value={local} onChange={setLocal} label="Achievement" />;
      case "certifications": return <CertificationsEditor value={local} onChange={setLocal} />;
      default:               return <JSONEditor value={JSON.stringify(local, null, 2)} onChange={(v) => { try { setLocal(JSON.parse(v)); } catch { setLocal(v); }}} />;
    }
  };

  return (
    <Dialog open={!!section} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[88vh] overflow-hidden flex flex-col p-0 border-white/10"
        style={{
          background: "linear-gradient(135deg, rgba(15,10,40,0.97) 0%, rgba(30,10,60,0.97) 100%)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white">
              Edit{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {sectionLabel}
              </span>
            </DialogTitle>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-purple-300/70 mt-1">
            Changes are reflected live in your resume preview
          </p>
        </DialogHeader>

        {/* Scrollable editor content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-white/10">
          {renderEditor()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 shrink-0 flex gap-3">
          <Button
            onClick={() => onSave(local)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}