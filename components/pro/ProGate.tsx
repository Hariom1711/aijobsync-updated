"use client";

// components/pro/ProGate.tsx
// Wrap any Pro-only UI with this. Shows a blurred lock overlay for free users.
// Usage:
//   <ProGate isPro={isPro} feature="AI Interviewer">
//     <YourProOnlyComponent />
//   </ProGate>

import { useRouter } from "next/navigation";
import { Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProGateProps {
  isPro: boolean;
  feature?: string;
  children: React.ReactNode;
  /** If true, renders children but with a blurred overlay instead of hiding them */
  blur?: boolean;
}

export default function ProGate({ isPro, feature = "This feature", children, blur = false }: ProGateProps) {
  const router = useRouter();

  if (isPro) return <>{children}</>;

  if (blur) {
    return (
      <div className="relative">
        {/* Blurred children underneath */}
        <div className="pointer-events-none select-none blur-sm opacity-40">
          {children}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-xl">
          <div className="text-center p-6">
            <Lock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <p className="text-white font-semibold text-sm mb-1">{feature} is Pro</p>
            <p className="text-purple-300 text-xs mb-4">Upgrade for ₹1 — 7-day full access</p>
            <Button
              size="sm"
              onClick={() => {
                toast(`${feature} is a Pro feature ✨`, {
                  description: "Upgrade to unlock it — ₹1 for 7 days, cancel anytime.",
                  action: { label: "Upgrade →", onClick: () => router.push("/pro") },
                });
                router.push("/pro");
              }}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold text-xs"
            >
              <Crown size={12} className="mr-1.5" /> Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default: show a plain lock card instead of children
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center backdrop-blur-xl">
      <Crown className="h-10 w-10 text-amber-400 mx-auto mb-3" />
      <p className="text-white font-semibold mb-1">{feature} is a Pro feature</p>
      <p className="text-purple-300 text-sm mb-5">
        Upgrade to Pro for ₹1 — get 7 days of full access.
        AI rewriter, AI interviewer, cover letters, and more.
      </p>
      <Button
        onClick={() => router.push("/pro")}
        className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold"
      >
        <Crown size={15} className="mr-2" /> Upgrade for ₹1
      </Button>
    </div>
  );
}
