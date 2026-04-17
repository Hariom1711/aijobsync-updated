
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
// import { useParams } from "next/navigation";
// import { useSearchParams } from "next/navigation";

// interface PageItem {
//   section: string;
//   type: "header" | "item";
//   itemIndex?: number;
// }

// export default function TemplatePreviewPage() {
//   const params = useParams();
//   const templateId = params.id as string;
//   const searchParams = useSearchParams();
//   const resumeId = searchParams.get("resumeId");

//   // Find the selected template
//   const template = resumeTemplates.find((t) => t.id === templateId);

//   const [resumeData, setResumeData] = React.useState<ResumeData>(RESUME_INITIAL_DATA);
//   const [loading, setLoading] = React.useState(true);

//   const [sectionOrder, setSectionOrder] = React.useState<(keyof ResumeData)[]>([
//     "summary",
//     "skills",
//     "projects",
//     "experience",
//     "education",
//     "achievements",
//     "certifications",
//   ]);

//   const [editingSection, setEditingSection] = React.useState<
//     keyof ResumeData | null
//   >(null);

//   // Pages computed by SimpleMeasurementContainer
//   const [pages, setPages] = React.useState<PageItem[][]>([]);
//   const [currentPage, setCurrentPage] = React.useState(0);

//   React.useEffect(() => {
//     if (!resumeId) return;

//     const fetchResume = async () => {
//       try {
//         const res = await fetch(`/api/resume/get?resume_id=${resumeId}`);
//         const data = await res.json();

//         if (data.success) {
//           setResumeData(data.resume.content);
//         } else {
//           console.error(data.error);
//         }
//       } catch (err) {
//         console.error("Failed to load resume", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResume();
//   }, [resumeId]);

//   // Section visibility toggle
//   const toggleSection = (key: keyof ResumeData) => {
//     setResumeData((prev) => ({
//       ...prev,
//       [key]: { ...(prev[key] as any), visible: !(prev[key] as any).visible },
//     }));
//   };

//   // Edit section handler
//   const handleEdit = (k: keyof ResumeData) => {
//     setEditingSection(k);
//   };

//   // Save edited section
//   const handleSaveEdit = (newData: any) => {
//     if (!editingSection) return;
//     setResumeData((prev) => ({
//       ...prev,
//       [editingSection]: { ...(prev[editingSection] as any), data: newData },
//     }));
//     setEditingSection(null);
//   };

//   // Add new section
//   const handleAddSection = () => {
//     const newKey = prompt("Enter new section name (e.g. volunteering):");
//     if (!newKey) return;

//     const key = newKey.toLowerCase().replace(/\s+/g, "_");
//     if ((resumeData as any)[key]) {
//       alert("Section already exists");
//       return;
//     }

//     setResumeData((prev) => ({
//       ...(prev as any),
//       [key]: { visible: true, data: [] },
//     }));
//     setSectionOrder((s) => [...s, key as keyof ResumeData]);
//   };

//   // Pages computed callback from SimpleMeasurementContainer
//   const onPagesComputed = (computedPages: PageItem[][]) => {
//     setPages(computedPages);
//     setCurrentPage((p) => Math.min(p, Math.max(0, computedPages.length - 1)));
//   };

//   // Get sections for current page
//   const currentSections = pages.length ? pages[currentPage] : [];

//   // Template not found
//   if (!template) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
//         <div className="text-white text-xl">Template not found</div>
//       </div>
//     );
//   }

//   if (loading || !resumeData ||resumeId) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45 }}
//           className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6"
//         >
//           {/* Left Sidebar - Section Controls */}
//           <Sidebar
//             resumeData={resumeData}
//             toggleSection={toggleSection}
//             onEdit={handleEdit}
//             onAddSection={handleAddSection}
//             sectionOrder={sectionOrder}
//             setSectionOrder={setSectionOrder}
//           />

//           {/* Right Side - Resume Preview */}
//           <div className="lg:col-span-2 space-y-4">
//             <Card className="border-white/10 bg-white/10 backdrop-blur-xl">
//               <CardContent className="p-4">
//                 {/* Page Counter */}
//                 <div className="mb-4 text-center">
//                   <h2 className="text-xl font-semibold text-white mb-2">
//                     {template.name} Preview
//                   </h2>
//                   <p className="text-sm text-purple-200">
//                     Page {currentPage + 1} of {Math.max(1, pages.length - 1)}
//                   </p>
//                 </div>

