
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  X,
  GripVertical,
  Plus,
  Trash2,
  Award,
  Trophy,
  Medal,
  ExternalLink,
  Calendar,
  Building2,
  Hash,
  Star,
  Target,
  Zap,
} from "lucide-react";

import {
  Certification,
  Achievement,
  ExtrasStepProps,
} from "@/types/profileWizard";

interface CertsAchievementsStepProps {
  formData: FormData;
  addArrayItem: (field: string, item: any) => void;
  removeArrayItem: (field: string, index: number) => void;
  updateField?: (field: string, value: any) => void;
}

export const CertsAchievementsStep: React.FC<ExtrasStepProps> = ({
  formData,
  addArrayItem,
  removeArrayItem,
  updateField,
}) => {
  // Empty templates

  const emptyCertification: Certification = {
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
    skills: [],
    description: "",
    neverExpires: true,
  };

  const emptyAchievement: Achievement = {
    title: "",
    description: "",
    date: "",
    category: "Academic",
    organization: "",
    location: "",
    recognition: "",
    impact: "",
  };

  const [showCertForm, setCertShowForm] = useState(false);
  const [showAchmntForm, setShowAchmntForm] = useState(false);

  const [newCert, setNewCert] = useState<Certification>({
    ...emptyCertification,
  });
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    ...emptyAchievement,
  });
  const [draggedCertIndex, setDraggedCertIndex] = useState<number | null>(null);
  const [draggedAchIndex, setDraggedAchIndex] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState("");

  const achievementCategories = [
    "Academic",
    "Professional",
    "Competition",
    "Leadership",
    "Research",
    "Publication",
    "Community Service",
    "Sports",
    "Innovation",
    "Other",
  ];

  const addCertification = () => {
    if (!newCert.name || !newCert.issuer || !newCert.issueDate) return;
    addArrayItem("certifications", newCert);
    setNewCert({ ...emptyCertification });
    setCertShowForm(false);
  };

  const addAchievementItem = () => {
    if (
      !newAchievement.title ||
      !newAchievement.description ||
      !newAchievement.date
    )
      return;
    addArrayItem("achievements", newAchievement);
    setNewAchievement({ ...emptyAchievement });
    setShowAchmntForm(false);
  };

  const updateCertField = (field: keyof Certification, value: any) => {
    setNewCert((prev) => ({ ...prev, [field]: value }));
  };

  const updateAchField = (field: keyof Achievement, value: any) => {
    setNewAchievement((prev) => ({ ...prev, [field]: value }));
  };

  const handleDragStart = (
    e: React.DragEvent,
    index: number,
    type: "cert" | "ach"
  ) => {
    if (type === "cert") setDraggedCertIndex(index);
    else setDraggedAchIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    dropIndex: number,
    type: "cert" | "ach"
  ) => {
    e.preventDefault();
    if (
      type === "cert" &&
      draggedCertIndex !== null &&
      draggedCertIndex !== dropIndex
    ) {
      const items = [...formData.certifications];
      const draggedItem = items[draggedCertIndex];
      items.splice(draggedCertIndex, 1);
      items.splice(dropIndex, 0, draggedItem);
      if (updateField) updateField("certifications", items);
      setDraggedCertIndex(null);
    } else if (
      type === "ach" &&
      draggedAchIndex !== null &&
      draggedAchIndex !== dropIndex
    ) {
      const items = [...formData.achievements];
      const draggedItem = items[draggedAchIndex];
      items.splice(draggedAchIndex, 1);
      items.splice(dropIndex, 0, draggedItem);
      if (updateField) updateField("achievements", items);
      setDraggedAchIndex(null);
    }
  };

  const addCustomSkill = () => {
    if (!newSkill.trim()) return;
    updateCertField("skills", [...(newCert.skills || []), newSkill.trim()]);
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    updateCertField(
      "skills",
      (newCert.skills || []).filter((s) => s !== skillToRemove)
    );
  };

  const toggleSkill = (skill: string) => {
    const skills = newCert.skills || [];
    if (skills.includes(skill)) {
      removeSkill(skill);
    } else {
      updateCertField("skills", [...skills, skill]);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return month ? `${months[parseInt(month) - 1]} ${year}` : year;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    // compare to start of next month for accurate month-based expiry checks
    const [y, m] = expiryDate.split("-");
    const expiry = new Date(Number(y), Number(m) - 1 + 1, 1);
    return expiry <= new Date();
  };

  const availableSkills = formData.coreSkills
    ? Object.values(formData.coreSkills)
        .flat()
        .filter((skill, i, arr) => arr.indexOf(skill) === i)
    : [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Academic":
        return <Star className="w-4 h-4" />;
      case "Competition":
        return <Trophy className="w-4 h-4" />;
      case "Leadership":
        return <Target className="w-4 h-4" />;
      case "Innovation":
        return <Zap className="w-4 h-4" />;
      default:
        return <Medal className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">
          Certifications & Achievements
        </h2>
        <p className="text-purple-200">
          Highlight your credentials and accomplishments that set you apart.
        </p>
      </div>

      {/* ==================== CERTIFICATIONS SECTION ==================== */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Certifications</h3>
        </div>

        {/* Existing Certifications */}
        {formData.certifications && formData.certifications.length > 0 && (
          <div className="space-y-4">
            <p className="text-purple-300 text-sm flex items-center gap-2">
              <GripVertical className="w-4 h-4" />
              Drag to reorder by importance
            </p>
            {formData.certifications.map((cert, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx, "cert")}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx, "cert")}
                className="group p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl relative hover:border-blue-400/50 transition-all cursor-move"
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-blue-400" />
                </div>

                <button
                  onClick={() => removeArrayItem("certifications", idx)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="ml-6">
                  <h4 className="text-white font-bold text-lg mb-1">
                    {cert.name}
                  </h4>
                  <div className="flex items-center gap-2 text-blue-300 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{cert.issuer}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-purple-300 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Issued: {formatDate(cert.issueDate)}
                    </span>
                    {!cert.neverExpires && cert.expiryDate && (
                      <span
                        className={`flex items-center gap-1 ${
                          isExpired(cert.expiryDate) ? "text-red-400" : ""
                        }`}
                      >
                        Expires: {formatDate(cert.expiryDate)}
                        {isExpired(cert.expiryDate) && " (Expired)"}
                      </span>
                    )}
                    {cert.neverExpires && (
                      <span className="text-green-400">No Expiration</span>
                    )}
                  </div>

                  {cert.description && (
                    <p className="text-white/80 mb-3 text-sm">
                      {cert.description}
                    </p>
                  )}

                  {cert.credentialId && (
                    <div className="flex items-center gap-2 text-sm text-purple-300 mb-2">
                      <Hash className="w-4 h-4" />
                      <span className="font-mono">{cert.credentialId}</span>
                    </div>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all text-sm mb-3"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Verify Credential
                    </a>
                  )}

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {cert.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Certification Form */}

        {!showCertForm ? (
          <button
            onClick={() => setCertShowForm(true)}
            className="w-full py-4 rounded-xl border-2 border-dashed border-white/30 text-white hover:border-purple-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Certification
          </button>
        ) : (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 backdrop-blur-xl">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Certification
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Certification Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., AWS Certified Solutions Architect, PMP, Google Analytics"
                  value={newCert.name}
                  onChange={(e) => updateCertField("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Amazon Web Services, PMI, Google"
                  value={newCert.issuer}
                  onChange={(e) => updateCertField("issuer", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="month"
                    value={newCert.issueDate}
                    onChange={(e) =>
                      updateCertField("issueDate", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                  />
                </div>
                {!newCert.neverExpires && (
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="month"
                      value={newCert.expiryDate}
                      onChange={(e) =>
                        updateCertField("expiryDate", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={newCert.neverExpires}
                  onChange={(e) =>
                    updateCertField("neverExpires", e.target.checked)
                  }
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
                <span className="text-purple-200 text-sm font-medium group-hover:text-white transition-colors">
                  This certification does not expire
                </span>
              </label>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Credential ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ABC123XYZ"
                    value={newCert.credentialId}
                    onChange={(e) =>
                      updateCertField("credentialId", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Credential URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://verify-certificate.com/..."
                    value={newCert.credentialUrl}
                    onChange={(e) =>
                      updateCertField("credentialUrl", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of what this certification covers..."
                  value={newCert.description}
                  onChange={(e) =>
                    updateCertField("description", e.target.value)
                  }
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Related Skills
                </label>
                {newCert.skills && newCert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    {newCert.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-indigo-500/30 border border-indigo-400/50 text-white text-sm flex items-center gap-2 group hover:bg-indigo-500/40 transition-all"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          type="button"
                          className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addCustomSkill())
                    }
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 text-sm"
                  />
                  <button
                    onClick={addCustomSkill}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/50 text-blue-200 hover:bg-blue-500/30 transition-all text-sm"
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {availableSkills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableSkills.slice(0, 10).map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => toggleSkill(skill)}
                        type="button"
                        className={`px-2 py-1 rounded-md text-xs transition-all ${
                          (newCert.skills || []).includes(skill)
                            ? "bg-indigo-500/30 border border-indigo-400/50 text-white"
                            : "bg-white/5 border border-white/20 text-purple-200 hover:bg-white/10"
                        }`}
                      >
                        {(newCert.skills || []).includes(skill) ? "✓ " : "+ "}
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={addCertification}
                  disabled={
                    !newCert.name || !newCert.issuer || !newCert.issueDate
                  }
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  type="button"
                >
                  <Plus className="w-5 h-5 inline-block mr-2" />
                  Add Certification
                </button>
                <button
                  onClick={() => setCertShowForm(false)}
                  className="px-6 py-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== ACHIEVEMENTS SECTION ==================== */}
      <div className="space-y-6 pt-8 border-t border-white/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Achievements</h3>
        </div>

        {/* Existing Achievements */}
        {formData.achievements && formData.achievements.length > 0 && (
          <div className="space-y-4">
            <p className="text-purple-300 text-sm flex items-center gap-2">
              <GripVertical className="w-4 h-4" />
              Drag to reorder by significance
            </p>
            {formData.achievements.map((ach, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleDragStart(e, idx, "ach")}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx, "ach")}
                className="group p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl relative hover:border-amber-400/50 transition-all cursor-move"
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-amber-400" />
                </div>

                <button
                  onClick={() => removeArrayItem("achievements", idx)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="ml-6">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-400/40 flex-shrink-0">
                      {getCategoryIcon(ach.category)}
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-medium mb-1">
                        {ach.category}
                      </span>
                      <h4 className="text-white font-bold text-lg">
                        {ach.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-purple-300 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(ach.date)}
                    </span>
                    {ach.organization && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {ach.organization}
                      </span>
                    )}
                    {ach.location && <span>{ach.location}</span>}
                  </div>

                  <p className="text-white/80 mb-3">{ach.description}</p>

                  {ach.recognition && (
                    <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-3 mb-2">
                      <p className="text-amber-200 text-sm">
                        <span className="font-semibold">Recognition:</span>{" "}
                        {ach.recognition}
                      </p>
                    </div>
                  )}

                  {ach.impact && (
                    <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
                      <p className="text-green-200 text-sm">
                        <span className="font-semibold">Impact:</span>{" "}
                        {ach.impact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Achievement Form */}

        {!showAchmntForm ? (
          <button
            onClick={() => setCertShowForm(true)}
            className="w-full py-4 rounded-xl border-2 border-dashed border-white/30 text-white hover:border-purple-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Achievement
          </button>
        ) : (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 backdrop-blur-xl">
            <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Achievement
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., First Prize in Hackathon, Employee of the Year"
                  value={newAchievement.title}
                  onChange={(e) => updateAchField("title", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={newAchievement.category}
                  onChange={(e) => updateAchField("category", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                >
                  {achievementCategories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Date *
                  </label>
                  <input
                    type="month"
                    value={newAchievement.date}
                    onChange={(e) => updateAchField("date", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mumbai, India"
                    value={newAchievement.location}
                    onChange={(e) => updateAchField("location", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Organization / Event
                </label>
                <input
                  type="text"
                  placeholder="e.g., Google, IEEE, University Name"
                  value={newAchievement.organization}
                  onChange={(e) =>
                    updateAchField("organization", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Brief summary of the achievement and your role..."
                  value={newAchievement.description}
                  onChange={(e) =>
                    updateAchField("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Recognition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Best Paper, Cash Prize, Certificate"
                    value={newAchievement.recognition}
                    onChange={(e) =>
                      updateAchField("recognition", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Impact
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 200+ users benefited, Increased revenue by 10%"
                    value={newAchievement.impact}
                    onChange={(e) => updateAchField("impact", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={addAchievementItem}
                  disabled={
                    !newAchievement.title ||
                    !newAchievement.description ||
                    !newAchievement.date
                  }
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  type="button"
                >
                  <Plus className="w-5 h-5 inline-block mr-2" />
                  Add Achievement
                </button>
                <button
                  onClick={() => setShowAchmntForm(false)}
                  className="px-6 py-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertsAchievementsStep;
