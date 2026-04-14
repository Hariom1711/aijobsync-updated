// app/resume/new/page.tsx
"use client";

import React, { JSX, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload, FileText, Sparkles, Target, TrendingUp, AlertCircle,
  CheckCircle2, XCircle, Clock, Zap, Award, BookOpen, Lightbulb,
  ArrowRight, BarChart3, Star, ChevronDown, ChevronUp, Crown,
  Rocket, ArrowLeft,
} from "lucide-react";
import type {
  AnalyzeJDResponse, MatchProfileResponse, ProfileMatchResult,
  JobDescriptionAnalysis, MatchSummary, ScoreBreakdown, ScoreComponent, APIError,
} from "@/types/resume";

type Step = "upload" | "analyzing" | "matching" | "results";

// ── score helpers ─────────────────────────────────────────────────────────────
const scoreColor = (s: number) =>
  s >= 80 ? "text-green-400" : s >= 60 ? "text-yellow-400" : s >= 40 ? "text-orange-400" : "text-red-400";
const scoreBg = (s: number) =>
  s >= 80 ? "from-green-500/20 to-emerald-500/20" : s >= 60 ? "from-yellow-500/20 to-orange-500/20"
  : s >= 40 ? "from-orange-500/20 to-red-500/20" : "from-red-500/20 to-pink-500/20";
const verdictIcon = (v?: MatchSummary["verdict"]) => {
  if (v === "excellent") return <CheckCircle2 className="h-6 w-6 text-green-400" />;
  if (v === "strong_match") return <Target className="h-6 w-6 text-yellow-400" />;
  if (v === "moderate_match") return <Target className="h-6 w-6 text-orange-400" />;
  return <AlertCircle className="h-6 w-6 text-red-400" />;
};

