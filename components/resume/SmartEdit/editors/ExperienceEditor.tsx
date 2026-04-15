// // ExperienceEditor.tsx
// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";

// // Define the type for experience items
// type Experience = {
//   title: string;
//   company: string;
//   location: string;
//   startDate: string;
//   endDate: string;
//   description: string[];
// };

// export default function ExperienceEditor({
//   value = [],
//   onChange,
// }: {
//   value?: Experience[];  // Changed from Array<any>
//   onChange: (v: Experience[]) => void;  // Changed from Array<any>
// }) {
//   const [local, setLocal] = React.useState<Experience[]>(value || []);  // Changed from any[]

//   React.useEffect(() => setLocal(value || []), [value]);

//   const addExp = () => {
//     const next = [...local, { title: "", company: "", location: "", startDate: "", endDate: "", description: [] }];
//     setLocal(next);
//     onChange(next);
//   };

//   const updateField = (i: number, field: keyof Experience, v: string | string[]) => {  // Changed from any
//     const next = [...local];
//     next[i] = { ...(next[i] || {}), [field]: v } as Experience;
//     setLocal(next);
//     onChange(next);
//   };

//   const removeExp = (i: number) => {
//     const next = local.filter((_, idx) => idx !== i);
//     setLocal(next);
//     onChange(next);
//   };

//   const addBullet = (i: number) => {
//     const next = [...local];
//     next[i].description = [...(next[i].description || []), ""];
//     setLocal(next);
//     onChange(next);
//   };

//   const updateBullet = (i: number, bi: number, v: string) => {
//     const next = [...local];
//     next[i].description[bi] = v;
//     setLocal(next);
//     onChange(next);
//   };

//   const removeBullet = (i: number, bi: number) => {
//     const next = [...local];
//     next[i].description = next[i].description.filter((_, idx) => idx !== bi);  // Changed from any
//     setLocal(next);
//     onChange(next);
//   };

//   return (
//     <div className="space-y-4">
//       {local.map((exp, idx) => (
//         <div key={idx} className="p-3 border rounded-lg bg-gray-50">
//           <div className="flex justify-between items-center mb-2">
//             <div className="font-medium">Experience #{idx + 1}</div>
//             <Button variant="ghost" size="sm" onClick={() => removeExp(idx)}>
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           </div>

//           <div className="grid grid-cols-2 gap-2 mb-2">
//             <Input value={exp.title} onChange={(e) => updateField(idx, "title", e.target.value)} placeholder="Job Title" className="col-span-2" />
//             <Input value={exp.company} onChange={(e) => updateField(idx, "company", e.target.value)} placeholder="Company" />
//             <Input value={exp.location} onChange={(e) => updateField(idx, "location", e.target.value)} placeholder="Location" />
//             <Input value={exp.startDate} onChange={(e) => updateField(idx, "startDate", e.target.value)} placeholder="Start" />
//             <Input value={exp.endDate} onChange={(e) => updateField(idx, "endDate", e.target.value)} placeholder="End" />
//           </div>

//           <div className="space-y-2">
//             <div className="text-xs font-medium">Responsibilities</div>

//             {(exp.description || []).map((b: string, bi: number) => (
//               <div key={bi} className="flex gap-2 items-start">
//                 <Textarea rows={2} value={b} onChange={(e) => updateBullet(idx, bi, e.target.value)} className="flex-1" />
//                 <Button variant="ghost" size="sm" onClick={() => removeBullet(idx, bi)}>
//                   <Trash2 className="w-4 h-4" />
//                 </Button>
//               </div>
//             ))}

//             <Button variant="outline" size="sm" onClick={() => addBullet(idx)} className="w-full">
//               <Plus className="w-3 h-3 mr-1" /> Add Point
//             </Button>
//           </div>
//         </div>
//       ))}

//       <Button onClick={addExp} variant="outline" className="w-full">
//         <Plus className="w-4 h-4 mr-2" /> Add Experience
//       </Button>
//     </div>
//   );
// }

// components/resume/SmartEdit/editors/ExperienceEditor.tsx
"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";

