// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";

// // Define the type for education items
// type Education = {
//   degree: string;
//   field: string;
//   institution: string;
//   location: string;
//   startDate: string;
//   endDate: string;
//   grade: string;
// };

// export default function EducationEditor({
//   value = [],
//   onChange,
// }: {
//   value?: Education[];  // Changed from Array<any>
//   onChange: (v: Education[]) => void;  // Changed from Array<any>
// }) {
//   const [local, setLocal] = React.useState<Education[]>(value || []);  // Changed from any[]

//   React.useEffect(() => setLocal(value || []), [value]);

//   const addEducation = () => {
//     const next = [
//       ...local,
//       { degree: "", field: "", institution: "", location: "", startDate: "", endDate: "", grade: "" },
//     ];
//     setLocal(next);
//     onChange(next);
//   };

//   const update = (i: number, field: keyof Education, v: string) => {  // Added keyof Education for type safety
//     const next = [...local];
//     next[i] = { ...(next[i] || {}), [field]: v };
//     setLocal(next);
//     onChange(next);
//   };

//   const remove = (i: number) => {
//     const next = local.filter((_, idx) => idx !== i);
//     setLocal(next);
//     onChange(next);
//   };

//   return (
//     <div className="space-y-4">
//       {local.map((edu, idx) => (
//         <div key={idx} className="p-3 border rounded-lg bg-gray-50 space-y-2">
//           <div className="flex justify-between items-center">
//             <div className="text-sm font-medium">Education #{idx + 1}</div>
//             <Button variant="ghost" size="sm" onClick={() => remove(idx)}>
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <Input value={edu.degree} onChange={(e) => update(idx, "degree", e.target.value)} placeholder="Degree" />
//             <Input value={edu.field} onChange={(e) => update(idx, "field", e.target.value)} placeholder="Field" />
//             <Input value={edu.institution} onChange={(e) => update(idx, "institution", e.target.value)} placeholder="Institution" className="col-span-2" />
//             <Input value={edu.location} onChange={(e) => update(idx, "location", e.target.value)} placeholder="Location" className="col-span-2" />
//             <Input value={edu.startDate} onChange={(e) => update(idx, "startDate", e.target.value)} placeholder="Start" />
//             <Input value={edu.endDate} onChange={(e) => update(idx, "endDate", e.target.value)} placeholder="End" />
//             <Input value={edu.grade} onChange={(e) => update(idx, "grade", e.target.value)} placeholder="Grade/CGPA" className="col-span-2" />
//           </div>
//         </div>
//       ))}

//       <Button onClick={addEducation} variant="outline" className="w-full">
//         <Plus className="w-4 h-4 mr-2" /> Add Education
//       </Button>
//     </div>
//   );
// }


"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Education = {
  degree: string; field: string; institution: string;
  location: string; startDate: string; endDate: string; grade?: string;
};

export default function EducationEditor({ value = [], onChange }: { value?: Education[]; onChange: (v: Education[]) => void }) {
  const [local, setLocal] = React.useState<Education[]>(value || []);
  React.useEffect(() => setLocal(value || []), [value]);

  const emit = (next: Education[]) => { setLocal(next); onChange(next); };
  const add = () => emit([...local, { degree: "", field: "", institution: "", location: "", startDate: "", endDate: "" }]);
  const remove = (i: number) => emit(local.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Education, v: string) => {
    const next = [...local]; next[i] = { ...next[i], [field]: v }; emit(next);
  };

  const inputCls = "bg-white/10 border-white/20 text-white placeholder:text-white/40";

  return (
    <div className="space-y-4">
      {local.map((edu, idx) => (
        <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-purple-300">Education #{idx + 1}</span>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => remove(idx)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input value={edu.degree} onChange={(e) => update(idx, "degree", e.target.value)} placeholder="Degree (e.g. B.Tech)" className={inputCls} />
            <Input value={edu.field} onChange={(e) => update(idx, "field", e.target.value)} placeholder="Field of Study" className={inputCls} />
            <Input value={edu.institution} onChange={(e) => update(idx, "institution", e.target.value)} placeholder="Institution Name" className={`col-span-2 ${inputCls}`} />
            <Input value={edu.location} onChange={(e) => update(idx, "location", e.target.value)} placeholder="City, Country" className={`col-span-2 ${inputCls}`} />
            <Input value={edu.startDate} onChange={(e) => update(idx, "startDate", e.target.value)} placeholder="Start (e.g. Aug 2020)" className={inputCls} />
            <Input value={edu.endDate} onChange={(e) => update(idx, "endDate", e.target.value)} placeholder="End (e.g. May 2024)" className={inputCls} />
            <Input value={edu.grade || ""} onChange={(e) => update(idx, "grade", e.target.value)} placeholder="GPA / Grade (optional)" className={`col-span-2 ${inputCls}`} />
          </div>
        </div>
      ))}
      <Button onClick={add} variant="outline" className="w-full border-dashed border-white/30 text-purple-300 hover:bg-white/10 hover:text-white">
        <Plus className="w-4 h-4 mr-2" /> Add Education
      </Button>
    </div>
  );
}