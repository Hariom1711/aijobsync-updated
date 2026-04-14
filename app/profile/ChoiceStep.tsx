// /* eslint-disable @typescript-eslint/no-explicit-any */

// // components/profile/ChoiceStep.tsx

// import React from "react";
// import {
//   Sparkles,
//   Upload,
//   Edit3,
//   Check,
//   ChevronRight,
//   Target,
//   Star,
//   ShieldCheck,
//   Loader2,
// } from "lucide-react";

// interface ChoiceStepProps {
//   onMethodSelect: (method: "linkedin" | "manual") => void;
//   onLinkedInUpload?: (file: File) => Promise<void>;
//   importing?: boolean; // ADD THIS
// }

// export const ChoiceStep: React.FC<ChoiceStepProps> = ({
//   onMethodSelect,
//   onLinkedInUpload,
//   importing = false, // ADD THIS
// }) => {
//   const fileRef = React.useRef<HTMLInputElement>(null);

//   const [uploading, setUploading] = React.useState(false);

//   return (
//     <div className="space-y-10 max-w-6xl mx-auto">
//       {/* Hero Section */}
//       <div className="text-center space-y-4">
//         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-xl mb-4">
//           <Sparkles className="w-4 h-4 text-purple-300" />
//           <span className="text-purple-200 text-sm font-semibold">
//             Your Secret Weapon to Beat ATS
//           </span>
//         </div>

//         <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
//           Build Your{" "}
//           <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
//             Master Profile
//           </span>
//         </h1>

//         <p className="text-purple-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
//           Create it once. Use it forever. Generate perfectly tailored,
//           ATS-optimized resumes for every job in seconds—not hours.
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
//         <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
//           <div className="text-3xl font-black text-white mb-1">95%</div>
//           <div className="text-purple-300 text-sm">ATS Pass Rate</div>
//         </div>
//         <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
//           <div className="text-3xl font-black text-white mb-1">10x</div>
//           <div className="text-purple-300 text-sm">Faster Creation</div>
//         </div>
//         <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
//           <div className="text-3xl font-black text-white mb-1">100+</div>
//           <div className="text-purple-300 text-sm">Jobs Applied</div>
//         </div>
//       </div>

//       {/* What is Master Profile */}
//       <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20">
//         <div className="flex items-start gap-4">
//           <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
//             <Target className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-white mb-2">
//               What&apos;s a Master Profile?
//             </h3>
//             <p className="text-purple-200 leading-relaxed mb-3">
//               Think of it as your{" "}
//               <span className="text-white font-semibold">
//                 complete professional DNA
//               </span>
//               . Store ALL your education, experience, projects, skills, and
//               achievements in one place. Our AI then cherry-picks and tailors
//               the perfect match for each job description.
//             </p>
//             <div className="flex flex-wrap gap-2">
//               <span className="px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-200 text-sm">
//                 ✨ No more copy-pasting
//               </span>
//               <span className="px-3 py-1 rounded-lg bg-pink-500/20 border border-pink-400/30 text-pink-200 text-sm">
//                 🎯 Perfect keyword matching
//               </span>
//               <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-sm">
//                 🚀 Apply to 10+ jobs daily
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Choice Cards */}
//       <div className="pt-6">
//         <h2 className="text-2xl font-black text-white text-center mb-6">
//           Choose Your Setup Method
//         </h2>