type Experience = {
  role: string;
  company: string;
  location: string;
  duration: string;
  responsibilities: string[];
  skillsUsed?: string[];
};

export default function ExperienceEditor({
  value = [],
  onChange,
}: {
  value?: Experience[];
  onChange: (v: Experience[]) => void;
}) {
  const [local, setLocal] = React.useState<Experience[]>(
    (value || []).map((e: any) => ({
      role: e.role || e.title || "",
      company: e.company || "",
      location: e.location || "",
      duration: e.duration || (e.startDate && e.endDate ? `${e.startDate} – ${e.endDate}` : ""),
      responsibilities: e.responsibilities || e.description || [],
      skillsUsed: e.skillsUsed || [],
    }))
  );

  React.useEffect(() => {
    setLocal(
      (value || []).map((e: any) => ({
        role: e.role || e.title || "",
        company: e.company || "",
        location: e.location || "",
        duration: e.duration || (e.startDate && e.endDate ? `${e.startDate} – ${e.endDate}` : ""),
        responsibilities: e.responsibilities || e.description || [],
        skillsUsed: e.skillsUsed || [],
      }))
    );
  }, [value]);

  const emit = (next: Experience[]) => { setLocal(next); onChange(next); };

  const add = () => emit([...local, { role: "", company: "", location: "", duration: "", responsibilities: [] }]);
  const remove = (i: number) => emit(local.filter((_, idx) => idx !== i));
  const updateField = (i: number, field: keyof Experience, v: any) => {
    const next = [...local];
    next[i] = { ...next[i], [field]: v };
    emit(next);
  };
  const addBullet = (i: number) => {
    const next = [...local];
    next[i].responsibilities = [...(next[i].responsibilities || []), ""];
    emit(next);
  };
  const updateBullet = (i: number, bi: number, v: string) => {
    const next = [...local];
    next[i].responsibilities[bi] = v;
    emit(next);
  };
  const removeBullet = (i: number, bi: number) => {
    const next = [...local];
    next[i].responsibilities = next[i].responsibilities.filter((_, idx) => idx !== bi);
    emit(next);
  };

  return (
    <div className="space-y-4">
      {local.map((exp, idx) => (
        <div key={idx} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-purple-300">Experience #{idx + 1}</span>
            <Button
              variant="ghost" size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => remove(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              value={exp.role}
              onChange={(e) => updateField(idx, "role", e.target.value)}
              placeholder="Job Title / Role"
              className="col-span-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Input
              value={exp.company}
              onChange={(e) => updateField(idx, "company", e.target.value)}
              placeholder="Company"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Input
              value={exp.location}
              onChange={(e) => updateField(idx, "location", e.target.value)}
              placeholder="Location"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Input
              value={exp.duration}
              onChange={(e) => updateField(idx, "duration", e.target.value)}
              placeholder="Duration (e.g. Jan 2022 – Mar 2024)"
              className="col-span-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-purple-300">Responsibilities</p>
            {(exp?.responsibilities || [])?.map((b, bi) => (
              <div key={bi} className="flex gap-2 items-start">
                <Textarea
                  rows={2}
                  value={b}
                  onChange={(e) => updateBullet(idx, bi, e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
                />
                <Button
                  variant="ghost" size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-1"
                  onClick={() => removeBullet(idx, bi)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline" size="sm"
              className="w-full border-white/20 text-purple-300 hover:bg-white/10 hover:text-white"
              onClick={() => addBullet(idx)}
            >
              <Plus className="w-3 h-3 mr-1" /> Add Bullet
            </Button>
          </div>

          <div>
            <Input
              value={(exp.skillsUsed || []).join(", ")}
              onChange={(e) => updateField(idx, "skillsUsed", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="Skills used (comma-separated, optional)"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm"
            />
          </div>
        </div>
      ))}

      <Button
        onClick={add}
        variant="outline"
        className="w-full border-dashed border-white/30 text-purple-300 hover:bg-white/10 hover:text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Experience
      </Button>
    </div>
  );
}