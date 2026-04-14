// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles, Target, FileText, UploadCloud, BarChart3,
  LogOut, Crown, Rocket, ChevronRight, ShieldCheck,
  CheckCircle2, Plus, TrendingUp, Clock, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMasterProfile } from "@/hooks/useMasterProfile";
import { calculateProfileCompletion } from "@/lib/profileCompletion";

// ── animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 40);
    const id = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [to]);
  return <>{val}{suffix}</>;
}

// ── stagger variants ──────────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ── quick action card ─────────────────────────────────────────────────────────
function QuickCard({
  title, desc, icon: Icon, iconColor, onClick, cta,
}: {
  title: string; desc: string; icon: React.ElementType;
  iconColor: string; onClick: () => void; cta: string;
}) {
  return (
    <motion.div variants={item}>
      <Card className="h-full border-white/10 bg-white/8 backdrop-blur-xl hover:bg-white/12 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold text-sm">{title}</span>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <p className="text-purple-200/80 text-xs leading-relaxed flex-1">{desc}</p>
          <Button
            size="sm"
            onClick={onClick}
            className="mt-4 w-full bg-white/10 border border-white/20 text-white hover:bg-white/20 text-xs"
          >
            {cta} <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { profile, toFormData, loading: profileLoading } = useMasterProfile();

  // Real stats from API
  const [stats, setStats] = useState({ resumes: 0, avgScore: 0, jds: 0 });
  const [resumes, setResumes] = useState<
    { id: string; jobDescription?: { jobTitle?: string; companyName?: string }; score?: number; createdAt: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/resume/list")
      .then((r) => r.json())
      .then((d) => {
        if (d.resumes) {
          setResumes(d.resumes.slice(0, 3));
          const scores = d.resumes.map((r: { score?: number }) => r.score ?? 0).filter(Boolean);
          setStats({
            resumes: d.resumes.length,
            avgScore: scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0,
            jds: d.resumes.filter((r: { jobDescription?: unknown }) => r.jobDescription).length,
          });
        }
      })
      .catch(() => {});
  }, []);

  const formData = profile ? toFormData() : null;
  const completion = formData ? calculateProfileCompletion(formData) : null;
  const nextMissing = completion?.missingSections?.[0]
    ? completion.missingSections[0].replace(/^\w/, (c) => c.toUpperCase())
    : null;
  const userName = session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "there";

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3_600_000);
    const d = Math.floor(diff / 86_400_000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    if (d < 7) return `${d}d ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[36rem] h-[36rem] bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 right-0 w-[32rem] h-[32rem] bg-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* navbar */}
      <div className="relative z-10 border-b border-white/8 backdrop-blur-md bg-white/3 sticky top-0">
        <div className="mx-auto max-w-7xl px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">AIJobSync</span>
            <div className="hidden md:flex items-center gap-1.5 ml-3 text-xs text-purple-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <ShieldCheck className="h-3.5 w-3.5" />
              ATS-Optimized
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/30 text-amber-200 hover:from-amber-500/30 hover:to-orange-500/30"
              onClick={() => router.push("/pricing")}
            >
              <Crown className="h-3.5 w-3.5 mr-1.5" /> Go Pro
            </Button>
            {status === "authenticated" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-300 hover:text-white hover:bg-white/10"
                onClick={() => {
                  signOut({ callbackUrl: "/login" });
                  toast.success("Signed out successfully");
                }}
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" /> Logout
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 space-y-8">

        {/* hero greeting */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Hey,{" "}
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
                  {userName}
                </span>{" "}
                👋
              </h1>
              <p className="text-purple-300 mt-1.5 text-sm">
                Build job-specific resumes in seconds. Beat ATS. Land interviews.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </motion.div>

        {/* profile completion banner */}
        {!profileLoading && completion && completion.completeness < 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div
              className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Complete your profile — {completion.completeness}% done
                  </p>
                  <p className="text-purple-300 text-xs mt-0.5">
                    {nextMissing ? `Next: Add ${nextMissing}` : "Almost there!"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:shrink-0">
                <div className="flex-1 sm:w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completion.completeness}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>
                <Button size="sm" className="bg-white/10 border border-white/20 text-white hover:bg-white/20 text-xs whitespace-nowrap">
                  Complete <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* quick actions */}
        <motion.div variants={container} initial="hidden" animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickCard
            title="Master Profile" icon={Target} iconColor="text-pink-300"
            desc="One profile, infinite tailored resumes. Your career DNA."
            cta={completion?.completeness === 100 ? "View Profile" : nextMissing ? `Add ${nextMissing}` : "Set Up Profile"}
            onClick={() => router.push("/profile")}
          />
          <QuickCard
            title="Generate Resume" icon={Rocket} iconColor="text-indigo-300"
            desc="Paste a JD and get an ATS-optimized resume in under 60 seconds."
            cta="Start Now"
            onClick={() => router.push("/resume/new")}
          />
          <QuickCard
            title="Import LinkedIn" icon={UploadCloud} iconColor="text-cyan-300"
            desc="Auto-fill your master profile from your LinkedIn PDF export."
            cta="Import PDF"
            onClick={() => router.push("/import/linkedin")}
          />
          <QuickCard
            title="My Resumes" icon={FileText} iconColor="text-emerald-300"
            desc="View, download, or regenerate your saved resumes."
            cta="Open Library"
            onClick={() => router.push("/resume")}
          />
        </motion.div>

        {/* stats + activity */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* left col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* stats row */}
            <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-300" /> Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Avg ATS Score", value: stats.avgScore, suffix: "%", color: "text-green-400" },
                    { label: "Resumes Made", value: stats.resumes, suffix: "", color: "text-indigo-300" },
                    { label: "JDs Analyzed", value: stats.jds, suffix: "", color: "text-pink-300" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-white/5 border border-white/8 p-4 text-center">
                      <div className={`text-2xl font-black ${s.color}`}>
                        <Counter to={s.value} suffix={s.suffix} />
                      </div>
                      <div className="text-purple-300 text-xs mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div
                  onClick={() => router.push("/resume/new")}
                  className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500/15 to-fuchsia-500/15 border border-white/10 p-4 flex items-center justify-between cursor-pointer hover:from-indigo-500/25 hover:to-fuchsia-500/25 transition-all"
                >
                  <div className="flex items-center gap-2.5 text-white font-medium text-sm">
                    <BarChart3 className="h-5 w-5 text-fuchsia-300" />
                    Analyze a new JD to improve your match score
                  </div>
                  <ChevronRight className="h-4 w-4 text-purple-300" />
                </div>
              </CardContent>
            </Card>

            {/* recent activity */}
            <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-300" /> Recent Resumes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {resumes.length === 0 ? (
                  <div
                    className="py-8 text-center border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-purple-500/40 transition-colors"
                    onClick={() => router.push("/resume/new")}
                  >
                    <Plus className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-purple-300 text-sm">No resumes yet</p>
                    <p className="text-purple-400 text-xs mt-1">Generate your first one →</p>
                  </div>
                ) : (
                  resumes.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-center justify-between rounded-lg bg-white/5 border border-white/8 px-4 py-3 hover:bg-white/8 cursor-pointer transition-colors"
                      onClick={() => router.push(`/resume?id=${r.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-emerald-300 shrink-0" />
                        <div>
                          <p className="text-purple-100 text-sm font-medium">
                            {r.jobDescription?.jobTitle ?? "Resume"}{" "}
                            {r.jobDescription?.companyName ? `— ${r.jobDescription.companyName}` : ""}
                          </p>
                          <p className="text-purple-400 text-xs">{timeAgo(r.createdAt)}</p>
                        </div>
                      </div>
                      {r.score != null && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.score >= 80 ? "bg-green-500/20 text-green-300" : r.score >= 60 ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300"}`}>
                          {r.score}%
                        </span>
                      )}
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* right col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {/* quick start */}
            <Card className="border-white/10 bg-white/8 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-base font-semibold">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Complete Master Profile", path: "/profile" },
                  { label: "Create Resume from JD", path: "/resume/new" },
                  { label: "Browse Templates", path: "/templates" },
                ].map((a) => (
                  <button
                    key={a.path}
                    onClick={() => router.push(a.path)}
                    className="w-full text-left flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-purple-100 text-sm hover:bg-white/10 hover:border-purple-400/30 transition-all"
                  >
                    {a.label}
                    <ChevronRight className="h-4 w-4 text-purple-400" />
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* pro upsell */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-pink-500/15 border border-amber-400/20 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-300" />
                <span className="text-white font-semibold text-sm">Unlock Pro</span>
              </div>
              <ul className="text-purple-200 text-xs space-y-1 mb-4">
                {["Unlimited resumes", "Deep AI feedback", "Cover letters", "Priority matching"].map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-amber-300 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold hover:from-amber-500 hover:to-orange-600 text-sm"
                onClick={() => router.push("/pricing")}
              >
                Upgrade Now <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
