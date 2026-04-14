/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  X,
  GripVertical,
  Plus,
  Trash2,
  FolderGit2,
  ExternalLink,
  Github,
  Calendar,
  Lightbulb,
  Code2,
} from "lucide-react";

import { ProjectsStepProps, Project } from "@/types/profileWizard";

export const ProjectsStep: React.FC<ProjectsStepProps> = ({
  formData,
  addArrayItem,
  removeArrayItem,
  updateField,
}) => {
  const emptyProject: Project = {
    title: "",
    description: "",
    summary: "",
    technologies: [],
    liveUrl: "",
    githubUrl: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
    role: "",
    teamSize: "",
    highlights: "",
    name: undefined
  };
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState<Project>({ ...emptyProject });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newTech, setNewTech] = useState("");

  const addProject = () => {
    if (!newProject.title || !newProject.description || !newProject.startDate)
      return;

    addArrayItem("projects", newProject);
    setNewProject({ ...emptyProject });
    setShowForm(false); // <-- hide form after adding
  };

  const updateFieldLocal = (field: keyof Project, value: any) => {
    setNewProject({ ...newProject, [field]: value });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const items = [...formData.projects];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, draggedItem);

    if (updateField) {
      updateField("projects", items);
    }
    setDraggedIndex(null);
  };

  const addCustomTech = () => {
    if (!newTech.trim()) return;
    updateFieldLocal("technologies", [
      ...newProject.technologies,
      newTech.trim(),
    ]);
    setNewTech("");
  };

  const removeTech = (techToRemove: string) => {
    updateFieldLocal(
      "technologies",
      newProject.technologies.filter((t) => t !== techToRemove)
    );
  };

  const toggleTech = (tech: string) => {
    if (newProject.technologies.includes(tech)) {
      removeTech(tech);
    } else {
      updateFieldLocal("technologies", [...newProject.technologies, tech]);
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
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const availableSkills = formData.coreSkills
    ? Object.values(formData.coreSkills)
        .flat()
        .filter((skill, i, arr) => arr.indexOf(skill) === i)
    : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
          <FolderGit2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Projects</h2>
        <p className="text-purple-200">
          Showcase your best work. Drag to highlight your top projects first.
        </p>
      </div>

      {/* Existing Projects */}
      {formData.projects.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-purple-400" />
            Your Projects (Drag to reorder)
          </h3>
          {formData.projects.map((project, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className="group p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl relative hover:border-blue-400/50 transition-all cursor-move"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-blue-400" />
              </div>

              <button
                onClick={() => removeArrayItem("projects", idx)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                title="Remove project"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="ml-6">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-bold text-xl">
                    {project.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-purple-300 mb-3 flex-wrap text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(project.startDate)} -{" "}
                    {project.isOngoing
                      ? "Ongoing"
                      : formatDate(project.endDate || "")}
                  </span>
                  {project.role && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/30">
                      {project.role}
                    </span>
                  )}
                  {project.teamSize && (
                    <span className="text-purple-300/80">
                      Team: {project.teamSize}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-3 mb-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-500/20 border border-gray-400/40 text-gray-200 hover:bg-gray-500/30 transition-all text-sm"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>

                {project.summary && (
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 mb-3">
                    <p className="text-blue-200 text-sm font-medium">
                      {project.summary}
                    </p>
                  </div>
                )}

                {project.description && (
                  <p className="text-white/80 mb-3 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                )}

                {project.highlights && (
                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-yellow-200 text-sm whitespace-pre-line">
                        {project.highlights}
                      </p>
                    </div>
                  </div>
                )}

                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-white text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Project Form */}

      {/* Add Experience Button or Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-white/30 text-white hover:border-purple-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      ) : (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 backdrop-blur-xl">
          <h3 className="text-white font-bold text-2xl mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Add New Project
          </h3>

          <div className="space-y-4">
            {/* Project Title */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Project Name *
              </label>
              <input
                type="text"
                placeholder="e.g., E-Commerce Platform, Portfolio Website, ML Model"
                value={newProject.title}
                onChange={(e) => updateFieldLocal("title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
              />
            </div>

            {/* Summary (One-liner) */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Quick Summary (One-liner)
              </label>
              <input
                type="text"
                placeholder="Brief tagline: 'Full-stack e-commerce with AI recommendations'"
                value={newProject.summary}
                onChange={(e) => updateFieldLocal("summary", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
              />
            </div>

            {/* URLs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2 flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  Live URL / Demo
                </label>
                <input
                  type="url"
                  placeholder="https://project-demo.com"
                  value={newProject.liveUrl}
                  onChange={(e) => updateFieldLocal("liveUrl", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2 flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={newProject.githubUrl}
                  onChange={(e) =>
                    updateFieldLocal("githubUrl", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            {/* Role and Team Size */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Your Role
                </label>
                <input
                  type="text"
                  placeholder="e.g., Lead Developer, Team Lead, Solo"
                  value={newProject.role}
                  onChange={(e) => updateFieldLocal("role", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Team Size
                </label>
                <input
                  type="text"
                  placeholder="e.g., Solo, 3 members, 5-person team"
                  value={newProject.teamSize}
                  onChange={(e) => updateFieldLocal("teamSize", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Start Date *
                </label>
                <input
                  type="month"
                  value={newProject.startDate}
                  onChange={(e) =>
                    updateFieldLocal("startDate", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </div>
              {!newProject.isOngoing && (
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={newProject.endDate}
                    onChange={(e) =>
                      updateFieldLocal("endDate", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Ongoing Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={newProject.isOngoing}
                onChange={(e) =>
                  updateFieldLocal("isOngoing", e.target.checked)
                }
                className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
              />
              <span className="text-purple-200 text-sm font-medium group-hover:text-white transition-colors">
                This project is ongoing
              </span>
            </label>

            {/* Description */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Project Description *
              </label>
              <textarea
                placeholder="Detailed description of the project, problem it solves, features, architecture..."
                value={newProject.description}
                onChange={(e) =>
                  updateFieldLocal("description", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all resize-none"
              />
            </div>

            {/* Key Highlights */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2 flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                Key Highlights / Achievements
              </label>
              <textarea
                placeholder="• Achieved 10k+ users in first month&#10;• Reduced API response time by 60%&#10;• Featured on ProductHunt"
                value={newProject.highlights}
                onChange={(e) => updateFieldLocal("highlights", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all resize-none"
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2 flex items-center gap-1">
                <Code2 className="w-4 h-4" />
                Technologies / Tools Used
              </label>

              {/* Selected Technologies */}
              {newProject.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  {newProject.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/50 text-white text-sm font-medium flex items-center gap-2 group hover:from-cyan-500/40 hover:to-blue-500/40 transition-all"
                    >
                      {tech}
                      <button
                        onClick={() => removeTech(tech)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Custom Technology */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add technology (React, Python, AWS, etc.)"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomTech()}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-blue-400 text-sm"
                />
                <button
                  onClick={addCustomTech}
                  className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/50 text-blue-200 hover:bg-blue-500/30 transition-all text-sm font-medium"
                  type="button"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Suggested Skills from Profile */}
              {availableSkills.length > 0 && (
                <div>
                  <p className="text-purple-300 text-xs mb-2">
                    Quick add from your skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.slice(0, 20).map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => toggleTech(skill)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          newProject.technologies.includes(skill)
                            ? "bg-cyan-500/30 border border-cyan-400/50 text-white"
                            : "bg-white/5 border border-white/20 text-purple-200 hover:bg-white/10"
                        }`}
                        type="button"
                      >
                        {newProject.technologies.includes(skill) ? "✓ " : "+ "}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add Button */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={addProject}
                disabled={
                  !newProject.title ||
                  !newProject.description ||
                  !newProject.startDate
                }
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25"
                type="button"
              >
                <Plus className="w-5 h-5 inline-block mr-2" />
                Add Project
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