// ── animated step indicator ────────────────────────────────────────────────────
function StepIndicator({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "upload", label: "Paste JD" },
    { key: "analyzing", label: "Analyzing" },
    { key: "matching", label: "Matching" },
    { key: "results", label: "Results" },
  ];
  const idx = steps.findIndex((s) => s.key === step);
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {steps.map((s, i) => (
        <React.Fragment key={s.key}>
          <div className={`flex items-center gap-1.5 text-xs font-medium transition-all ${i <= idx ? "text-white" : "text-purple-400"}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < idx ? "bg-green-500 text-white" : i === idx ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white ring-2 ring-purple-400/50" : "bg-white/10 text-purple-400"}`}>
              {i < idx ? "✓" : i + 1}
            </div>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 rounded-full transition-all ${i < idx ? "bg-green-500" : "bg-white/10"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── processing overlay ────────────────────────────────────────────────────────
function ProcessingStep({ step }: { step: Step }) {
  const config = {
    analyzing: { icon: <Sparkles className="h-8 w-8 text-purple-300 animate-spin" />, title: "Analyzing Job Description", subtitle: "Groq AI is extracting skills, requirements & ATS keywords…" },
    matching: { icon: <Target className="h-8 w-8 text-pink-300 animate-pulse" />, title: "Matching Your Profile", subtitle: "Comparing your experience against JD requirements…" },
  }[step as "analyzing" | "matching"];

  if (!config) return null;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center mx-auto mb-6">
        {config.icon}
      </div>
      <h2 className="text-white text-xl font-bold mb-2">{config.title}</h2>
      <p className="text-purple-300 text-sm">{config.subtitle}</p>
      <div className="mt-6 flex gap-1.5 justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} className="w-2 h-2 bg-purple-400 rounded-full"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>
    </motion.div>
  );
}

// ── score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ label, score, weight }: ScoreComponent & { label: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-purple-200 mb-1">
        <span>{label}</span>
        <span className={scoreColor(score)}>{score}/100 · {weight}% weight</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${scoreBg(score)}`}
          style={{ background: score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444" }}
        />
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function JDAnalyzerPage(): JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [jdText, setJdText] = useState("");
  const [jdId, setJdId] = useState("");
  const [matchResult, setMatchResult] = useState<ProfileMatchResult | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({ breakdown: true, missing: true, suggestions: true });
  const [isGenerating, setIsGenerating] = useState(false);
  const [matchId,setMatchId] = useState("");

  const toggle = (k: keyof typeof expanded) => setExpanded((p) => ({ ...p, [k]: !p[k] }));

  const matchWithProfile = useCallback(async (id: string) => {
    setStep("matching");
    try {
      const res = await fetch("/api/resume/match-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd_id: id }),
      });
      const data: MatchProfileResponse | APIError = await res.json();
      if ("success" in data && data.success) {
        setMatchId(data.match_id);
        setMatchResult((data as MatchProfileResponse).match_result);
        setStep("results");
      } else {
        setError((data as APIError).error ?? "Matching failed");
        setStep("upload");
        toast.error("Profile matching failed. Check your profile.");
      }
    } catch {
      setError("Network error during matching");
      setStep("upload");
      toast.error("Network error. Please try again.");
    }
  }, []);
console.log("matchResult:", matchResult);
  const analyzeJD = async () => {
    if (!jdText.trim()) { setError("Paste a job description first."); return; }
    setError("");
    setStep("analyzing");

    try {
      const res = await fetch("/api/jd/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd_text: jdText }),
      });
      const data: AnalyzeJDResponse | APIError = await res.json();

      if ("success" in data && data.success) {
        const d = data as AnalyzeJDResponse;
        const id = d.jd_id ?? d.analysis.jd_id;
        setJdId(id);
        toast.success("JD analyzed! Matching your profile…");
        setTimeout(() => matchWithProfile(id), 800);
      } else {
        setError((data as APIError).error ?? "Analysis failed");
        setStep("upload");
        toast.error("Analysis failed. Try a more complete JD.");
      }
    } catch {
      setError("Network error. Please try again.");
      setStep("upload");
      toast.error("Network error. Please try again.");
    }
  };

  const generateResume = async () => {
    if (!matchResult || !jdId) return;
    setIsGenerating(true);
    console.log( "matchId:", matchResult.match_id);
    toast.promise(
      fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd_id: jdId,   match_id: matchId // 👈 using the state variable
}),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) router.push(`/templates?resumeId=${d.resume_id}`);
          else throw new Error(d.error);
        })
        .finally(() => setIsGenerating(false)),
      { loading: "Generating your tailored resume…", success: "Resume ready! Redirecting…", error: "Generation failed." }
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-16 w-[28rem] h-[28rem] bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] bg-pink-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* navbar */}
      <div className="relative z-10 border-b border-white/8 backdrop-blur-md bg-white/3 sticky top-0">
        <div className="mx-auto max-w-4xl px-5 py-3.5 flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-black text-lg">New Resume</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-5 py-8">
        <StepIndicator step={step} />

        <AnimatePresence mode="wait">
          {/* ── upload step ── */}
          {step === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-black text-white mb-2">Paste Your Job Description</h1>
                  <p className="text-purple-300 text-sm">Our AI will analyze the JD, match it to your profile, and generate a tailored resume.</p>
                </div>

                <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <textarea
                      value={jdText}
                      onChange={(e) => { setJdText(e.target.value); setError(""); }}
                      placeholder="Paste the full job description here…&#10;&#10;We'll extract required skills, responsibilities, ATS keywords, and match them against your master profile."
                      rows={12}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-purple-400/60 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all leading-relaxed"
                    />

                    {error && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-3 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                      </motion.div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-purple-400 text-xs">{jdText.length} characters</span>
                      <Button
                        onClick={analyzeJD}
                        disabled={!jdText.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Zap className="h-4 w-4 mr-2" /> Analyze & Match
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* tips */}
                <div className="mt-6 grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: <FileText className="h-4 w-4" />, text: "Include the full JD for best results" },
                    { icon: <Target className="h-4 w-4" />, text: "Works with any role or industry" },
                    { icon: <Clock className="h-4 w-4" />, text: "Analysis takes ~20 seconds" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-purple-300 text-xs bg-white/5 border border-white/8 rounded-xl px-3 py-2.5">
                      <span className="text-purple-400 shrink-0">{t.icon}</span> {t.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── processing steps ── */}
          {(step === "analyzing" || step === "matching") && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProcessingStep step={step} />
            </motion.div>
          )}

          {/* ── results ── */}
          {step === "results" && matchResult && (
            <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-6">

              {/* overall score card */}
              <Card className={`border-white/10 bg-gradient-to-br ${scoreBg(matchResult.overall_score)} backdrop-blur-xl`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {verdictIcon(matchResult.summary?.verdict)}
                      <div>
                        <div className="flex items-center gap-3">
                          <span className={`text-5xl font-black ${scoreColor(matchResult.overall_score)}`}>
                            {matchResult.overall_score}
                          </span>
                          <span className="text-purple-300 text-lg font-bold">/100</span>
                        </div>
                        <p className="text-white font-semibold mt-0.5">{matchResult.summary?.message ?? "Match result"}</p>
                        <p className="text-purple-300 text-xs mt-0.5">
                          Est. ATS pass rate: {matchResult.summary?.estimated_ats_pass_rate ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2">
                      <Button
                        onClick={generateResume}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-bold"
                      >
                        {isGenerating ? (
                          <><Sparkles className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
                        ) : (
                          <><Rocket className="h-4 w-4 mr-2" /> Generate Resume <ArrowRight className="h-4 w-4 ml-1" /></>
                        )}
                      </Button>
                      <button onClick={() => { setStep("upload"); setMatchResult(null); }}
                        className="text-xs text-purple-400 hover:text-purple-200 transition-colors">
                        ← Try a different JD
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* score breakdown */}
              <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
                <CardHeader className="pb-3 cursor-pointer" onClick={() => toggle("breakdown")}>
                  <CardTitle className="text-white text-base font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-purple-300" /> Score Breakdown</span>
                    {expanded.breakdown ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                  </CardTitle>
                </CardHeader>
                <AnimatePresence>
                  {expanded.breakdown && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <CardContent className="pt-0 space-y-4">
                        {Object.entries(matchResult.score_breakdown ?? {}).map(([key, comp]) => (
                          <ScoreBar key={key} label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} {...(comp as ScoreComponent)} />
                        ))}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* missing skills */}
              {matchResult.missing_elements && (
                <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
                  <CardHeader className="pb-3 cursor-pointer" onClick={() => toggle("missing")}>
                    <CardTitle className="text-white text-base font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-400" /> Missing Elements</span>
                      {expanded.missing ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {expanded.missing && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <CardContent className="pt-0">
                          {matchResult.missing_elements.critical_skills?.length ? (
                            <div className="mb-4">
                              <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Critical Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {matchResult.missing_elements.critical_skills.map((s) => (
                                  <span key={typeof s === 'string' ? s : s.skill} className="text-xs px-2.5 py-1 bg-red-500/15 border border-red-500/25 text-red-300 rounded-full">{typeof s === 'string' ? s : s.skill}</span>
                                ))}
                              </div>
                            </div>
                          ) : null}
                          {matchResult.missing_elements.nice_to_have?.length ? (
                            <div>
                              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2">Nice to Have</p>
                              <div className="flex flex-wrap gap-2">
                                {matchResult.missing_elements.nice_to_have?.map((s) => (
                                  <span key={typeof s === 'string' ? s : s.skill} className="text-xs px-2.5 py-1 bg-yellow-500/15 border border-yellow-500/25 text-yellow-300 rounded-full">{typeof s === 'string' ? s : s.skill}</span>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )}

              {/* suggestions */}
              {matchResult.suggestions && (
                <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
                  <CardHeader className="pb-3 cursor-pointer" onClick={() => toggle("suggestions")}>
                    <CardTitle className="text-white text-base font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-300" /> AI Suggestions</span>
                      {expanded.suggestions ? <ChevronUp className="h-4 w-4 text-purple-400" /> : <ChevronDown className="h-4 w-4 text-purple-400" />}
                    </CardTitle>
                  </CardHeader>
                  <AnimatePresence>
                    {expanded.suggestions && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <CardContent className="pt-0 space-y-2">
                          {(matchResult.suggestions.immediate_actions ?? []).slice(0, 5).map((s: { action: string; impact: string }, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white/5 border border-white/8 rounded-xl">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 mt-0.5 ${s.impact === "high" ? "bg-red-500/20 text-red-300" : s.impact === "medium" ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}>
                                {s.impact}
                              </span>
                              <p className="text-purple-200 text-sm">{s.action}</p>
                            </div>
                          ))}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              )}

              {/* generate CTA bottom */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-center pt-2">
                <Button
                  onClick={generateResume}
                  disabled={isGenerating}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-bold px-8"
                >
                  {isGenerating ? "Generating…" : "Generate Tailored Resume"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <p className="text-purple-400 text-xs mt-2">Takes ~30 seconds · ATS-optimized · Real content only</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
