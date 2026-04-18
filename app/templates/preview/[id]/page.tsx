
// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { resumeTemplates } from "@/data/templates";
// import { ResumeData, RESUME_INITIAL_DATA } from "@/types/resume";
// import Sidebar from "@/components/resume/Sidebar";
// import A4Preview from "@/components/resume/A4Preview";
// import SimpleMeasurementContainer from "@/components/resume/SimpleMeasurementContainer";
// import SmartEditDialog from "@/components/resume/SmartEdit/SmartEditDialog";
// import { useParams, useSearchParams } from "next/navigation";

// interface PageItem {
//   section: string;
//   type: "header" | "item";
//   itemIndex?: number;
// }

// export default function TemplatePreviewPage() {
//   const params       = useParams();
//   const templateId   = params.id as string;
//   const searchParams = useSearchParams();
//   const resumeId     = searchParams.get("resumeId");

//   const template = resumeTemplates.find((t) => t.id === templateId);

//   const [resumeData,    setResumeData]    = React.useState<ResumeData>(RESUME_INITIAL_DATA);
//   // dataLoading: true while fetching from API
//   const [dataLoading,   setDataLoading]   = React.useState(!!resumeId);
//   // paginating: true while SimpleMeasurementContainer is computing pages
//   const [paginating,    setPaginating]    = React.useState(true);

//   const [sectionOrder, setSectionOrder] = React.useState<(keyof ResumeData)[]>([
//     "summary",
//     "skills",
//     "projects",
//     "experience",
//     "education",
//     "achievements",
//     "certifications",
//   ]);

//   const [editingSection, setEditingSection] = React.useState<keyof ResumeData | null>(null);

//   const [pages,       setPages]       = React.useState<PageItem[][]>([]);
//   const [currentPage, setCurrentPage] = React.useState(0);

//   // ── Fetch resume data from API ──
//   React.useEffect(() => {
//     if (!resumeId) {
//       // No resumeId → use initial data, skip fetch, go straight to paginating
//       setDataLoading(false);
//       return;
//     }

//     const fetchResume = async () => {
//       try {
//         const res  = await fetch(`/api/resume/get?resume_id=${resumeId}`);
//         const data = await res.json();

//         if (data.success) {
//           setResumeData(data.resume.content);
//         } else {
//           console.error("Resume fetch error:", data.error);
//         }
//       } catch (err) {
//         console.error("Failed to load resume:", err);
//       } finally {
//         setDataLoading(false); // ← data phase done, measurement can begin
//       }
//     };

//     fetchResume();
//   }, [resumeId]);

//   // ── Section toggle / edit / add helpers ──
//   const toggleSection = (key: keyof ResumeData) => {
//     setResumeData((prev) => ({
//       ...prev,
//       [key]: { ...(prev[key] as any), visible: !(prev[key] as any).visible },
//     }));
//   };

//   const handleEdit     = (k: keyof ResumeData) => setEditingSection(k);

//   const handleSaveEdit = (newData: any) => {
//     if (!editingSection) return;
//     setResumeData((prev) => ({
//       ...prev,
//       [editingSection]: { ...(prev[editingSection] as any), data: newData },
//     }));
//     setEditingSection(null);
//   };

//   const handleAddSection = () => {
//     const newKey = prompt("Enter new section name (e.g. volunteering):");
//     if (!newKey) return;
//     const key = newKey.toLowerCase().replace(/\s+/g, "_");
//     if ((resumeData as any)[key]) { alert("Section already exists"); return; }
//     setResumeData((prev) => ({
//       ...(prev as any),
//       [key]: { visible: true, data: [] },
//     }));
//     setSectionOrder((s) => [...s, key as keyof ResumeData]);
//   };

//   // ── Pagination callback from SimpleMeasurementContainer ──
//   const onPagesComputed = (computedPages: PageItem[][]) => {
//     setPages(computedPages);
//     setCurrentPage((p) => Math.min(p, Math.max(0, computedPages.length - 1)));
//     setPaginating(false);
//   };

//   const currentSections = pages.length ? pages[currentPage] : [];
//   const totalPages      = Math.max(1, pages.length);

//   // ── Template not found ──
//   if (!template) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Template not found</div>
//       </div>
//     );
//   }

//   // ── Loading skeleton while fetching OR while paginating ──
//   const isLoading = dataLoading 
//   const loadingMessage = dataLoading
//     ? "Loading your resume…"
//     : "Calculating pages…";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.45 }}
//         className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6"
//       >
//         {/* Left Sidebar */}
//         <Sidebar
//           resumeData={resumeData}
//           toggleSection={toggleSection}
//           onEdit={handleEdit}
//           onAddSection={handleAddSection}
//           sectionOrder={sectionOrder}
//           setSectionOrder={setSectionOrder}
//           templateId={template.component}
//         />

