// SkillsEditor.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function SkillsEditor({
  value = {},
  onChange,
}: {
  value?: Record<string, string[]>;
  onChange: (v: Record<string, string[]>) => void;
}) {
  const [local, setLocal] = React.useState<Record<string, string[]>>(value || {});

  React.useEffect(() => setLocal(value || {}), [value]);

  const addCategory = (key: string) => {
    const next = { ...local, [key]: [...(local[key] || []), ""] };
    setLocal(next);
    onChange(next);
  };

  const addCategoryGroup = () => {
    const newKey = prompt("New category name (e.g. 'other')") || "new";
    if (newKey && !local[newKey]) {
      const next = { ...local, [newKey]: [""] };
      setLocal(next);
      onChange(next);
    }
  };

  const updateCategoryName = (oldKey: string, newKey: string) => {
    if (!newKey) return;
    const next = { ...local };
    next[newKey] = next[oldKey];
    delete next[oldKey];
    setLocal(next);
    onChange(next);
  };

  const updateSkill = (cat: string, idx: number, val: string) => {
    const next = { ...local };
    next[cat] = [...(next[cat] || [])];
    next[cat][idx] = val;
    setLocal(next);
    onChange(next);
  };

  const addSkill = (cat: string) => {
    const next = { ...local };
    next[cat] = [...(next[cat] || []), ""];
    setLocal(next);
    onChange(next);
  };

  const removeSkill = (cat: string, idx: number) => {
    const next = { ...local };
    next[cat] = (next[cat] || []).filter((_, i) => i !== idx);
    setLocal(next);
    onChange(next);
  };

  const removeCategory = (cat: string) => {
    const next = { ...local };
    delete next[cat];
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {Object.keys(local).length === 0 && (
        <div className="text-sm text-gray-600">No categories yet — add one.</div>
      )}

      {Object.entries(local).map(([cat, skills]) => (
        <div key={cat} className="p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-2 gap-2">
            <Input
              value={cat}
              onChange={(e) => updateCategoryName(cat, e.target.value.trim() || cat)}
              className="text-sm font-medium"
            />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => addSkill(cat)}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => removeCategory(cat)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {skills.map((s, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={s}
                  onChange={(e) => updateSkill(cat, idx, e.target.value)}
                  placeholder="Skill"
                  className="flex-1 text-sm"
                />
                <Button variant="ghost" size="sm" onClick={() => removeSkill(cat, idx)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <Button variant="outline" onClick={addCategoryGroup} className="flex-1">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
        <Button onClick={() => onChange(local)} className="flex-1">
          Save
        </Button>
      </div>
    </div>
  );
}
