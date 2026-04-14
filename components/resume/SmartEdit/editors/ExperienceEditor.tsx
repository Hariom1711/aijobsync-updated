// ExperienceEditor.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

// Define the type for experience items
type Experience = {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
};

export default function ExperienceEditor({
  value = [],
  onChange,
}: {
  value?: Experience[];  // Changed from Array<any>
  onChange: (v: Experience[]) => void;  // Changed from Array<any>
}) {
  const [local, setLocal] = React.useState<Experience[]>(value || []);  // Changed from any[]

  React.useEffect(() => setLocal(value || []), [value]);

  const addExp = () => {
    const next = [...local, { title: "", company: "", location: "", startDate: "", endDate: "", description: [] }];
    setLocal(next);
    onChange(next);
  };

  const updateField = (i: number, field: keyof Experience, v: string | string[]) => {  // Changed from any
    const next = [...local];
    next[i] = { ...(next[i] || {}), [field]: v } as Experience;
    setLocal(next);
    onChange(next);
  };

  const removeExp = (i: number) => {
    const next = local.filter((_, idx) => idx !== i);
    setLocal(next);
    onChange(next);
  };

  const addBullet = (i: number) => {
    const next = [...local];
    next[i].description = [...(next[i].description || []), ""];
    setLocal(next);
    onChange(next);
  };

  const updateBullet = (i: number, bi: number, v: string) => {
    const next = [...local];
    next[i].description[bi] = v;
    setLocal(next);
    onChange(next);
  };

  const removeBullet = (i: number, bi: number) => {
    const next = [...local];
    next[i].description = next[i].description.filter((_, idx) => idx !== bi);  // Changed from any
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {local.map((exp, idx) => (
        <div key={idx} className="p-3 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <div className="font-medium">Experience #{idx + 1}</div>
            <Button variant="ghost" size="sm" onClick={() => removeExp(idx)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input value={exp.title} onChange={(e) => updateField(idx, "title", e.target.value)} placeholder="Job Title" className="col-span-2" />
            <Input value={exp.company} onChange={(e) => updateField(idx, "company", e.target.value)} placeholder="Company" />
            <Input value={exp.location} onChange={(e) => updateField(idx, "location", e.target.value)} placeholder="Location" />
            <Input value={exp.startDate} onChange={(e) => updateField(idx, "startDate", e.target.value)} placeholder="Start" />
            <Input value={exp.endDate} onChange={(e) => updateField(idx, "endDate", e.target.value)} placeholder="End" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium">Responsibilities</div>

            {(exp.description || []).map((b: string, bi: number) => (
              <div key={bi} className="flex gap-2 items-start">
                <Textarea rows={2} value={b} onChange={(e) => updateBullet(idx, bi, e.target.value)} className="flex-1" />
                <Button variant="ghost" size="sm" onClick={() => removeBullet(idx, bi)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={() => addBullet(idx)} className="w-full">
              <Plus className="w-3 h-3 mr-1" /> Add Point
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={addExp} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Experience
      </Button>
    </div>
  );
}