//         {/* Right — Resume Preview */}
//         <div className="lg:col-span-2 space-y-4">
//           <Card className="border-white/10 bg-white/10 backdrop-blur-xl">
//             <CardContent className="p-4">
//               {/* Header row */}
//               <div className="mb-4 text-center">
//                 <h2 className="text-xl font-semibold text-white mb-2">
//                   {template.name} Preview
//                 </h2>
//                 {isLoading ? (
//                   <p className="text-sm text-purple-300 animate-pulse">
//                     {loadingMessage}
//                   </p>
//                 ) : (
//                   <p className="text-sm text-purple-200">
//                     Page {currentPage + 1} of {totalPages}
//                   </p>
//                 )}
//               </div>

//               {/* Preview area: skeleton while loading, real preview after */}
//               {isLoading ? (
//                 // Skeleton placeholder at the same dimensions as the scaled A4 card
//                 <div
//                   className="mx-auto rounded-md bg-white/10 animate-pulse"
//                   style={{ width: 595, height: 842 }}
//                 />
//               ) : (
//                 <A4Preview
//                   resumeData={resumeData}
//                   sectionKeys={currentSections}
//                   editingSection={editingSection}
//                   onPrev={() => setCurrentPage((p) => Math.max(0, p - 1))}
//                   onNext={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
//                   currentPage={currentPage}
//                   totalPages={totalPages}
//                   templateId={template.component}
//                 />
//               )}
//             </CardContent>
//           </Card>

//           {/* Tip bar */}
//           <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
//             <p className="text-blue-200 text-sm text-center">
//               💡 <strong>Tip:</strong> Use the sidebar to toggle sections,
//               reorder with drag-and-drop, or click edit to modify content.
//               Pages auto-calculate based on content!
//             </p>
//           </div>
//         </div>
//       </motion.div>

//       {/*
//         SimpleMeasurementContainer is mounted ONLY after data is fetched.
//         This prevents it from measuring stale RESUME_INITIAL_DATA.
//         It re-runs automatically whenever resumeData or sectionOrder changes.
//       */}
//       {!dataLoading && (
//         <SimpleMeasurementContainer
//           resumeData={resumeData}
//           sectionOrder={sectionOrder}
//           onPagesComputed={onPagesComputed}
//           templateId={template.component}
//           onCalibrating={setPaginating}
//         />
//       )}

//       {/* Edit Dialog */}
//       <SmartEditDialog
//         section={editingSection ? String(editingSection) : null}
//         data={editingSection ? (resumeData[editingSection] as any).data : null}
//         onSave={handleSaveEdit}
//         onClose={() => setEditingSection(null)}
//       />
//     </div>
//   );
// }


"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { resumeTemplates } from "@/data/templates";
import { ResumeData, RESUME_INITIAL_DATA } from "@/types/resume";
import Sidebar from "@/components/resume/Sidebar";
import A4Preview from "@/components/resume/A4Preview";
import SimpleMeasurementContainer from "@/components/resume/SimpleMeasurementContainer";
import SmartEditDialog from "@/components/resume/SmartEdit/SmartEditDialog";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Crown } from "lucide-react";

interface PageItem {
  section: string;
  type: "header" | "item";
  itemIndex?: number;
}

