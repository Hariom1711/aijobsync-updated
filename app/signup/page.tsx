// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Sparkles, ArrowRight, Chrome, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const perks = [
  "Free ATS resume generation",
  "LinkedIn profile import",
  "JD analysis & matching",
  "3 resume templates",
];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Fill in all fields."); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Signup failed.");
        return;
      }

      toast.success("Account created! Signing you in…");
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.ok) router.push("/profile");
      else router.push("/login");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 w-[32rem] h-[32rem] bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -left-10 w-[28rem] h-[28rem] bg-pink-600/15 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* left panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative z-10">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-black text-2xl">AIJobSync</span>
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Your free account<br />
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">includes everything.</span>
          </h1>
          <div className="space-y-3 mt-8">
            {perks.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-purple-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                {p}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-black text-xl">AIJobSync</span>
          </div>

          <div className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-white font-black text-2xl mb-1">Create free account</h2>
            <p className="text-purple-300 text-sm mb-7">Start building better resumes today</p>

            <Button onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: "/profile" }); }}
              disabled={googleLoading}
              className="w-full mb-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold border border-gray-200">
              <Chrome className="h-4 w-4 mr-2" /> Continue with Google
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-purple-400 text-xs">or sign up with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-purple-200 text-sm">Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hariom Ojha"
                  className="bg-white/5 border-white/15 text-white placeholder-purple-400/60 focus:border-purple-500" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-purple-200 text-sm">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="bg-white/5 border-white/15 text-white placeholder-purple-400/60 focus:border-purple-500" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-purple-200 text-sm">Password</Label>
                <div className="relative">
                  <Input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="bg-white/5 border-white/15 text-white placeholder-purple-400/60 focus:border-purple-500 pr-10" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-bold py-5">
                {loading ? "Creating account…" : <>Create Account <ArrowRight className="h-4 w-4 ml-1.5" /></>}
              </Button>
            </form>

            <p className="text-center text-purple-300 text-sm mt-5">
              Already have an account?{" "}
              <button onClick={() => router.push("/login")} className="text-purple-200 hover:text-white font-semibold transition-colors">
                Sign in
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
