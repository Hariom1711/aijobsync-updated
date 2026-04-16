// components/resume/SmartEdit/editors/SummaryEditor.tsx
"use client";
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
    <div className="space-y-2">
      <p className="text-xs font-medium text-purple-300">
        Professional Summary
      </p>
      <Textarea
        rows={7}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a compelling professional summary that highlights your key strengths and career goals..."
        className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm resize-none focus:ring-2 focus:ring-purple-500"
      />
      <p className="text-xs text-white/30 text-right">
        {(value || "").length} characters
      </p>
    </div>
  );
}
