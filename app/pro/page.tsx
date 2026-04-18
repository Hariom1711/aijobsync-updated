"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Crown, Sparkles, Zap, CheckCircle2, ChevronRight,
  Mic, FileText, Brain, Target, ArrowLeft, Loader2,
  Star, ShieldCheck, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FREE_FEATURES = [
  "3 resume generations per day",
  "JD analysis & ATS scoring",
  "Basic profile matching",
  "3 templates (Classic, Minimal, Modern)",
  "LinkedIn PDF import",
  "PDF export",
];

const PRO_FEATURES = [
  "Unlimited resume generation",
  "AI section rewriter ✨",
  "AI Interviewer — practice with real JD questions",
  "Cover letter generator",
  "Advanced profile matching + potential score",
  "All templates (including Executive & Creative)",
  "Priority AI processing",
  "Resume history & versioning",
];

// ── Animated feature card ──────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, badge }: {
  icon: React.ElementType; title: string; desc: string; badge?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl bg-white/8 border border-white/10 p-5 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-purple-300" />
        </div>
        {badge && (
          <span className="text-xs font-semibold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
            {badge}
          </span>
        )}
      </div>
      <p className="text-white font-semibold text-sm mb-1">{title}</p>
      <p className="text-purple-300 text-xs leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function ProPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  const isPro = (session?.user as any)?.plan === "PRO";
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"pricing" | "dashboard">(isPro ? "dashboard" : "pricing");

  // Switch to dashboard tab when user upgrades
  useEffect(() => {
    if (isPro) setTab("dashboard");
  }, [isPro]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PRO" }),
      });
      const data = await res.json();
      if (data.success) {
        // Update session so UI reflects Pro immediately
        await updateSession({ plan: "PRO" });
        toast.success("🎉 Welcome to Pro! All features unlocked.", { duration: 5000 });
        setTab("dashboard");
      } else {
        toast.error("Upgrade failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async () => {
    if (!confirm("Downgrade to Free plan? You'll lose Pro features immediately.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "FREE" }),
      });
      const data = await res.json();
      if (data.success) {
        await updateSession({ plan: "FREE" });
        toast.success("Downgraded to Free plan.");
        setTab("pricing");
      }
    } catch {
      toast.error("Failed to downgrade. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[36rem] h-[36rem] bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 right-0 w-[32rem] h-[32rem] bg-purple-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Navbar */}
      <div className="relative z-10 border-b border-white/8 backdrop-blur-md bg-white/3 sticky top-0">
        <div className="mx-auto max-w-6xl px-5 py-3.5 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <span className="text-white font-bold text-lg">AIJobSync Pro</span>
          </div>
          {isPro && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
              <Star size={11} /> Active Pro
            </span>
          )}
          {!isPro && <div className="w-24" />}
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-10">

        {/* Tab toggle (only show if pro) */}
        {isPro && (
          <div className="flex justify-center mb-8">
            <div className="flex gap-1 bg-white/8 rounded-xl p-1 border border-white/10">
              {(["pricing", "dashboard"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${
                    tab === t
                      ? "bg-purple-600 text-white"
                      : "text-purple-300 hover:text-white"
                  }`}
                >
                  {t === "dashboard" ? "Pro Dashboard" : "Pricing"}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── PRICING TAB ── */}
          {tab === "pricing" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-10"
            >
              {/* Hero */}
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-500/20 px-4 py-1.5 rounded-full border border-amber-500/30 mb-2"
                >
                  <Sparkles size={12} /> Limited Time — ₹1 for 7 days
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-white">
                  Land more interviews.{" "}
                  <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                    With AI.
                  </span>
                </h1>
                <p className="text-purple-300 text-lg max-w-xl mx-auto">
                  Unlock AI resume rewriting, a personalized interview coach, cover letter generation, and more.
                </p>
              </div>

              {/* Pricing cards */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

                {/* Free */}
                <div className="rounded-2xl bg-white/8 border border-white/10 p-6 backdrop-blur-xl">
                  <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">Free</p>
                  <p className="text-white text-4xl font-black mb-1">₹0</p>
                  <p className="text-purple-400 text-sm mb-6">Forever</p>
                  <ul className="space-y-2 mb-6">
                    {FREE_FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-purple-200">
                        <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isPro ? (
                    <Button
                      variant="outline"
                      className="w-full border-white/20 text-purple-300 hover:bg-white/10"
                      onClick={handleDowngrade}
                      disabled={loading}
                    >
                      {loading ? <Loader2 size={15} className="animate-spin mr-2" /> : null}
                      Downgrade to Free
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full border-white/20 text-purple-300" disabled>
                      Current Plan
                    </Button>
                  )}
                </div>

                {/* Pro */}
                <div className="rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-purple-500/15 border-2 border-amber-400/40 p-6 backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-bl-xl">
                    MOST POPULAR
                  </div>
                  <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Crown size={12} /> Pro
                  </p>
                  <p className="text-white text-4xl font-black mb-0.5">₹199</p>
                  <p className="text-amber-300/80 text-sm mb-1">/month after trial</p>
                  <p className="text-amber-300 text-sm font-semibold mb-6">
                    🎉 Start for ₹1 — 7-day full access
                  </p>
                  <ul className="space-y-2 mb-6">
                    {PRO_FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-purple-100">
                        <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isPro ? (
                    <Button className="w-full bg-amber-400/30 text-amber-200 border border-amber-400/30" disabled>
                      <Crown size={15} className="mr-2" /> Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUpgrade}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold hover:from-amber-500 hover:to-orange-600"
                    >
                      {loading ? (
                        <Loader2 size={15} className="animate-spin mr-2" />
                      ) : (
                        <Zap size={15} className="mr-2" />
                      )}
                      Start Pro for ₹1
                    </Button>
                  )}
                  <p className="text-purple-400 text-xs text-center mt-3">
                    Auto-renews at ₹199/month · Cancel anytime
                  </p>
                </div>
              </div>

              {/* Pro features showcase */}
              <div className="space-y-4">
                <h2 className="text-white text-xl font-bold text-center">What you get with Pro</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FeatureCard
                    icon={Sparkles}
                    title="AI Section Rewriter"
                    desc="Rewrite any resume section with a click — AI optimizes it for your specific JD keywords."
                    badge="New"
                  />
                  <FeatureCard
                    icon={Mic}
                    title="AI Interviewer"
                    desc="Practice interviews generated from your exact JD and profile. Get feedback on every answer."
                    badge="Flagship"
                  />
                  <FeatureCard
                    icon={FileText}
                    title="Cover Letter Generator"
                    desc="Generate a tailored cover letter matched to any job description in seconds."
                  />
                  <FeatureCard
                    icon={TrendingUp}
                    title="Potential Score"
                    desc="See what your match score would be if you added the missing skills — a roadmap to improve."
                  />
                </div>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-purple-400">
                {[
                  { icon: ShieldCheck, text: "Cancel anytime" },
                  { icon: Zap, text: "Instant access" },
                  { icon: Star, text: "No hidden fees" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon size={15} className="text-purple-400" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PRO DASHBOARD TAB ── */}
          {tab === "dashboard" && isPro && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              {/* Pro welcome banner */}
              <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-purple-500/20 border border-amber-400/30 p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="h-5 w-5 text-amber-300" />
                    <span className="text-amber-300 font-bold text-sm uppercase tracking-wider">Pro Member</span>
                  </div>
                  <h2 className="text-white text-2xl font-black">All Pro features unlocked 🚀</h2>
                  <p className="text-purple-300 text-sm mt-1">Your AI career toolkit is ready. What would you like to do?</p>
                </div>
                <div className="hidden md:block text-6xl">✨</div>
              </div>

              {/* Pro quick actions */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* AI Interviewer */}
                <motion.div
                  whileHover={{ y: -3 }}
                  onClick={() => router.push("/interview")}
                  className="cursor-pointer rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 p-5 hover:from-purple-600/30 hover:to-indigo-600/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-purple-500/30 flex items-center justify-center mb-3">
                    <Mic className="h-5 w-5 text-purple-300" />
                  </div>
                  <p className="text-white font-semibold mb-1">AI Interviewer</p>
                  <p className="text-purple-300 text-xs leading-relaxed">
                    Practice a full interview based on any JD + your resume. Get scored feedback on every answer.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-purple-300 text-xs font-medium">
                    Start Interview <ChevronRight size={13} />
                  </div>
                </motion.div>

                {/* AI Rewrite */}
                <motion.div
                  whileHover={{ y: -3 }}
                  onClick={() => router.push("/resume")}
                  className="cursor-pointer rounded-2xl bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-500/30 p-5 hover:from-pink-600/30 hover:to-rose-600/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-pink-500/30 flex items-center justify-center mb-3">
                    <Sparkles className="h-5 w-5 text-pink-300" />
                  </div>
                  <p className="text-white font-semibold mb-1">AI Section Rewriter</p>
                  <p className="text-purple-300 text-xs leading-relaxed">
                    Open any resume and rewrite individual sections with AI — keyword-optimized for your JD.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-pink-300 text-xs font-medium">
                    Open Resumes <ChevronRight size={13} />
                  </div>
                </motion.div>

                {/* Cover Letter */}
                <motion.div
                  whileHover={{ y: -3 }}
                  onClick={() => {
                    toast("Cover letter generator", {
                      description: "Opening cover letter generator — pick a resume to get started.",
                    });
                    router.push("/cover-letter");
                  }}
                  className="cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 p-5 hover:from-emerald-600/30 hover:to-teal-600/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/30 flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-emerald-300" />
                  </div>
                  <p className="text-white font-semibold mb-1">Cover Letter</p>
                  <p className="text-purple-300 text-xs leading-relaxed">
                    Generate a tailored cover letter for any job in seconds using your profile + JD.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-emerald-300 text-xs font-medium">
                    Generate Now <ChevronRight size={13} />
                  </div>
                </motion.div>

                {/* Generate Resume */}
                <motion.div
                  whileHover={{ y: -3 }}
                  onClick={() => router.push("/resume/new")}
                  className="cursor-pointer rounded-2xl bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/30 p-5 hover:from-indigo-600/30 hover:to-blue-600/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/30 flex items-center justify-center mb-3">
                    <Zap className="h-5 w-5 text-indigo-300" />
                  </div>
                  <p className="text-white font-semibold mb-1">Generate Resume</p>
                  <p className="text-purple-300 text-xs leading-relaxed">
                    Unlimited generations. Paste any JD and get an ATS-optimized resume instantly.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-indigo-300 text-xs font-medium">
                    Start Now <ChevronRight size={13} />
                  </div>
                </motion.div>

                {/* Potential Score */}
                <motion.div
                  whileHover={{ y: -3 }}
                  onClick={() => router.push("/resume/new")}
                  className="cursor-pointer rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/30 p-5 hover:from-amber-600/30 hover:to-yellow-600/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-amber-500/30 flex items-center justify-center mb-3">
                    <Target className="h-5 w-5 text-amber-300" />
                  </div>
                  <p className="text-white font-semibold mb-1">Potential Score</p>
                  <p className="text-purple-300 text-xs leading-relaxed">
                    See your potential ATS score after adding missing skills. Know exactly what to learn next.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-amber-300 text-xs font-medium">
                    Analyze JD <ChevronRight size={13} />
                  </div>
                </motion.div>

                {/* All Templates */}
                <motion.div
                  whileHover={{ y: -3 }}
                  onClick={() => router.push("/templates")}
                  className="cursor-pointer rounded-2xl bg-gradient-to-br from-fuchsia-600/20 to-pink-600/20 border border-fuchsia-500/30 p-5 hover:from-fuchsia-600/30 hover:to-pink-600/30 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-fuchsia-500/30 flex items-center justify-center mb-3">
                    <Brain className="h-5 w-5 text-fuchsia-300" />
                  </div>
                  <p className="text-white font-semibold mb-1">All Templates</p>
                  <p className="text-purple-300 text-xs leading-relaxed">
                    Access all resume templates including Executive and Creative — Pro only.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-fuchsia-300 text-xs font-medium">
                    Browse Templates <ChevronRight size={13} />
                  </div>
                </motion.div>
              </div>

              {/* Plan management */}
              <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-300" /> Plan Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Pro Plan — ₹199/month</p>
                    <p className="text-purple-300 text-sm mt-0.5">
                      Next billing: Razorpay integration coming soon
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={handleDowngrade}
                    disabled={loading}
                  >
                    {loading ? <Loader2 size={13} className="animate-spin mr-1" /> : null}
                    Downgrade
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
