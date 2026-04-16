// components/resume/SmartEdit/editors/JSONEditor.tsx
"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

export default function JSONEditor({
  value = "",
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  const [text, setText] = React.useState(value || "");
  const [error, setError] = React.useState("");

  React.useEffect(() => setText(value || ""), [value]);

  const handleChange = (v: string) => {
    setText(v);
    try {
      JSON.parse(v);
      setError("");
    } catch {
      setError("Invalid JSON — fix before saving");
    }
    onChange(v);
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          ⚠ {error}
        </div>
      )}
      <Textarea
        rows={16}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full font-mono text-xs bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none focus:ring-2 focus:ring-purple-500"
        spellCheck={false}
      />
      <p className="text-xs text-white/30">
        Advanced: edit raw JSON — be careful with field names and structure.
      </p>
    </div>
  );
}
