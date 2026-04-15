// // ProjectsEditor.tsx
// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";

// // Define the type for project items
// type Project = {
//   name: string;
//   technologies: string[];
//   description: string;
//   descriptionPoints: string[];
//   link: string;
// };

// export default function ProjectsEditor({
//   value = [],
//   onChange,
// }: {
//   value?: Project[];  // Changed from Array<any>
//   onChange: (v: Project[]) => void;  // Changed from Array<any>
// }) {
//   const [local, setLocal] = React.useState<Project[]>(value || []);  // Changed from any[]

//   React.useEffect(() => setLocal(value || []), [value]);

//   const addProject = () => {
//     const next = [...local, { name: "", technologies: [], description: "", descriptionPoints: [], link: "" }];
//     setLocal(next);
//     onChange(next);
//   };

//   const updateField = (i: number, field: keyof Project, v: string | string[]) => {  // Changed from any
//     const next = [...local];
//     next[i] = { ...(next[i] || {}), [field]: v } as Project;
//     setLocal(next);
//     onChange(next);
//   };

//   const removeProject = (i: number) => {
//     const next = local.filter((_, idx) => idx !== i);
//     setLocal(next);
//     onChange(next);
//   };

//   const addPoint = (i: number) => {
//     const next = [...local];
//     next[i].descriptionPoints = [...(next[i].descriptionPoints || []), ""];
//     setLocal(next);
//     onChange(next);
//   };

//   const updatePoint = (i: number, bi: number, v: string) => {
//     const next = [...local];
//     next[i].descriptionPoints[bi] = v;
//     setLocal(next);
//     onChange(next);
//   };

//   const removePoint = (i: number, bi: number) => {
//     const next = [...local];
//     next[i].descriptionPoints = next[i].descriptionPoints.filter((_, idx) => idx !== bi);  // Removed any
//     setLocal(next);
//     onChange(next);
//   };

//   return (
//     <div className="space-y-4">
//       {local.map((proj, idx) => (
//         <div key={idx} className="p-3 border rounded-lg bg-gray-50">
//           <div className="flex justify-between items-center mb-2">
//             <div className="font-medium">Project #{idx + 1}</div>
//             <Button variant="ghost" size="sm" onClick={() => removeProject(idx)}>
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           </div>

//           <div className="space-y-2">
//             <Input value={proj.name} onChange={(e) => updateField(idx, "name", e.target.value)} placeholder="Project Name" />
//             <Input value={(proj.technologies || []).join(", ")} onChange={(e) => updateField(idx, "technologies", e.target.value.split(",").map((s: string) => s.trim()))} placeholder="Technologies (comma separated)" />
//             <Input value={proj.link} onChange={(e) => updateField(idx, "link", e.target.value)} placeholder="Project Link (optional)" />
//             <Textarea rows={2} value={proj.description} onChange={(e) => updateField(idx, "description", e.target.value)} placeholder="Short description" />

//             <div>
//               {(proj.descriptionPoints || []).map((p: string, bi: number) => (
//                 <div key={bi} className="flex gap-2 items-start mb-2">
//                   <Textarea rows={2} value={p} onChange={(e) => updatePoint(idx, bi, e.target.value)} className="flex-1" />
//                   <Button variant="ghost" size="sm" onClick={() => removePoint(idx, bi)}><Trash2 className="w-4 h-4" /></Button>
//                 </div>
//               ))}
//               <Button variant="outline" size="sm" onClick={() => addPoint(idx)} className="w-full">
//                 <Plus className="w-3 h-3 mr-1" /> Add Detail
//               </Button>
//             </div>
//           </div>
//         </div>
//       ))}

//       <Button variant="outline" className="w-full" onClick={addProject}>
//         <Plus className="w-4 h-4 mr-2" /> Add Project
//       </Button>
//     </div>
//   );
// }

"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Project = {
  title: string;
  role?: string;
  technologies: string[];
  description: string;
  impact?: string;
  highlights?: string[];
  github?: string;
  link?: string;
};

export default function ProjectsEditor({
  value = [],
  onChange,
}: {
  value?: Project[];
  onChange: (v: Project[]) => void;
}) {
  const [local, setLocal] = React.useState<Project[]>(
    (value || []).map((p: any) => ({
      title: p.title || p.name || "",
      role: p.role || "",
      technologies: p.technologies || [],
      description: p.description || "",
      impact: p.impact || "",
      highlights: p.highlights || [],
      github: p.github || "",
      link: p.link || "",
    }))
  );

  React.useEffect(() => {
    setLocal(
      (value || []).map((p: any) => ({
        title: p.title || p.name || "",
        role: p.role || "",
        technologies: p.technologies || [],
        description: p.description || "",
        impact: p.impact || "",
        highlights: p.highlights || [],
        github: p.github || "",
        link: p.link || "",
      }))
    );
  }, [value]);

  const emit = (next: Project[]) => { setLocal(next); onChange(next); };
  const add = () => emit([...local, { title: "", technologies: [], description: "" }]);
  const remove = (i: number) => emit(local.filter((_, idx) => idx !== i));
  const updateField = (i: number, field: keyof Project, v: any) => {
    const next = [...local]; next[i] = { ...next[i], [field]: v }; emit(next);
  };
  const addHighlight = (i: number) => {
    const next = [...local];
    next[i].highlights = [...(next[i].highlights || []), ""];
    emit(next);
  };
  const updateHighlight = (i: number, hi: number, v: string) => {
    const next = [...local]; (next[i].highlights as string[])[hi] = v; emit(next);
  };
  const removeHighlight = (i: number, hi: number) => {
    const next = [...local];
    next[i].highlights = (next[i].highlights || []).filter((_, idx) => idx !== hi);
    emit(next);
  };

  return (
    <div className="space-y-4">
      {local.map((proj, idx) => (
        <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-purple-300">Project #{idx + 1}</span>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => remove(idx)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input value={proj.title} onChange={(e) => updateField(idx, "title", e.target.value)} placeholder="Project Title" className="col-span-2 bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            <Input value={proj.role || ""} onChange={(e) => updateField(idx, "role", e.target.value)} placeholder="Your Role (optional)" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            <Input value={(proj.technologies || []).join(", ")} onChange={(e) => updateField(idx, "technologies", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="Technologies (comma-sep)" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            <Input value={proj.github || ""} onChange={(e) => updateField(idx, "github", e.target.value)} placeholder="GitHub URL (optional)" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            <Input value={proj.link || ""} onChange={(e) => updateField(idx, "link", e.target.value)} placeholder="Live URL (optional)" className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
            <Textarea rows={2} value={proj.description} onChange={(e) => updateField(idx, "description", e.target.value)} placeholder="Brief description" className="col-span-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm" />
            <Textarea rows={2} value={proj.impact || ""} onChange={(e) => updateField(idx, "impact", e.target.value)} placeholder="Impact / Results (optional)" className="col-span-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-purple-300">Key Highlights (optional)</p>
            {(proj.highlights || []).map((h, hi) => (
              <div key={hi} className="flex gap-2">
                <Input value={h} onChange={(e) => updateHighlight(idx, hi, e.target.value)} className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm" />
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => removeHighlight(idx, hi)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full border-white/20 text-purple-300 hover:bg-white/10" onClick={() => addHighlight(idx)}>
              <Plus className="w-3 h-3 mr-1" /> Add Highlight
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={add} variant="outline" className="w-full border-dashed border-white/30 text-purple-300 hover:bg-white/10 hover:text-white">
        <Plus className="w-4 h-4 mr-2" /> Add Project
      </Button>
    </div>
  );
}