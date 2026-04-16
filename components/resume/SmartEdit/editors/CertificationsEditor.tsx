// components/resume/SmartEdit/editors/CertificationsEditor.tsx
"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Certification = {
  title: string;
  issuer: string;
  year: string;
};

const inputCls =
  "bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm";

export default function CertificationsEditor({
  value = [],
  onChange,
}: {
  value?: Certification[];
  onChange: (v: Certification[]) => void;
}) {
  const [local, setLocal] = React.useState<Certification[]>(value || []);
  React.useEffect(() => setLocal(value || []), [value]);

  const emit = (next: Certification[]) => {
    setLocal(next);
    onChange(next);
  };

  const add = () =>
    emit([...local, { title: "", issuer: "", year: "" }]);

  const remove = (i: number) =>
    emit(local.filter((_, idx) => idx !== i));

  const update = (i: number, field: keyof Certification, v: string) => {
    const next = [...local];
    next[i] = { ...next[i], [field]: v };
    emit(next);
  };

  return (
    <div className="space-y-3">
      {local.map((c, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-purple-300">
              Certification #{idx + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => remove(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Input
            value={c.title}
            onChange={(e) => update(idx, "title", e.target.value)}
            placeholder="Certification Name"
            className={`w-full ${inputCls}`}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={c.issuer}
              onChange={(e) => update(idx, "issuer", e.target.value)}
              placeholder="Issuer (e.g. Google, AWS)"
              className={inputCls}
            />
            <Input
              value={c.year}
              onChange={(e) => update(idx, "year", e.target.value)}
              placeholder="Year (e.g. 2023)"
              className={inputCls}
            />
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={add}
        className="w-full border-dashed border-white/30 text-purple-300 hover:bg-white/10 hover:text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Certification
      </Button>
    </div>
  );
}
