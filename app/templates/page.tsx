
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Filter, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TemplateCard from "@/components/resume-templates/TemplateCard";
import { resumeTemplates } from "@/data/templates";
import { clearCalibrationCache } from "@/hooks/useTemplateCalibration";
import { useSearchParams } from "next/navigation";


export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showClearButton, setShowClearButton] = useState(true);
const searchParams = useSearchParams();
const resumeId = searchParams.get("resumeId");

  const handleSelect = (template: any) => {
    // Navigate to preview page with template ID
  router.push(`/templates/preview/${template.id}?resumeId=${resumeId}`);
  };



  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = resumeTemplates;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Sort
    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "ats") {
      filtered = [...filtered].sort((a, b) => {
        const scoreA = parseInt(a.atsScore);
        const scoreB = parseInt(b.atsScore);
        return scoreB - scoreA;
      });
    }

    return filtered;
  }, [searchQuery, sortBy, filterType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-5 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-black text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            Choose Your Resume Template
          </h1>
          <p className="text-purple-200/80 text-lg max-w-2xl mx-auto">
            Pick a clean, ATS-optimized template. Auto-calibration ensures perfect pagination.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search templates by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/15"
            >
              <Filter className="h-5 w-5" />
              Filters
              {(filterType !== "all" || sortBy !== "default") && (
                <span className="w-2 h-2 bg-purple-400 rounded-full" />
              )}
            </Button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Type Filter */}
                    <div>
                      <label className="text-sm text-purple-200 mb-2 block font-semibold">
                        Template Type
                      </label>
                      <div className="flex gap-2">
                        {["all", "FREE", "PRO"].map((type) => (
                          <Button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 text-sm font-semibold transition-all ${
                              filterType === type
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                : "bg-white/10 text-purple-200 hover:bg-white/15"
                            }`}
                          >
                            {type === "all" ? "All" : type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="text-sm text-purple-200 mb-2 block font-semibold">
                        Sort By
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: "default", label: "Default" },
                          { value: "name", label: "Name" },
                          { value: "ats", label: "ATS Score" },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`px-4 py-2 text-sm font-semibold transition-all ${
                              sortBy === option.value
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                : "bg-white/10 text-purple-200 hover:bg-white/15"
                            }`}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info Banner */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 mb-8 backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className="bg-purple-500 rounded-full p-2 mt-0.5 flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">🔧 Auto-Calibration Active</h3>
              <p className="text-purple-200 text-sm">
                When you preview a template, we&apos;ll automatically measure and calibrate it for perfect pagination.
                The first load may take 1-2 seconds, but results are cached for instant subsequent loads.
              </p>
            </div>
            {showClearButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCache}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border-white/20 text-white flex-shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Cache
              </Button>
            )}
          </div>
        </motion.div> */}

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 text-purple-200/80 text-sm"
        >
          Showing {filteredTemplates.length} of {resumeTemplates.length} templates
        </motion.div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, idx) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelect}
                index={idx}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No templates found</h3>
            <p className="text-purple-200/80 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilterType("all");
                setSortBy("default");
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
            >
              Reset Filters
            </Button>
          </motion.div>
        )}

        {/* Dev Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-purple-300/60 text-sm"
        >
          <p>💡 Tip: Calibration data is cached for better performance</p>
        </motion.div>
      </div>
    </div>
  );
}