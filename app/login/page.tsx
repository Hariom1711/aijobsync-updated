// app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Sparkles, Zap, Target, TrendingUp, ArrowRight, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const features = [
  { icon: <Zap className="h-4 w-4" />, text: "60-second ATS resume generation" },
  { icon: <Target className="h-4 w-4" />, text: "AI-powered JD matching" },
  { icon: <TrendingUp className="h-4 w-4" />, text: "Beat 95% of ATS filters" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Fill in all fields."); return; }
    setLoading(true);

    const result = await signIn("credentials", {
      email, password, redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      toast.error("Invalid email or password.");
    } else {
      toast.success("Welcome back!");
      router.push("/dashboard");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-[32rem] h-[32rem] bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* left panel (desktop) */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative z-10">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-black text-2xl">AIJobSync</span>
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Land your dream job<br />
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">faster than ever.</span>
          </h1>
          <p className="text-purple-300 text-base mb-10 leading-relaxed">
            Paste a job description. Get an ATS-optimized, tailored resume in under 60 seconds.
          </p>
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-purple-200">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                  {f.icon}
                </div>
                {f.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-black text-xl">AIJobSync</span>
          </div>

          <div className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <h2 className="text-white font-black text-2xl mb-1">Welcome back</h2>
            <p className="text-purple-300 text-sm mb-7">Sign in to your account to continue</p>

            {/* Google */}
            <Button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full mb-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold border border-gray-200"
            >
              {googleLoading ? (
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Chrome className="h-4 w-4 mr-2" />
              )}
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-purple-400 text-xs">or sign in with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleCredentials} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-purple-200 text-sm">Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/15 text-white placeholder-purple-400/60 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-purple-200 text-sm">Password</Label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/5 border-white/15 text-white placeholder-purple-400/60 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-bold py-5"
              >
                {loading ? "Signing in…" : <>Sign In <ArrowRight className="h-4 w-4 ml-1.5" /></>}
              </Button>
            </form>

            <p className="text-center text-purple-300 text-sm mt-5">
              No account?{" "}
              <button onClick={() => router.push("/signup")} className="text-purple-200 hover:text-white font-semibold transition-colors">
                Create one free
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
