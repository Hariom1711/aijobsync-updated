// SmartEditDialog.tsx (wrapper)
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SummaryEditor from "../SmartEdit/editors/SummaryEditor";
import SkillsEditor from "../SmartEdit/editors/SkillsEditor";
import EducationEditor from "../SmartEdit/editors/EducationEditor"; 
import ExperienceEditor from "./editors/ExperienceEditor";

import ListEditor from "./editors/ListEditor";
import ProjectsEditor from "./editors/ProjectsEditor";
import JSONEditor from "./editors/JSONEditor";
import CertificationsEditor from "./editors/CertificationsEditor";

import { Button } from "@/components/ui/button";
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function SmartEditDialog({
  section,
  data,
  onSave,
  onClose,
}: {
  section: string | null | undefined;
  data: any;
  onSave: (v: any) => void;
  /* eslint-disable @typescript-eslint/no-explicit-any */

  onClose: () => void;
}) {
  const [local, setLocal] = React.useState<any>(data);
  /* eslint-disable @typescript-eslint/no-explicit-any */


  React.useEffect(() => setLocal(data), [data]);

  const renderEditor = () => {
    switch (section) {
      case "summary": return <SummaryEditor value={local} onChange={setLocal} />;
      case "skills": return <SkillsEditor value={local} onChange={setLocal} />;
      case "education": return <EducationEditor value={local} onChange={setLocal} />;
      case "experience": return <ExperienceEditor value={local} onChange={setLocal} />;
      case "projects": return <ProjectsEditor value={local} onChange={setLocal} />;
      case "achievements": return <ListEditor value={local} onChange={setLocal} label="Achievement" />;
      case "certifications": return <CertificationsEditor value={local} onChange={setLocal} />;
      default: return <JSONEditor value={JSON.stringify(local, null, 2)} onChange={(v) => { try { setLocal(JSON.parse(v)); } catch { setLocal(v); }}} />;
    }
  };

  return (
    <Dialog open={!!section} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold capitalize">Edit {String(section ?? "")}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {renderEditor()}
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md pt-4 -mx-6 px-6 pb-6 border-t">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Button onClick={() => onSave(local)} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">Save Changes</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
