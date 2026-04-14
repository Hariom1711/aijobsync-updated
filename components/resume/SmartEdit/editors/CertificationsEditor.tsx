// CertificationsEditor.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

// Define the type for certification items
type Certification = {
  title: string;
  issuer: string;
  year: string;
};

export default function CertificationsEditor({
  value = [],
  onChange,
}: {
  value?: Certification[];  // Changed from Array<any>
  onChange: (v: Certification[]) => void;  // Changed from Array<any>
}) {
  const [local, setLocal] = React.useState<Certification[]>(value || []);  // Changed from any[]

  React.useEffect(() => setLocal(value || []), [value]);

  const add = () => {
    const next = [...local, { title: "", issuer: "", year: "" }];
    setLocal(next);
    onChange(next);
  };

  const update = (i: number, field: string, v: string) => {
    const next = [...local];
    next[i] = { ...(next[i] || {}), [field]: v };
    setLocal(next);
    onChange(next);
  };

  const remove = (i: number) => {
    const next = local.filter((_, idx) => idx !== i);
    setLocal(next);
    onChange(next);
  };


  return (
    <div className="space-y-3">
      {local.map((c, idx) => (
        <div key={idx} className="flex gap-2 p-3 border rounded-lg bg-gray-50">
          <div className="flex-1 space-y-2">
            <Input value={c.title} onChange={(e) => update(idx, "title", e.target.value)} placeholder="Certification Name" />
            <div className="grid grid-cols-2 gap-2">
              <Input value={c.issuer} onChange={(e) => update(idx, "issuer", e.target.value)} placeholder="Issuer" />
              <Input value={c.year} onChange={(e) => update(idx, "year", e.target.value)} placeholder="Year" />
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => remove(idx)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button variant="outline" className="w-full" onClick={add}>
        <Plus className="w-4 h-4 mr-2" /> Add Certification
      </Button>
    </div>
  );
}
