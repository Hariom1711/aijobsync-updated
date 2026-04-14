// ListEditor.tsx
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function ListEditor({
  value = [],
  onChange,
  label = "Item",
}: {
  value?: string[];
  onChange: (v: string[]) => void;
  label?: string;
}) {
  const [local, setLocal] = React.useState<string[]>(value || []);

  React.useEffect(() => setLocal(value || []), [value]);

  const add = () => {
    const next = [...local, ""];
    setLocal(next);
    onChange(next);
  };

  const update = (i: number, v: string) => {
    const next = [...local];
    next[i] = v;
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
      {local.map((it, idx) => (
        <div key={idx} className="flex gap-2">
          <Textarea rows={2} value={it} onChange={(e) => update(idx, e.target.value)} className="flex-1" placeholder={`Enter ${label.toLowerCase()}...`} />
          <Button variant="ghost" size="sm" onClick={() => remove(idx)}><Trash2 className="w-4 h-4" /></Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={add}><Plus className="w-4 h-4 mr-2" /> Add {label}</Button>
        <Button className="flex-1" onClick={() => onChange(local)}>Save</Button>
      </div>
    </div>
  );
}