//                 {/* A4 Preview with Navigation */}
//                 <A4Preview
//                   resumeData={resumeData}
//                   sectionKeys={currentSections}
//                   editingSection={editingSection}
//                   onPrev={() => setCurrentPage((p) => Math.max(0, p - 1))}
//                   onNext={() =>
//                     setCurrentPage((p) => Math.min(pages.length - 1, p + 1))
//                   }
//                   currentPage={currentPage}
//                   totalPages={Math.max(1, pages.length - 1 || 1)}
//                   templateId={template?.component}
//                 />
//               </CardContent>
//             </Card>

//             {/* Tips */}
//             <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
//               <p className="text-blue-200 text-sm text-center">
//                 💡 <strong>Tip:</strong> Use sidebar to toggle sections, reorder
//                 with drag-and-drop, or click edit to modify content. Pages
//                 auto-calculate based on content!
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Hidden Measurement Container - Calculates Pagination */}
//         <SimpleMeasurementContainer
//           resumeData={resumeData}
//           sectionOrder={sectionOrder}
//           onPagesComputed={onPagesComputed}
//           templateId={template?.component}
//         />

//         {/* Edit Dialog */}
//         <SmartEditDialog
//           section={editingSection ? String(editingSection) : null}
//           data={
//             editingSection ? (resumeData[editingSection] as any).data : null
//           }
//           onSave={handleSaveEdit}
//           onClose={() => setEditingSection(null)}
//         />
//       </div>
//     );
//   }
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

  const template = resumeTemplates.find((t) => t.id === templateId);

  const [resumeData,    setResumeData]    = React.useState<ResumeData>(RESUME_INITIAL_DATA);
  // dataLoading: true while fetching from API
  const [dataLoading,   setDataLoading]   = React.useState(!!resumeId);
  // paginating: true while SimpleMeasurementContainer is computing pages
  const [paginating,    setPaginating]    = React.useState(true);

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
      // No resumeId → use initial data, skip fetch, go straight to paginating
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
        setDataLoading(false); // ← data phase done, measurement can begin
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

  // ── Pagination callback from SimpleMeasurementContainer ──
  const onPagesComputed = (computedPages: PageItem[][]) => {
    setPages(computedPages);
    setCurrentPage((p) => Math.min(p, Math.max(0, computedPages.length - 1)));
    setPaginating(false);
  };

  const currentSections = pages.length ? pages[currentPage] : [];
  const totalPages      = Math.max(1, pages.length);

  // ── Template not found ──
  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Template not found</div>
      </div>
    );
  }

  // ── Loading skeleton while fetching OR while paginating ──
  const isLoading = dataLoading 
  const loadingMessage = dataLoading
    ? "Loading your resume…"
    : "Calculating pages…";

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
        />

        {/* Right — Resume Preview */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-white/10 bg-white/10 backdrop-blur-xl">
            <CardContent className="p-4">
              {/* Header row */}
              <div className="mb-4 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {template.name} Preview
                </h2>
                {isLoading ? (
                  <p className="text-sm text-purple-300 animate-pulse">
                    {loadingMessage}
                  </p>
                ) : (
                  <p className="text-sm text-purple-200">
                    Page {currentPage + 1} of {totalPages}
                  </p>
                )}
              </div>

              {/* Preview area: skeleton while loading, real preview after */}
              {isLoading ? (
                // Skeleton placeholder at the same dimensions as the scaled A4 card
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

          {/* Tip bar */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-blue-200 text-sm text-center">
              💡 <strong>Tip:</strong> Use the sidebar to toggle sections,
              reorder with drag-and-drop, or click edit to modify content.
              Pages auto-calculate based on content!
            </p>
          </div>
        </div>
      </motion.div>

      {/*
        SimpleMeasurementContainer is mounted ONLY after data is fetched.
        This prevents it from measuring stale RESUME_INITIAL_DATA.
        It re-runs automatically whenever resumeData or sectionOrder changes.
      */}
      {!dataLoading && (
        <SimpleMeasurementContainer
          resumeData={resumeData}
          sectionOrder={sectionOrder}
          onPagesComputed={onPagesComputed}
          templateId={template.component}
          onCalibrating={setPaginating}
        />
      )}

      {/* Edit Dialog */}
      <SmartEditDialog
        section={editingSection ? String(editingSection) : null}
        data={editingSection ? (resumeData[editingSection] as any).data : null}
        onSave={handleSaveEdit}
        onClose={() => setEditingSection(null)}
      />
    </div>
  );
}