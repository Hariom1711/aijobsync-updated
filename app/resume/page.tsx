// app/resume/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles, FileText, Download, Plus, ArrowLeft,
  Calendar, Briefcase, Trash2, RefreshCcw, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Resume = {
  id: string;
  template: string;
  score: number | null;
  version: number;
  createdAt: string;
  jobDescription?: { jobTitle?: string; companyName?: string } | null;
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const card = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ResumeLibraryPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/resume/list")
      .then((r) => r.json())
      .then((d) => { if (d.resumes) setResumes(d.resumes); })
      .catch(() => toast.error("Failed to load resumes"))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async (id: string) => {
    toast.promise(
      fetch("/api/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: id }),
      }).then((r) => r.json()),
      {
        loading: "Preparing download…",
        success: "Resume ready — rendering PDF",
        error: "Export failed. Try again.",
      }
    );
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const scoreColor = (s: number | null) =>
    !s ? "text-gray-400" : s >= 80 ? "text-green-400" : s >= 60 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-16 w-[28rem] h-[28rem] bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* header */}
      <div className="relative z-10 border-b border-white/8 backdrop-blur-md bg-white/3 sticky top-0">
        <div className="mx-auto max-w-5xl px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-black text-lg">My Resumes</span>
            <span className="text-xs text-purple-300 bg-white/8 px-2.5 py-0.5 rounded-full border border-white/10">
              {resumes.length} saved
            </span>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            onClick={() => router.push("/resume/new")}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Resume
          </Button>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/8 animate-pulse" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <FileText className="h-14 w-14 text-purple-400 mx-auto mb-4 opacity-50" />
            <h2 className="text-white text-xl font-bold mb-2">No resumes yet</h2>
            <p className="text-purple-300 text-sm mb-6">Generate your first ATS-optimized resume in under a minute</p>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={() => router.push("/resume/new")}
            >
              <Plus className="h-4 w-4 mr-2" /> Generate First Resume
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {resumes.map((r) => (
                <motion.div key={r.id} variants={card} layout exit={{ opacity: 0, scale: 0.9 }}>
                  <Card className="border-white/10 bg-white/8 backdrop-blur-xl hover:bg-white/12 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                    <CardContent className="p-5">
                      {/* score badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 border border-white/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        {r.score != null && (
                          <div className={`flex items-center gap-1 text-sm font-bold ${scoreColor(r.score)}`}>
                            <BarChart3 className="h-4 w-4" />
                            {r.score}%
                          </div>
                        )}
                      </div>

                      <h3 className="text-white font-semibold text-sm leading-snug mb-0.5">
                        {r.jobDescription?.jobTitle ?? "Resume"}
                      </h3>
                      <p className="text-purple-300 text-xs mb-3">
                        {r.jobDescription?.companyName ?? ""}
                      </p>

                      <div className="flex items-center gap-3 text-purple-400 text-xs mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {fmt(r.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> v{r.version} · {r.template}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 text-xs"
                          onClick={() => router.push(`/templates?resumeId=${r.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/8 border-white/15 text-white hover:bg-white/15 text-xs"
                          onClick={() => handleExport(r.id)}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/8 border-white/15 text-white hover:bg-white/15 text-xs"
                          onClick={() => router.push(`/resume/new?regenerate=${r.id}`)}
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}
