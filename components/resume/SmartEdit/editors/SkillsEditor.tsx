// components/resume/SmartEdit/editors/SkillsEditor.tsx
"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const inputCls =
  "bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm";

export default function SkillsEditor({
  value = {},
  onChange,
}: {
  value?: Record<string, string[]>;
  onChange: (v: Record<string, string[]>) => void;
}) {
  const [local, setLocal] = React.useState<Record<string, string[]>>(value || {});
  React.useEffect(() => setLocal(value || {}), [value]);

  const emit = (next: Record<string, string[]>) => {
    setLocal(next);
    onChange(next);
  };

  const addCategory = () => {
    const newKey = prompt("New category name (e.g. 'languages')");
    if (!newKey || local[newKey]) return;
    emit({ ...local, [newKey]: [""] });
  };

  const renameCategory = (oldKey: string, newKey: string) => {
    if (!newKey || newKey === oldKey) return;
    const next: Record<string, string[]> = {};
    for (const k of Object.keys(local)) {
      next[k === oldKey ? newKey : k] = local[k];
    }
    emit(next);
  };

  const removeCategory = (cat: string) => {
    const next = { ...local };
    delete next[cat];
    emit(next);
  };

  const addSkill = (cat: string) => {
    emit({ ...local, [cat]: [...(local[cat] || []), ""] });
  };

  const updateSkill = (cat: string, idx: number, val: string) => {
    const next = { ...local, [cat]: [...local[cat]] };
    next[cat][idx] = val;
    emit(next);
  };

  const removeSkill = (cat: string, idx: number) => {
    emit({ ...local, [cat]: local[cat].filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      {Object.keys(local).length === 0 && (
        <p className="text-sm text-white/40 text-center py-4">
          No skill categories yet — add one below.
        </p>
      )}

      {Object.entries(local).map(([cat, skills]) => (
        <div
          key={cat}
          className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3"
        >
          {/* Category header row */}
          <div className="flex items-center gap-2">
            <Input
              value={cat}
              onChange={(e) =>
                renameCategory(cat, e.target.value.trim() || cat)
              }
              className={`flex-1 font-semibold capitalize ${inputCls}`}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-300 hover:bg-white/10"
              onClick={() => addSkill(cat)}
              title="Add skill"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => removeCategory(cat)}
              title="Remove category"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Skills list */}
          <div className="space-y-2">
            {skills.map((s, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={s}
                  onChange={(e) => updateSkill(cat, idx, e.target.value)}
                  placeholder="Skill name"
                  className={`flex-1 ${inputCls}`}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => removeSkill(cat, idx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addCategory}
        className="w-full border-dashed border-white/30 text-purple-300 hover:bg-white/10 hover:text-white"
      >
        <Plus className="w-4 h-4 mr-2" /> Add Category
      </Button>
    </div>
  );
}