//         <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
//           <div
//             // onClick={() => onMethodSelect("linkedin")}
//             className="group cursor-pointer relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl p-8 hover:border-purple-400 hover:scale-105 transition-all duration-300"
//           >
//             <div className="absolute -top-6 -right-6 px-4 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-full rotate-45 shadow-lg">
//               FASTEST
//             </div>
//             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/50 transition-all" />
//             <div className="relative z-10">
//               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                 <Upload className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-2xl font-black text-white mb-2">
//                 Import from LinkedIn
//               </h3>
//               <p className="text-purple-200 mb-4">
//                 ⚡ Quick & Easy • 2 minutes
//               </p>
//               <ul className="space-y-2 text-purple-100 text-sm mb-6">
//                 <li className="flex items-center gap-2">
//                   <Check className="w-4 h-4 text-green-400" />
//                   Upload LinkedIn PDF
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Check className="w-4 h-4 text-green-400" />
//                   AI extracts everything
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Check className="w-4 h-4 text-green-400" />
//                   Review & edit after
//                 </li>
//               </ul>
//               <div className="mt-6 flex items-center text-white font-semibold group-hover:gap-3 gap-2 transition-all">
//                 Start Import <ChevronRight className="w-5 h-5" />
//                 <input
//                   type="file"
//                   accept="application/pdf"
//                   onChange={async (e) => {
//                     const f = e.target.files?.[0];
//                     if (f && onLinkedInUpload) {
//                       setUploading(true);
//                       await onLinkedInUpload(f);
//                       setUploading(false);
//                     }
//                   }}
//                   className="hidden"
//                   id="linkedin-upload"
//                   disabled={uploading || importing}
//                 />
//                 <label
//                   htmlFor="linkedin-upload"
//                   className={`cursor-pointer inline-flex items-center gap-2 ${
//                     uploading || importing
//                       ? "opacity-50 cursor-not-allowed"
//                       : ""
//                   }`}
//                 >
//                   {uploading || importing ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Uploading...
//                     </>
//                   ) : (
//                     <label>
//                       Upload LinkedIn PDF
//                       <ChevronRight className="w-5 h-5" />
//                     </label>
//                   )}
//                 </label>
//               </div>
//             </div>
//           </div>

//           <div
//             onClick={() => onMethodSelect("manual")}
//             className="group cursor-pointer relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl p-8 hover:border-pink-400 hover:scale-105 transition-all duration-300"
//           >
//             <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl group-hover:bg-pink-500/50 transition-all" />
//             <div className="relative z-10">
//               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                 <Edit3 className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-2xl font-black text-white mb-2">
//                 Fill Manually
//               </h3>
//               <p className="text-purple-200 mb-4">
//                 ✍️ Complete Control • 10 minutes
//               </p>
//               <ul className="space-y-2 text-purple-100 text-sm mb-6">
//                 <li className="flex items-center gap-2">
//                   <Check className="w-4 h-4 text-green-400" />
//                   Step-by-step guided form
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Check className="w-4 h-4 text-green-400" />
//                   Add as much detail as you want
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Check className="w-4 h-4 text-green-400" />
//                   Auto-saves your progress
//                 </li>
//               </ul>
//               <div className="mt-6 flex items-center text-white font-semibold group-hover:gap-3 gap-2 transition-all">
//                 Start Building <ChevronRight className="w-5 h-5" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Benefits Grid */}
//       <div className="grid md:grid-cols-3 gap-4">
//         <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
//           <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
//             <Check className="w-5 h-5 text-emerald-400" />
//           </div>
//           <h4 className="text-white font-bold mb-2">Smart Tailoring</h4>
//           <p className="text-purple-300 text-sm">
//             AI analyzes job requirements and highlights your most relevant
//             experience automatically.
//           </p>
//         </div>

//         <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
//           <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
//             <Sparkles className="w-5 h-5 text-purple-400" />
//           </div>
//           <h4 className="text-white font-bold mb-2">Version Control</h4>
//           <p className="text-purple-300 text-sm">
//             Track every resume version. Know exactly what you sent to which
//             company.
//           </p>
//         </div>

//         <div className="p-5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
//           <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-3">
//             <Star className="w-5 h-5 text-pink-400" />
//           </div>
//           <h4 className="text-white font-bold mb-2">Always Updated</h4>
//           <p className="text-purple-300 text-sm">
//             Add new skills or projects once. They&apos;re available for all future
//             resumes instantly.
//           </p>
//         </div>
//       </div>