export default function TemplatePreviewPage() {
  const params       = useParams();
  const templateId   = params.id as string;
  const searchParams = useSearchParams();
  const resumeId     = searchParams.get("resumeId");
  const { data: session } = useSession();

  const isPro = (session?.user as any)?.plan === "PRO";

  const template = resumeTemplates.find((t) => t.id === templateId);

  const [resumeData,    setResumeData]    = React.useState<ResumeData>(RESUME_INITIAL_DATA);
  const [dataLoading,   setDataLoading]   = React.useState(!!resumeId);
  const [paginating,    setPaginating]    = React.useState(true);
  const [aiRewriting,   setAiRewriting]   = React.useState<string | null>(null); // which section is being rewritten

  const [sectionOrder, setSectionOrder] = React.useState<(keyof ResumeData)[]>([
    "summary",
    "skills",
    "projects",
    "experience",
    "education",
    "achievements",
    "certifications",
  ]);

  const [editingSection, setEditingSection] = React.useState<keyof ResumeData | null>(null);

  const [pages,       setPages]       = React.useState<PageItem[][]>([]);
  const [currentPage, setCurrentPage] = React.useState(0);

  // ── Fetch resume data from API ──
  React.useEffect(() => {
    if (!resumeId) {
      setDataLoading(false);
      return;
    }

    const fetchResume = async () => {
      try {
        const res  = await fetch(`/api/resume/get?resume_id=${resumeId}`);
        const data = await res.json();
        if (data.success) {
          setResumeData(data.resume.content);
        } else {
          console.error("Resume fetch error:", data.error);
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  // ── Section toggle / edit / add helpers ──
  const toggleSection = (key: keyof ResumeData) => {
    setResumeData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as any), visible: !(prev[key] as any).visible },
    }));
  };

  const handleEdit     = (k: keyof ResumeData) => setEditingSection(k);

  const handleSaveEdit = (newData: any) => {
    if (!editingSection) return;
    setResumeData((prev) => ({
      ...prev,
      [editingSection]: { ...(prev[editingSection] as any), data: newData },
    }));
    setEditingSection(null);
  };

  const handleAddSection = () => {
    const newKey = prompt("Enter new section name (e.g. volunteering):");
    if (!newKey) return;
    const key = newKey.toLowerCase().replace(/\s+/g, "_");
    if ((resumeData as any)[key]) { alert("Section already exists"); return; }
    setResumeData((prev) => ({
      ...(prev as any),
      [key]: { visible: true, data: [] },
    }));
    setSectionOrder((s) => [...s, key as keyof ResumeData]);
  };

  // ── AI Rewrite handler ──
  const handleAiRewrite = async (section: keyof ResumeData) => {
    if (!isPro) {
      toast("✨ AI rewrite is a Pro feature", {
        description: "Upgrade to Pro to rewrite any section with AI — keyword-optimized for your JD.",
        action: {
          label: "Upgrade →",
          onClick: () => window.location.href = "/pro",
        },
        duration: 5000,
      });
      return;
    }

    setAiRewriting(String(section));
    const tid = toast.loading(`Rewriting ${section} with AI…`);

    try {
      const sectionData = (resumeData[section] as any)?.data;
      const res = await fetch("/api/resume/ai-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, sectionData, resumeId }),
      });

      const json = await res.json();

      if (json.success && json.rewritten) {
        setResumeData((prev) => ({
          ...prev,
          [section]: { ...(prev[section] as any), data: json.rewritten },
        }));
        toast.success(`${section} rewritten successfully!`, { id: tid });
      } else {
        toast.error("Rewrite failed. Try again.", { id: tid });
      }
    } catch {
      toast.error("Rewrite failed. Try again.", { id: tid });
    } finally {
      setAiRewriting(null);
    }
  };

  // ── Pagination callback ──
  const onPagesComputed = (computedPages: PageItem[][]) => {
    setPages(computedPages);
    setCurrentPage((p) => Math.min(p, Math.max(0, computedPages.length - 1)));
    setPaginating(false);
  };

  const currentSections = pages.length ? pages[currentPage] : [];
  const totalPages      = Math.max(1, pages.length);

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Template not found</div>
      </div>
    );
  }

  const isLoading = dataLoading;
  const loadingMessage = dataLoading ? "Loading your resume…" : "Calculating pages…";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6"
      >
        {/* Left Sidebar */}
        <Sidebar
          resumeData={resumeData}
          toggleSection={toggleSection}
          onEdit={handleEdit}
          onAddSection={handleAddSection}
          sectionOrder={sectionOrder}
          setSectionOrder={setSectionOrder}
          templateId={template.component}
          isPro={isPro}
          onAiRewrite={handleAiRewrite}
          aiRewriting={aiRewriting}
        />

        {/* Right — Resume Preview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pro banner for free users */}
          {!isPro && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-400" />
                <span className="text-amber-200 text-sm font-medium">
                  Upgrade to Pro — AI rewrite, cover letters, AI interviewer & more
                </span>
              </div>
              <button
                onClick={() => window.location.href = "/pro"}
                className="text-xs font-semibold text-amber-900 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition"
              >
                See Plans
              </button>
            </motion.div>
          )}

          <Card className="border-white/10 bg-white/10 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {template.name} Preview
                </h2>
                {isLoading ? (
                  <p className="text-sm text-purple-300 animate-pulse">{loadingMessage}</p>
                ) : (
                  <p className="text-sm text-purple-200">
                    Page {currentPage + 1} of {totalPages}
                  </p>
                )}
              </div>

              {isLoading ? (
                <div
                  className="mx-auto rounded-md bg-white/10 animate-pulse"
                  style={{ width: 595, height: 842 }}
                />
              ) : (
                <A4Preview
                  resumeData={resumeData}
                  sectionKeys={currentSections}
                  editingSection={editingSection}
                  onPrev={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  onNext={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  templateId={template.component}
                />
              )}
            </CardContent>
          </Card>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-blue-200 text-sm text-center">
              💡 <strong>Tip:</strong> Use the sidebar to toggle sections,
              reorder with drag-and-drop, or click ✏️ to edit content.
              Click ✨ on any section to rewrite it with AI (Pro).
            </p>
          </div>
        </div>
      </motion.div>

      {!dataLoading && (
        <SimpleMeasurementContainer
          resumeData={resumeData}
          sectionOrder={sectionOrder}
          onPagesComputed={onPagesComputed}
          templateId={template.component}
          onCalibrating={setPaginating}
        />
      )}

      <SmartEditDialog
        section={editingSection ? String(editingSection) : null}
        data={editingSection ? (resumeData[editingSection] as any).data : null}
        onSave={handleSaveEdit}
        onClose={() => setEditingSection(null)}
      />
    </div>
  );
}
