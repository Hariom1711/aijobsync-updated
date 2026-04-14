// SummaryEditor.tsx
import React from "react";
import { Textarea } from "@/components/ui/textarea";

export default function SummaryEditor({
  value = "",
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Textarea
        rows={6}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        placeholder="Write a compelling professional summary..."
      />
    </div>
  );
}
