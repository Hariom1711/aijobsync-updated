"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Mic, ArrowLeft, Crown, ChevronRight, Loader2,
  CheckCircle2, XCircle, Star, Trophy, ArrowRight,
  Brain, Sparkles, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Question {
  id: number;
  type: string;
  question: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Feedback {
  score: number;
  feedback: string;
  missed: string;
  suggestion: string;
}

type InterviewPhase = "setup" | "interviewing" | "results";

const difficultyColor: Record<string, string> = {
  easy:   "text-green-400 bg-green-500/15 border-green-500/25",
  medium: "text-yellow-400 bg-yellow-500/15 border-yellow-500/25",
  hard:   "text-red-400 bg-red-500/15 border-red-500/25",
};

export default function InterviewPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const isPro = (session?.user as any)?.plan === "PRO";

  // Setup state
  const [resumes, setResumes] = useState<{ id: string; jobDescription?: { jobTitle?: string; companyName?: string } }[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Interview state
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedbacks, setFeedbacks] = useState<(Feedback | null)[]>([]);
  const [scorecard, setScorecard] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load resumes on mount
  useEffect(() => {
    fetch("/api/resume/list")
      .then((r) => r.json())
      .then((d) => {
        if (d.resumes) setResumes(d.resumes);
      })
      .catch(() => {})
      .finally(() => setLoadingResumes(false));
  }, []);

  if (!isPro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full rounded-2xl bg-white/8 border border-white/10 p-8 text-center backdrop-blur-xl"
        >
          <Crown className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">AI Interviewer is Pro</h2>
          <p className="text-purple-300 text-sm mb-6">
            Practice interviews based on your real JD and resume. Get scored AI feedback on every answer.
            Upgrade to Pro for ₹1 to try it out.
          </p>
          <Button
            onClick={() => router.push("/pro")}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold"
          >
            <Crown size={16} className="mr-2" /> Upgrade to Pro — ₹1 for 7 days
          </Button>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-3 text-purple-400 text-sm hover:text-white transition"
          >
            ← Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Generate interview ──
  const handleGenerate = async () => {
    if (!selectedResume) {
      toast.error("Please select a resume first.");
      return;
    }
    setGenerating(true);
    const tid = toast.loading("Generating your personalized interview…");
    try {
      const res = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: selectedResume }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setQuestions(data.questions);
        setFeedbacks(new Array(data.questions.length).fill(null));
        setPhase("interviewing");
        toast.success("Interview ready! Answer each question.", { id: tid });
      } else {
        toast.error(data.error ?? "Failed to generate interview.", { id: tid });
      }
    } catch {
      toast.error("Something went wrong. Try again.", { id: tid });
    } finally {
      setGenerating(false);
    }
  };

  // ── Submit answer ──
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please write your answer first.");
      return;
    }
    if (!sessionId) return;
    setSubmitting(true);
    const q = questions[currentQIndex];
    const tid = toast.loading("Evaluating your answer…");
    try {
      const res = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: q.id,
          answer,
          question: q.question,
          hint: q.hint,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newFeedbacks = [...feedbacks];
        newFeedbacks[currentQIndex] = data.feedback;
        setFeedbacks(newFeedbacks);
        toast.success("Answer evaluated!", { id: tid });
      } else {
        toast.error("Evaluation failed. Try again.", { id: tid });
      }
    } catch {
      toast.error("Something went wrong.", { id: tid });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setAnswer("");
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((i) => i + 1);
    }
  };

  // ── Finish interview ──
  const handleFinish = async () => {
    if (!sessionId) return;
    setGenerating(true);
    const tid = toast.loading("Generating your scorecard…");
    try {
      const res = await fetch("/api/interview/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setScorecard(data.scorecard);
        setPhase("results");
        toast.success("Interview complete! Here are your results.", { id: tid });
      } else {
        toast.error("Failed to generate scorecard.", { id: tid });
      }
    } catch {
      toast.error("Something went wrong.", { id: tid });
    } finally {
      setGenerating(false);
    }
  };

  const currentQuestion = questions[currentQIndex];
  const currentFeedback = feedbacks[currentQIndex];
  const answeredCount   = feedbacks.filter(Boolean).length;
  const isLastQuestion  = currentQIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Navbar */}
      <div className="border-b border-white/8 backdrop-blur-md bg-white/3 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-5 py-3.5 flex items-center justify-between">
          <button
            onClick={() => router.push("/pro")}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Pro Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-purple-300" />
            <span className="text-white font-semibold">AI Interviewer</span>
            <span className="text-xs text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
              Pro
            </span>
          </div>
          {phase === "interviewing" && (
            <div className="text-sm text-purple-300">
              {answeredCount}/{questions.length} answered
            </div>
          )}
          {phase === "setup" && <div className="w-24" />}
          {phase === "results" && <div className="w-24" />}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-5 py-8">
        <AnimatePresence mode="wait">

          {/* ── SETUP ── */}
          {phase === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="h-16 w-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-8 w-8 text-purple-300" />
                </div>
                <h1 className="text-3xl font-black text-white">AI Mock Interview</h1>
                <p className="text-purple-300">
                  Select a resume. AI generates 10 personalized questions from your JD + profile.
                </p>
              </div>

              {/* How it works */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Target, step: "1", title: "Select Resume", desc: "Pick a resume tied to a JD" },
                  { icon: Sparkles, step: "2", title: "AI Generates Questions", desc: "10 tailored questions from your JD + profile" },
                  { icon: Trophy, step: "3", title: "Get Scored Feedback", desc: "Answer each question and see instant AI feedback" },
                ].map(({ icon: Icon, step, title, desc }) => (
                  <div key={step} className="rounded-xl bg-white/5 border border-white/8 p-4 text-center">
                    <div className="text-purple-400 text-2xl font-black mb-2">{step}</div>
                    <Icon className="h-5 w-5 text-purple-300 mx-auto mb-2" />
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-purple-400 text-xs mt-1">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Resume selector */}
              <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base font-semibold">Select a Resume</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {loadingResumes ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                    </div>
                  ) : resumes.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-purple-300 text-sm">No resumes yet.</p>
                      <Button
                        size="sm"
                        className="mt-3 bg-purple-600 hover:bg-purple-700"
                        onClick={() => router.push("/resume/new")}
                      >
                        Generate a Resume First
                      </Button>
                    </div>
                  ) : (
                    resumes.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedResume(r.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedResume === r.id
                            ? "border-purple-500/60 bg-purple-500/15"
                            : "border-white/8 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedResume === r.id ? "border-purple-400" : "border-white/30"}`}>
                            {selectedResume === r.id && <div className="h-2 w-2 rounded-full bg-purple-400" />}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {r.jobDescription?.jobTitle ?? "Resume"}
                              {r.jobDescription?.companyName ? ` — ${r.jobDescription.companyName}` : ""}
                            </p>
                            {!r.jobDescription && (
                              <p className="text-purple-400 text-xs">No JD linked — questions will be general</p>
                            )}
                          </div>
                        </div>
                        {selectedResume === r.id && <CheckCircle2 className="h-4 w-4 text-purple-400" />}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={handleGenerate}
                disabled={!selectedResume || generating}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600"
              >
                {generating ? (
                  <><Loader2 size={16} className="animate-spin mr-2" /> Generating Interview…</>
                ) : (
                  <><Brain size={16} className="mr-2" /> Start AI Interview</>
                )}
              </Button>
            </motion.div>
          )}

          {/* ── INTERVIEWING ── */}
          {phase === "interviewing" && currentQuestion && (
            <motion.div
              key={`q-${currentQIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              {/* Progress */}
              <div className="flex items-center justify-between text-sm text-purple-300 mb-2">
                <span>Question {currentQIndex + 1} of {questions.length}</span>
                <span>{answeredCount} answered</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>

              {/* Question card */}
              <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${difficultyColor[currentQuestion.difficulty]}`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="text-xs text-purple-400 capitalize bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {currentQuestion.type}
                    </span>
                  </div>

                  <h2 className="text-white text-lg font-semibold leading-relaxed mb-2">
                    {currentQuestion.question}
                  </h2>

                  <p className="text-purple-400 text-xs">
                    💡 Hint: {currentQuestion.hint}
                  </p>
                </CardContent>
              </Card>

              {/* Answer area */}
              {!currentFeedback ? (
                <div className="space-y-3">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here… Be specific and use examples from your experience."
                    rows={6}
                    className="w-full rounded-xl bg-white/8 border border-white/10 text-white text-sm placeholder-purple-400/50 p-4 resize-none focus:outline-none focus:border-purple-500/60 focus:bg-white/12 transition-all"
                  />
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || !answer.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 font-semibold"
                  >
                    {submitting ? (
                      <><Loader2 size={15} className="animate-spin mr-2" /> Evaluating…</>
                    ) : (
                      <>Submit Answer <ChevronRight size={15} className="ml-1" /></>
                    )}
                  </Button>
                </div>
              ) : (
                /* Feedback display */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Score */}
                  <div className={`rounded-xl p-4 border ${
                    currentFeedback.score >= 7
                      ? "bg-green-500/10 border-green-500/25"
                      : currentFeedback.score >= 5
                      ? "bg-yellow-500/10 border-yellow-500/25"
                      : "bg-red-500/10 border-red-500/25"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Your Score</span>
                      <span className={`text-2xl font-black ${currentFeedback.score >= 7 ? "text-green-400" : currentFeedback.score >= 5 ? "text-yellow-400" : "text-red-400"}`}>
                        {currentFeedback.score}/10
                      </span>
                    </div>
                    <p className="text-purple-100 text-sm leading-relaxed">{currentFeedback.feedback}</p>
                  </div>

                  {currentFeedback.missed && (
                    <div className="rounded-xl bg-red-500/8 border border-red-500/20 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle size={14} className="text-red-400" />
                        <span className="text-red-300 text-xs font-semibold">Missed</span>
                      </div>
                      <p className="text-red-200 text-sm">{currentFeedback.missed}</p>
                    </div>
                  )}

                  <div className="rounded-xl bg-blue-500/8 border border-blue-500/20 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={14} className="text-blue-400" />
                      <span className="text-blue-300 text-xs font-semibold">How to improve</span>
                    </div>
                    <p className="text-blue-200 text-sm">{currentFeedback.suggestion}</p>
                  </div>

                  {/* Next / Finish */}
                  {!isLastQuestion ? (
                    <Button onClick={handleNext} className="w-full bg-purple-600 hover:bg-purple-700 font-semibold">
                      Next Question <ArrowRight size={15} className="ml-1" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinish}
                      disabled={generating}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold"
                    >
                      {generating ? (
                        <><Loader2 size={15} className="animate-spin mr-2" /> Generating Scorecard…</>
                      ) : (
                        <><Trophy size={15} className="mr-2" /> Finish & See Results</>
                      )}
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Nav pills */}
              <div className="flex gap-2 flex-wrap justify-center pt-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setAnswer(""); setCurrentQIndex(i); }}
                    className={`h-2 w-6 rounded-full transition-all ${
                      i === currentQIndex
                        ? "bg-purple-400 w-8"
                        : feedbacks[i]
                        ? "bg-green-500/60"
                        : "bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {phase === "results" && scorecard && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Overall score hero */}
              <div className="text-center">
                <Trophy className="h-14 w-14 text-amber-400 mx-auto mb-3" />
                <h1 className="text-3xl font-black text-white">Interview Complete!</h1>
                <p className="text-purple-300 mt-1">{scorecard.answeredQuestions}/{scorecard.totalQuestions} questions answered</p>
              </div>

              <div className="flex justify-center">
                <div className={`rounded-2xl p-8 text-center border ${
                  scorecard.overallScore >= 7
                    ? "bg-green-500/15 border-green-500/30"
                    : scorecard.overallScore >= 5
                    ? "bg-yellow-500/15 border-yellow-500/30"
                    : "bg-red-500/15 border-red-500/30"
                }`}>
                  <div className={`text-6xl font-black mb-1 ${
                    scorecard.overallScore >= 7 ? "text-green-400" : scorecard.overallScore >= 5 ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {scorecard.overallScore}/10
                  </div>
                  <p className="text-purple-200 text-sm">Overall Score</p>
                </div>
              </div>

              {/* Strengths + Weak areas */}
              <div className="grid sm:grid-cols-2 gap-4">
                {scorecard.strengths?.length > 0 && (
                  <Card className="border-green-500/25 bg-green-500/8 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-300 text-sm font-semibold flex items-center gap-2">
                        <CheckCircle2 size={15} /> Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {scorecard.strengths.map((s: string, i: number) => (
                        <p key={i} className="text-green-100 text-xs leading-relaxed">{s}</p>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {scorecard.weakAreas?.filter(Boolean).length > 0 && (
                  <Card className="border-red-500/25 bg-red-500/8 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-red-300 text-sm font-semibold flex items-center gap-2">
                        <XCircle size={15} /> Improve On
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {scorecard.weakAreas.filter(Boolean).map((s: string, i: number) => (
                        <p key={i} className="text-red-100 text-xs leading-relaxed">{s}</p>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {scorecard.topSuggestion && (
                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 flex gap-3">
                  <Star className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-300 text-xs font-semibold mb-1">Top Tip</p>
                    <p className="text-blue-100 text-sm">{scorecard.topSuggestion}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => { setPhase("setup"); setQuestions([]); setFeedbacks([]); setCurrentQIndex(0); setAnswer(""); setScorecard(null); }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 font-semibold"
                >
                  <Mic size={15} className="mr-2" /> Practice Again
                </Button>
                <Button
                  onClick={() => router.push("/resume/new")}
                  variant="outline"
                  className="flex-1 border-white/20 text-purple-200 hover:bg-white/10"
                >
                  Generate New Resume
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
