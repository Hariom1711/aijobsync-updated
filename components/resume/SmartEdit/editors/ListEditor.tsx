// components/resume/SmartEdit/editors/ListEditor.tsx
"use client";
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

  const emit = (next: string[]) => {
    setLocal(next);
    onChange(next);
  };

  const add = () => emit([...local, ""]);
  const remove = (i: number) => emit(local.filter((_, idx) => idx !== i));
  const update = (i: number, v: string) => {
    const next = [...local];
    next[i] = v;
    emit(next);
  };

  return (
    <div className="space-y-3">
      {local.length === 0 && (
        <p className="text-sm text-white/40 text-center py-2">
          No {label.toLowerCase()}s yet — add one below.
        </p>
      )}

      {local.map((it, idx) => (
        <div key={idx} className="flex gap-2 items-start">
          <Textarea
            rows={2}
            value={it}
            onChange={(e) => update(idx, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}...`}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm resize-none"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-1"
            onClick={() => remove(idx)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={add}
        className="w-full border-dashed border-white/30 text-purple-300 hover:bg-white/10 hover:text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Add {label}
      </Button>
    </div>
  );
}
