// JSONEditor.tsx
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
      setError("Invalid JSON");
    }
    onChange(v);
  };

  return (
    <div className="space-y-2">
      {error && <div className="text-xs text-red-600">{error}</div>}
      <Textarea rows={14} value={text} onChange={(e) => handleChange(e.target.value)} className="font-mono text-xs" />
    </div>
  );
}
