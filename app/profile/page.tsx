

// Updated ProfileWizard.tsx with Dashboard View

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
  Loader2,
  CheckCircle,
  Edit3,
  Plus,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { FormData, Step } from "@/types/profileWizard";
import { ChoiceStep } from "./ChoiceStep";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { EducationStep } from "./EducationStep";
import { SkillsStep } from "./SkillsStep";
import { ExperienceStep } from "./ExperienceStep";
import { ProjectsStep } from "./ProjectStep";
import CertsAchievementsStep from "./ExtraStep";
import { useMasterProfile } from "@/hooks/useMasterProfile";

// ============================================
// DASHBOARD SECTION CARD COMPONENT
// ============================================
const SectionCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  itemCount: number;
  isEmpty: boolean;
  onEdit: () => void;
  preview?: React.ReactNode;
}> = ({
  icon: Icon,
  title,
  description,
  itemCount,
  isEmpty,
  onEdit,
  preview,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onEdit}
      className="group cursor-pointer p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl hover:border-purple-400 hover:bg-white/15 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-purple-300 text-sm">{description}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <Edit3 className="w-5 h-5 text-purple-300" />
        </button>
      </div>

      {isEmpty ? (
        <div className="py-6 text-center border-2 border-dashed border-white/20 rounded-xl">
          <Plus className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-purple-300 text-sm">
            No {title.toLowerCase()} added yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-purple-200 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>
              {itemCount} {itemCount === 1 ? "item" : "items"} added
            </span>
          </div>
          {preview && <div className="text-sm text-purple-200">{preview}</div>}
        </div>
      )}

      <div className="mt-4 flex items-center text-purple-300 text-sm group-hover:text-white transition-colors">
        <span>Click to view/edit</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

// ============================================
// ANIMATED DRAWER COMPONENT
// ============================================
const EditDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  saving: boolean;
}> = ({ isOpen, onClose, title, children, onSave, saving }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={(e) => {
              e.stopPropagation();
              // prevent closing on backdrop click to avoid accidental loss
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[700px] lg:w-[800px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl z-50 overflow-hidden"
          >
            {/* Glowing effects in drawer */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/20 bg-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white">{title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-[calc(100vh-5rem)] overflow-y-auto p-6 custom-scrollbar">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
// Loading Overlay Component
const ImportingOverlay: React.FC<{ message: string }> = ({ message }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl max-w-md mx-4"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin" />
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Processing Your Profile</h3>
            <p className="text-purple-300">{message}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);
// ============================================
// MAIN PROFILE WIZARD COMPONENT
// ============================================
const ProfileWizard: React.FC = () => {
  const [viewMode, setViewMode] = useState<"dashboard" | "wizard">("wizard");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [importMethod, setImportMethod] = useState<
    "linkedin" | "manual" | null
  >(null);
  const [autoSaveMsg, setAutoSaveMsg] = useState("");
  const [importing, setImporting] = useState(false);
  const [preImportSnapshot, setPreImportSnapshot] = useState<FormData | null>(
    null
  );

  const { profile, loading, saving, saveProfile, toFormData } =
    useMasterProfile();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    education: [],
    experience: [],
    projects: [],
    coreSkills: {},
    softSkills: [],
    tools: [],
    certifications: [],
    achievements: [],
    codingProfiles: [],
    languages: [],
  });

  const steps: Step[] = [
    {
      id: "choice",
      title: "Get Started",
      icon: Sparkles,
      desc: "Choose your method",
    },
    {
      id: "personal",
      title: "Personal Info",
      icon: User,
      desc: "Basic details",
    },
    {
      id: "education",
      title: "Education",
      icon: GraduationCap,
      desc: "Academic background",
    },
    {
      id: "experience",
      title: "Experience",
      icon: Briefcase,
      desc: "Work history",
    },
    { id: "projects", title: "Projects", icon: Code, desc: "Your work" },
    {
      id: "skills",
      title: "Skills",
      icon: Star,
      desc: "Technical & soft skills",
    },
    {
      id: "extras",
      title: "Extras",
      icon: Trophy,
      desc: "Certs & achievements",
    },
  ];

  // move updateField above handlers that use it
  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle method select -> set method into formData and advance
  const handleMethodSelect = (method: "linkedin" | "manual") => {
    setImportMethod(method);
    updateField(
      "linkedin" as any,
      method === "linkedin" ? "" : formData.linkedin
    ); // keep placeholder
    handleNext();
  };

  // ✅ Load profile data when fetched and determine view mode
  useEffect(() => {
    if (profile) {
      const formDataFromProfile = toFormData();
      if (formDataFromProfile) {
        setFormData(formDataFromProfile);
        // Check if profile has substantial data
        const hasData =
          !!formDataFromProfile.fullName ||
          (formDataFromProfile.education &&
            formDataFromProfile.education.length > 0) ||
          (formDataFromProfile.experience &&
            formDataFromProfile.experience.length > 0);

        if (hasData) {
          setViewMode("dashboard");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // ✅ Auto-save with debounce (only in wizard mode, not when drawer is open)
  useEffect(() => {
    if (
      viewMode === "dashboard" ||
      editingSection !== null ||
      currentStep === 0
    )
      return;
    if (!formData || Object.keys(formData).length === 0) return;

    const timeout = setTimeout(async () => {
      const result = await saveProfile(formData);
      if (result.success) {
        setAutoSaveMsg("All changes saved");
        setTimeout(() => setAutoSaveMsg(""), 2500);
      } else {
        setAutoSaveMsg("Failed to save");
      }
    }, 10000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, currentStep, viewMode, editingSection]);

  // disable page scroll when drawer is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight || "";

    if (editingSection) {
      // compute scrollbar width to avoid layout shift when hiding scrollbar
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "";
      document.body.style.paddingRight = originalPaddingRight || "";
    }

    return () => {
      // cleanup (in case component unmounts while drawer open)
      document.body.style.overflow = originalOverflow || "";
      document.body.style.paddingRight = originalPaddingRight || "";
    };
  }, [editingSection]);

  // Helper to get section info for dashboard
  const getSectionInfo = (sectionId: string) => {
    switch (sectionId) {
      case "personal":
        return {
          isEmpty: !formData.fullName,
          count: 1,
          preview: formData.fullName && (
            <div className="space-y-1">
              <p className="font-semibold text-white">{formData.fullName}</p>
              {formData.email && (
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-3 h-3" />
                  {formData.email}
                </div>
              )}
              {formData.phone && (
                <div className="flex items-center gap-2 text-xs">
                  <Phone className="w-3 h-3" />
                  {formData.phone}
                </div>
              )}
            </div>
          ),
        };
      case "education":
        return {
          isEmpty: !formData.education || formData.education.length === 0,
          count: formData.education ? formData.education.length : 0,
          preview:
            formData.education && formData.education[0] ? (
              <div>
                <p className="font-semibold text-white">
                  {formData.education[0].degree}
                </p>
                <p className="text-xs">{formData.education[0].institution}</p>
              </div>
            ) : null,
        };
      case "experience":
        return {
          isEmpty: !formData.experience || formData.experience.length === 0,
          count: formData.experience ? formData.experience.length : 0,
          preview:
            formData.experience && formData.experience[0] ? (
              <div>
                <p className="font-semibold text-white">
                  {formData.experience[0].title}
                </p>
                <p className="text-xs">{formData.experience[0].company}</p>
              </div>
            ) : null,
        };
      case "projects":
        return {
          isEmpty: !formData.projects || formData.projects.length === 0,
          count: formData.projects ? formData.projects.length : 0,
          preview:
            formData.projects && formData.projects[0] ? (
              <p className="font-semibold text-white">
                {formData.projects[0].name}
              </p>
            ) : null,
        };
      case "skills":
        const skillCount =
          (formData.coreSkills
            ? Object.keys(formData.coreSkills).reduce(
                (acc, k) => acc + (formData.coreSkills[k]?.length || 0),
                0
              )
            : 0) +
          (formData.softSkills ? formData.softSkills.length : 0) +
          (formData.tools ? formData.tools.length : 0);
        return {
          isEmpty: skillCount === 0,
          count: skillCount,
          preview:
            formData.coreSkills &&
            Object.keys(formData.coreSkills).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(formData.coreSkills)
                  .slice(0, 2)
                  .map(([category, skills]) => (
                    <span
                      key={category}
                      className="px-2 py-1 rounded-lg bg-purple-500/20 text-xs"
                    >
                      {category}: {Array.isArray(skills) ? skills.length : 0}
                    </span>
                  ))}
              </div>
            ) : null,
        };
      case "extras":
        const extrasCount =
          (formData.certifications ? formData.certifications.length : 0) +
          (formData.achievements ? formData.achievements.length : 0);
        return {
          isEmpty: extrasCount === 0,
          count: extrasCount,
          preview:
            formData.certifications && formData.certifications[0] ? (
              <p className="text-xs">{formData.certifications[0].name}</p>
            ) : null,
        };
      default:
        return { isEmpty: true, count: 0, preview: null };
    }
  };

  const sections = steps.slice(1).map((step) => ({
    ...step,
    ...getSectionInfo(step.id),
  }));

  const completeness = Math.round(
    (sections.filter((s) => !s.isEmpty).length / sections.length) * 100
  );
  const progress = (currentStep / (steps.length - 1)) * 100;

  // Handle saving from drawer
  const handleSaveSection = async () => {
    const result = await saveProfile(formData);
    if (result.success) {
      setAutoSaveMsg("Changes saved successfully");
      setTimeout(() => {
        setAutoSaveMsg("");
        setEditingSection(null);
      }, 1500);
    } else {
      setAutoSaveMsg("Failed to save changes");
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Save and switch to dashboard
      saveProfile(formData);
      setViewMode("dashboard");
      setCurrentStep(0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const addArrayItem = <K extends keyof FormData>(field: K, item: any) => {
    const current = formData[field];
    if (Array.isArray(current)) {
      setFormData({ ...formData, [field]: [...current, item] });
    }
  };

  const removeArrayItem = <K extends keyof FormData>(
    field: K,
    index: number
  ) => {
    const current = formData[field];
    if (Array.isArray(current)) {
      setFormData({
        ...formData,
        [field]: current.filter((_, i) => i !== index),
      });
    }
  };


  const handleLinkedInUpload = async (file: File) => {
    try {
      setImporting(true);
      setAutoSaveMsg("Uploading PDF...");

      // Create FormData
      const FD: any = (globalThis as any)["FormData"];
      const fd = new FD();
      fd.append("file", file);

      // Upload
      const res = await fetch("/api/profile/import", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();

      if (json.success && json.profile) {
        // Show success message
        setAutoSaveMsg("✅ Import successful! Reviewing data...");

        // Update formData with imported data
        setFormData((prev) => ({
          ...prev,
          ...json.profile,
          // Ensure arrays are properly merged
          education: json.profile.education || prev.education,
          experience: json.profile.experience || prev.experience,
          projects: json.profile.projects || prev.projects,
          certifications: json.profile.certifications || prev.certifications,
          achievements: json.profile.achievements || prev.achievements,
          codingProfiles: json.profile.codingProfiles || prev.codingProfiles,
          languages: json.profile.languages || prev.languages,
        }));

        // Wait 1 second to show success message
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Move to personal info step for review
        setCurrentStep(1); // Personal Info step
        setAutoSaveMsg("Review and edit your imported data");

        // Clear message after 3 seconds
        setTimeout(() => setAutoSaveMsg(""), 3000);
      } else {
        setAutoSaveMsg("❌ Import failed: " + (json.error || "Unknown error"));
        setTimeout(() => setAutoSaveMsg(""), 4000);
      }
    } catch (error) {
      console.error("Import error:", error);
      setAutoSaveMsg("❌ Import failed. Please try again.");
      setTimeout(() => setAutoSaveMsg(""), 4000);
    } finally {
      setImporting(false);
    }
  };
  // console.log(formData, "formdata");

  const renderStep = () => {
    const stepProps = { formData, updateField, addArrayItem, removeArrayItem };

    switch (steps[currentStep].id) {
      case "choice":
        return (
          <ChoiceStep
            onMethodSelect={handleMethodSelect}
            onLinkedInUpload={handleLinkedInUpload}
            importing={importing} // ADD THIS LINE
          />
        );
      case "personal":
        return <PersonalInfoStep {...stepProps} />;
      case "education":
        return <EducationStep {...stepProps} />;
      case "skills":
        return <SkillsStep {...stepProps} />;
      case "experience":
        return <ExperienceStep {...stepProps} />;
      case "projects":
        return <ProjectsStep {...stepProps} />;
      case "extras":
        return <CertsAchievementsStep {...stepProps} />;
      default:
        return (
          <ChoiceStep
            onMethodSelect={handleMethodSelect}
            onLinkedInUpload={handleLinkedInUpload}
            importing={importing} // ADD THIS LINE
          />
        );
    }
  };

  const renderDrawerContent = () => {
    const stepProps = { formData, updateField, addArrayItem, removeArrayItem };

    switch (editingSection) {
      case "personal":
        return <PersonalInfoStep {...stepProps} />;
      case "education":
        return <EducationStep {...stepProps} />;
      case "skills":
        return <SkillsStep {...stepProps} />;
      case "experience":
        return <ExperienceStep {...stepProps} />;
      case "projects":
        return <ProjectsStep {...stepProps} />;
      case "extras":
        return <CertsAchievementsStep {...stepProps} />;
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-12 -left-12 w-[30rem] h-[30rem] bg-purple-500/30 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
          <div className="absolute -bottom-16 right-0 w-[28rem] h-[28rem] bg-pink-500/25 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
        </div>
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="flex items-center gap-3 text-white text-lg">
            <Loader2 className="animate-spin h-8 w-8" />
            <span>Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // DASHBOARD VIEW
  // ============================================
  if (viewMode === "dashboard") {
    return (
      <>
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Glowing blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-12 -left-12 w-[30rem] h-[30rem] bg-purple-500/30 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
            <div className="absolute -bottom-16 right-0 w-[28rem] h-[28rem] bg-pink-500/25 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
          </div>

          {/* Header */}
          <div className="relative z-10 border-b border-white/10 backdrop-blur-sm bg-white/5">
            <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-black text-xl tracking-tight">
                    AIJobSync
                  </div>
                  <div className="text-purple-300 text-xs">Master Profile</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-purple-200 text-sm hidden sm:block">
                  {formData.fullName || "Guest"}
                </div>
                {saving && (
                  <div className="flex items-center gap-2 text-purple-300 text-sm">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Saving...</span>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Take user to wizard to edit everything if they want
                    setViewMode("wizard");
                    setCurrentStep(1);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                >
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="relative z-10 mx-auto max-w-7xl px-5 py-12">
            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 grid grid-cols-3 gap-4"
            >
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="text-3xl font-black text-white mb-1">
                  {completeness}%
                </div>
                <div className="text-purple-300 text-sm">Profile Complete</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="text-3xl font-black text-white mb-1">
                  {formData.experience.length + formData.projects.length}
                </div>
                <div className="text-purple-300 text-sm">Total Entries</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                <div className="text-3xl font-black text-white mb-1">
                  {formData.coreSkills
                    ? Object.keys(formData.coreSkills).reduce(
                        (acc, key) =>
                          acc + (formData.coreSkills[key]?.length || 0),
                        0
                      )
                    : 0}
                </div>
                <div className="text-purple-300 text-sm">Skills Added</div>
              </div>
            </motion.div>

            {/* Section Cards Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">
                  Your Profile Sections
                </h2>
                <p className="text-purple-300 text-sm">
                  Click any section to edit
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SectionCard
                      icon={section.icon}
                      title={section.title}
                      description={section.desc}
                      itemCount={section.count}
                      isEmpty={section.isEmpty}
                      onEdit={() => setEditingSection(section.id)}
                      preview={section.preview}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </main>
        </div>

        {/* Edit Drawer */}
        <EditDrawer
          isOpen={editingSection !== null}
          onClose={() => setEditingSection(null)}
          title={sections.find((s) => s.id === editingSection)?.title || ""}
          onSave={handleSaveSection}
          saving={saving}
        >
          {renderDrawerContent()}
        </EditDrawer>

        {/* Success notification */}
        <AnimatePresence>
          {autoSaveMsg && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 z-50"
            >
              <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-xl flex items-center gap-2 text-emerald-300 text-sm">
                <CheckCircle className="w-4 h-4" />
                {autoSaveMsg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #a855f7, #ec4899);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #9333ea, #db2777);
          }
        `}</style>
      </>
    );
  }

  // ============================================
  // WIZARD VIEW (Initial Setup)
  // ============================================
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Glowing blobs */}
          {importing && <ImportingOverlay message={autoSaveMsg || "Uploading and processing your LinkedIn PDF..."} />}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-12 -left-12 w-[30rem] h-[30rem] bg-purple-500/30 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 right-0 w-[28rem] h-[28rem] bg-pink-500/25 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-indigo-500/25 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="text-white font-black text-xl tracking-tight">
              AIJobSync
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-purple-200 text-sm">Master Profile Setup</div>
            {saving && (
              <div className="flex items-center gap-2 text-purple-300 text-sm">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Saving...</span>
              </div>
            )}
            {autoSaveMsg && !saving && (
              <div className="flex items-center gap-2 text-emerald-300 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>{autoSaveMsg}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep > 0 && (
        <div className="relative z-10 bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="mx-auto max-w-7xl px-5 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white font-semibold">
                Step {currentStep} of {steps.length - 1}
              </div>
              <div className="text-purple-200 text-sm">
                {progress.toFixed(0)}% complete
              </div>
            </div>

            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm text-purple-300">Current: </div>
                <div className="px-3 py-1 rounded-lg bg-white/5 text-xs text-white font-medium">
                  {steps[currentStep].title}
                </div>
                <div className="text-sm text-purple-300 hidden sm:block ml-3">
                  {steps[currentStep].desc}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setViewMode("dashboard");
                  }}
                  className="text-sm text-purple-300 hover:text-white"
                >
                  Skip setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">
                {steps[currentStep].title}
              </h1>
              <p className="text-purple-300 mt-1">{steps[currentStep].desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-purple-200 text-sm hidden sm:block">
                Progress: {completeness}%
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 backdrop-blur-xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={steps[currentStep].id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition"
                >
                  <ChevronLeft className="w-4 h-4 text-purple-200" />
                  Back
                </button>

                <button
                  onClick={handleSkip}
                  disabled={currentStep === steps.length - 1}
                  className="px-4 py-2 rounded-lg text-sm text-purple-300 hover:text-white"
                >
                  Skip
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-purple-300 hidden sm:block">
                  {currentStep === 0
                    ? "Choose how you want to begin"
                    : "Tip: updates autosave in background"}
                </div>

                <button
                  onClick={() => {
                    // if last step, finalize
                    if (currentStep === steps.length - 1) {
                      saveProfile(formData);
                      setViewMode("dashboard");
                      setCurrentStep(0);
                    } else {
                      handleNext();
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Check className="w-4 h-4" />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Auto-save toast */}
      <AnimatePresence>
        {autoSaveMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/50 backdrop-blur-xl flex items-center gap-2 text-emerald-300 text-sm">
              <CheckCircle className="w-4 h-4" />
              {autoSaveMsg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
};

export default ProfileWizard;