//       {/* Bottom CTA */}
//       <div className="text-center space-y-3">
//         <div className="flex items-center justify-center gap-2 text-purple-300 text-sm">
//           <ShieldCheck className="w-4 h-4 text-emerald-400" />
//           <span>Your data is encrypted and never shared</span>
//         </div>
//         <p className="text-purple-300 text-sm">
//           💡 <span className="text-white font-semibold">Pro tip:</span> Import
//           from LinkedIn, then add extra details manually for the best results
//         </p>
//       </div>
//     </div>
//   );
// };

import React from "react";
import {
  Sparkles,
  Upload,
  Edit3,
  Check,
  ChevronRight,
  Target,
  Star,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface ChoiceStepProps {
  onMethodSelect: (method: "linkedin" | "manual") => void;
  onLinkedInUpload?: (file: File) => Promise<void>;
  importing?: boolean;
}

export const ChoiceStep: React.FC<ChoiceStepProps> = ({
  onMethodSelect,
  onLinkedInUpload,
  importing = false,
}) => {
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !onLinkedInUpload) return;

    try {
      setUploading(true);
      await onLinkedInUpload(file);
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-uploading same file
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-xl mb-4">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="text-purple-200 text-sm font-semibold">
            Your Secret Weapon to Beat ATS
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
          Build Your{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Master Profile
          </span>
        </h1>

        <p className="text-purple-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Create it once. Use it forever. Generate perfectly tailored,
          ATS-optimized resumes for every job in seconds—not hours.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
        {[
          { value: "95%", label: "ATS Pass Rate" },
          { value: "10x", label: "Faster Creation" },
          { value: "100+", label: "Jobs Applied" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10"
          >
            <div className="text-3xl font-black text-white mb-1">
              {stat.value}
            </div>
            <div className="text-purple-300 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* What is Master Profile */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              What&apos;s a Master Profile?
            </h3>
            <p className="text-purple-200 leading-relaxed mb-3">
              Think of it as your{" "}
              <span className="text-white font-semibold">
                complete professional DNA
              </span>
              . Store ALL your education, experience, projects, skills, and
              achievements in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Choice Cards */}
      <div>
        <h2 className="text-2xl font-black text-white text-center mb-6">
          Choose Your Setup Method
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* LinkedIn Import */}
          <div
            onClick={() => {
              if (!uploading && !importing) {
                fileRef.current?.click();
              }
            }}
            className={`group cursor-pointer relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl p-8 transition-all duration-300 ${
              uploading || importing
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-purple-400 hover:scale-105"
            }`}
          >
            <div className="absolute -top-6 -right-6 px-4 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-full rotate-45">
              FASTEST
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                Import from LinkedIn
              </h3>

              <ul className="space-y-2 text-purple-100 text-sm mb-6">
                {[
                  "Upload LinkedIn PDF",
                  "AI extracts everything",
                  "Review & edit after",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    {text}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 font-semibold text-white">
                {uploading || importing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload LinkedIn PDF
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              hidden
              disabled={uploading || importing}
              onChange={handleFileSelect}
            />
          </div>

          {/* Manual */}
          <div
            onClick={() => onMethodSelect("manual")}
            className="group cursor-pointer relative overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-xl p-8 hover:border-pink-400 hover:scale-105 transition-all duration-300"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-4">
                <Edit3 className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-black text-white mb-2">
                Fill Manually
              </h3>

              <ul className="space-y-2 text-purple-100 text-sm mb-6">
                {[
                  "Step-by-step guided form",
                  "Add as much detail as you want",
                  "Auto-saves progress",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    {text}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 font-semibold text-white">
                Start Building <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-purple-300 text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Your data is encrypted and never shared</span>
        </div>

        <p className="text-purple-300 text-sm">
          💡 <span className="text-white font-semibold">Pro tip:</span> Import
          from LinkedIn, then refine manually
        </p>
      </div>
    </div>
  );
};
