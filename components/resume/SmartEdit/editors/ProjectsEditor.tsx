// ProjectsEditor.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

// Define the type for project items
type Project = {
  name: string;
  technologies: string[];
  description: string;
  descriptionPoints: string[];
  link: string;
};

export default function ProjectsEditor({
  value = [],
  onChange,
}: {
  value?: Project[];  // Changed from Array<any>
  onChange: (v: Project[]) => void;  // Changed from Array<any>
}) {
  const [local, setLocal] = React.useState<Project[]>(value || []);  // Changed from any[]

  React.useEffect(() => setLocal(value || []), [value]);

  const addProject = () => {
    const next = [...local, { name: "", technologies: [], description: "", descriptionPoints: [], link: "" }];
    setLocal(next);
    onChange(next);
  };

  const updateField = (i: number, field: keyof Project, v: string | string[]) => {  // Changed from any
    const next = [...local];
    next[i] = { ...(next[i] || {}), [field]: v } as Project;
    setLocal(next);
    onChange(next);
  };

  const removeProject = (i: number) => {
    const next = local.filter((_, idx) => idx !== i);
    setLocal(next);
    onChange(next);
  };

  const addPoint = (i: number) => {
    const next = [...local];
    next[i].descriptionPoints = [...(next[i].descriptionPoints || []), ""];
    setLocal(next);
    onChange(next);
  };

  const updatePoint = (i: number, bi: number, v: string) => {
    const next = [...local];
    next[i].descriptionPoints[bi] = v;
    setLocal(next);
    onChange(next);
  };

  const removePoint = (i: number, bi: number) => {
    const next = [...local];
    next[i].descriptionPoints = next[i].descriptionPoints.filter((_, idx) => idx !== bi);  // Removed any
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {local.map((proj, idx) => (
        <div key={idx} className="p-3 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">Project #{idx + 1}</div>
            <Button variant="ghost" size="sm" onClick={() => removeProject(idx)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Input value={proj.name} onChange={(e) => updateField(idx, "name", e.target.value)} placeholder="Project Name" />
            <Input value={(proj.technologies || []).join(", ")} onChange={(e) => updateField(idx, "technologies", e.target.value.split(",").map((s: string) => s.trim()))} placeholder="Technologies (comma separated)" />
            <Input value={proj.link} onChange={(e) => updateField(idx, "link", e.target.value)} placeholder="Project Link (optional)" />
            <Textarea rows={2} value={proj.description} onChange={(e) => updateField(idx, "description", e.target.value)} placeholder="Short description" />

            <div>
              {(proj.descriptionPoints || []).map((p: string, bi: number) => (
                <div key={bi} className="flex gap-2 items-start mb-2">
                  <Textarea rows={2} value={p} onChange={(e) => updatePoint(idx, bi, e.target.value)} className="flex-1" />
                  <Button variant="ghost" size="sm" onClick={() => removePoint(idx, bi)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addPoint(idx)} className="w-full">
                <Plus className="w-3 h-3 mr-1" /> Add Detail
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" className="w-full" onClick={addProject}>
        <Plus className="w-4 h-4 mr-2" /> Add Project
      </Button>
    </div>
  );
}