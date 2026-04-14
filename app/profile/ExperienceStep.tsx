// import React, { useState } from "react";
// import { ExperienceStepProps, ExperienceItem } from "@/types/profileWizard";
// import { X } from "lucide-react"; // You can use Briefcase icon if needed

// export const ExperienceStep: React.FC<ExperienceStepProps> = ({
//   formData,
//   addArrayItem,
//   removeArrayItem,
// }) => {
//   const emptyExperience: ExperienceItem = {
//     company: "",
//     role: "",
//     startDate: "",
//     endDate: "",
//     currentlyWorking: false,
//     responsibilities: "",
//     skillsUsed: [],
//     summary: "",
//   };

//   const [newExperience, setNewExperience] = useState<ExperienceItem>({
//     ...emptyExperience,
//   });

//   const addExperience = () => {
//     if (!newExperience.company || !newExperience.role || !newExperience.startDate)
//       return;

//     addArrayItem("experience", newExperience);
//     setNewExperience({ ...emptyExperience });
//   };

//   const updateField = (field: keyof ExperienceItem, value: any) => {
//     setNewExperience({ ...newExperience, [field]: value });
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-black text-white mb-2">
//           Work Experience
//         </h2>
//         <p className="text-purple-200">
//           Share your professional journey & achievements
//         </p>
//       </div>

//       {/* Existing Experience Entries */}
//       {formData.experience.map((exp, idx) => (
//         <div
//           key={idx}
//           className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl relative"
//         >
//           <button
//             onClick={() => removeArrayItem("experience", idx)}
//             className="absolute top-3 right-3 text-red-400 hover:text-red-300"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           <h4 className="text-purple-200 font-semibold mb-2 flex items-center gap-2">
//             {exp.role} @ {exp.company}
//           </h4>
//           <div className="text-sm text-purple-300 mb-2">
//             {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
//           </div>
//           {exp.responsibilities && (
//             <p className="text-white/80 mb-2">{exp.responsibilities}</p>
//           )}
//           {exp.skillsUsed.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {exp.skillsUsed.map((skill, i) => (
//                 <span
//                   key={i}
//                   className="px-3 py-1 rounded-lg bg-indigo-500/30 border border-indigo-400/50 text-white text-sm"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           )}
//           {exp.summary && (
//             <p className="text-purple-300 text-sm mt-2">{exp.summary}</p>
//           )}
//         </div>
//       ))}

//       {/* Add New Experience */}
//       <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
//         <h3 className="text-white font-bold text-xl mb-4">Add New Experience</h3>

//         <div className="grid md:grid-cols-2 gap-4 mb-4">
//           <input
//             type="text"
//             placeholder="Company Name"
//             value={newExperience.company}
//             onChange={(e) => updateField("company", e.target.value)}
//             className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//           />
//           <input
//             type="text"
//             placeholder="Role / Position"
//             value={newExperience.role}
//             onChange={(e) => updateField("role", e.target.value)}
//             className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//           />
//           <input
//             type="month"
//             placeholder="Start Date"
//             value={newExperience.startDate}
//             onChange={(e) => updateField("startDate", e.target.value)}
//             className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//           />
//           {!newExperience.currentlyWorking && (
//             <input
//               type="month"
//               placeholder="End Date"
//               value={newExperience.endDate}
//               onChange={(e) => updateField("endDate", e.target.value)}
//               className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//             />
//           )}
//         </div>

//         <div className="flex items-center mb-4 gap-2">
//           <input
//             type="checkbox"
//             checked={newExperience.currentlyWorking}
//             onChange={(e) => updateField("currentlyWorking", e.target.checked)}
//             className="accent-purple-500"
//           />
//           <span className="text-purple-300 text-sm">Currently Working Here</span>
//         </div>

//         <textarea
//           placeholder="Responsibilities / Achievements"
//           value={newExperience.responsibilities}
//           onChange={(e) => updateField("responsibilities", e.target.value)}
//           className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 mb-4"
//         />

//         <textarea
//           placeholder="Summary / Notes"
//           value={newExperience.summary}
//           onChange={(e) => updateField("summary", e.target.value)}
//           className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 mb-4"
//         />

//         <div className="flex flex-wrap gap-2 mb-4">
//           {/* Optional: Suggest skills from SkillsStep */}
//           {formData.coreSkills &&
//             Object.values(formData.coreSkills)
//               .flat()
//               .filter((skill, i, arr) => arr.indexOf(skill) === i)
//               .map((skill, i) => (
//                 <button
//                   key={i}
//                   onClick={() =>
//                     updateField("skillsUsed", [
//                       ...newExperience.skillsUsed.filter((s) => s !== skill),
//                       skill,
//                     ])
//                   }
//                   className="px-3 py-1 rounded-lg bg-white/10 text-purple-200 text-xs hover:bg-white/20 transition"
//                   type="button"
//                 >
//                   + {skill}
//                 </button>
//               ))}
//         </div>

//         <button
//           onClick={addExperience}
//           className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600"
//           type="button"
//         >
//           Add Experience
//         </button>
//       </div>
//     </div>
//   );
// };
/* eslint-disable @typescript-eslint/no-explicit-any */


import React, { useState } from "react";
import {
  X,
  GripVertical,
  Plus,
  Trash2,
  Briefcase,
  MapPin,
  Calendar,
  Edit2,
} from "lucide-react";
import { ExperienceStepProps, ExperienceItem } from "@/types/profileWizard";

export const ExperienceStep: React.FC<ExperienceStepProps> = ({
  formData,
  addArrayItem,
  removeArrayItem,
  updateField,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const emptyExperience: ExperienceItem = {
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    responsibilities: "",
    skillsUsed: [],
    summary: "",
    title: undefined
  };

  const [newExperience, setNewExperience] = useState<ExperienceItem>({
    ...emptyExperience,
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newSkill, setNewSkill] = useState("");

  const addExperience = () => {
    if (
      !newExperience.company ||
      !newExperience.role ||
      !newExperience.startDate
    )
      return;

    if (editingIndex !== null) {
      // Update existing experience
      const updatedExperience = [...formData.experience];
      updatedExperience[editingIndex] = newExperience;
      updateField("experience", updatedExperience);
      setEditingIndex(null);
    } else {
      // Add new experience
      addArrayItem("experience", newExperience);
    }

    setNewExperience({ ...emptyExperience });
    setShowForm(false);
  };

  const updateFieldLocal = (field: keyof ExperienceItem, value: any) => {
    setNewExperience({ ...newExperience, [field]: value });
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

    const items = [...formData.experience];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, draggedItem);

    if (updateField) {
      updateField("experience", items);
    }
    setDraggedIndex(null);
  };

  const addCustomSkill = () => {
    if (!newSkill.trim()) return;
    updateFieldLocal("skillsUsed", [
      ...newExperience.skillsUsed,
      newSkill.trim(),
    ]);
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    updateFieldLocal(
      "skillsUsed",
      newExperience.skillsUsed.filter((s) => s !== skillToRemove)
    );
  };

  const toggleSkill = (skill: string) => {
    if (newExperience.skillsUsed.includes(skill)) {
      removeSkill(skill);
    } else {
      updateFieldLocal("skillsUsed", [...newExperience.skillsUsed, skill]);
    }
  };
  const handleEdit = (index: number) => {
    setNewExperience(formData.experience[index]);
    setEditingIndex(index);
    setShowForm(true);
  };
  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(null);
    setNewExperience({ ...emptyExperience });
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

  // Get all available skills from coreSkills
  const availableSkills = formData.coreSkills
    ? Object.values(formData.coreSkills)
        .flat()
        .filter((skill, i, arr) => arr.indexOf(skill) === i)
    : [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Work Experience</h2>
        <p className="text-purple-200">
          Showcase your professional journey. Drag to reorder by relevance.
        </p>
      </div>

      {/* Existing Experience Entries */}
      {formData.experience.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-purple-400" />
            Your Experience (Drag to reorder)
          </h3>
          {formData.experience.map((exp, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className="group p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-xl relative hover:border-purple-400/50 transition-all cursor-move"
            >
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-purple-400" />
              </div>
              <button
                onClick={() => handleEdit(idx)}
                className="absolute top-4 right-16 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-2 rounded-lg transition-all"
                title="Edit experience"
              >
                <Edit2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => removeArrayItem("experience", idx)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                title="Remove experience"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="ml-6">
                <h4 className="text-white font-bold text-xl mb-1">
                  {exp.role}
                </h4>
                <div className="flex items-center gap-3 text-purple-300 mb-3 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold">
                    <Briefcase className="w-4 h-4" />
                    {exp.company}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(exp.startDate)} -{" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : formatDate(exp.endDate || "")}
                  </span>
                </div>

                {exp.responsibilities && (
                  <p className="text-white/80 mb-3 whitespace-pre-line leading-relaxed">
                    {exp.responsibilities}
                  </p>
                )}

                {exp.summary && (
                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3 mb-3">
                    <p className="text-purple-200 text-sm italic">
                      {exp.summary}
                    </p>
                  </div>
                )}

                {exp.skillsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.skillsUsed.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 text-white text-sm font-medium"
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

      {/* Add New Experience Form */}

      {/* Add Experience Button or Form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-white/30 text-white hover:border-purple-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Experience
        </button>
      ) : (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 backdrop-blur-xl">
          <h3 className="text-white font-bold text-2xl mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6" />
  {editingIndex !== null ? "Update Experience" : "Add New Experience"}
          </h3>

          <div className="space-y-4">
            {/* Company and Role */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Google, Accenture, Local Business"
                  value={newExperience.company}
                  onChange={(e) => updateFieldLocal("company", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Role / Position *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, HR Manager"
                  value={newExperience.role}
                  onChange={(e) => updateFieldLocal("role", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Mumbai, India / Remote"
                value={newExperience.location}
                onChange={(e) => updateFieldLocal("location", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
              />
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Start Date *
                </label>
                <input
                  type="month"
                  value={newExperience.startDate}
                  onChange={(e) =>
                    updateFieldLocal("startDate", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                />
              </div>
              {!newExperience.currentlyWorking && (
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={newExperience.endDate}
                    onChange={(e) =>
                      updateFieldLocal("endDate", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Currently Working Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={newExperience.currentlyWorking}
                onChange={(e) =>
                  updateFieldLocal("currentlyWorking", e.target.checked)
                }
                className="w-5 h-5 rounded accent-purple-500 cursor-pointer"
              />
              <span className="text-purple-200 text-sm font-medium group-hover:text-white transition-colors">
                I currently work here
              </span>
            </label>

            {/* Responsibilities */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Key Responsibilities & Achievements
              </label>
              <textarea
                placeholder="• Led team of 5 developers&#10;• Increased sales by 40%&#10;• Managed recruitment process"
                value={newExperience.responsibilities}
                onChange={(e) =>
                  updateFieldLocal("responsibilities", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all resize-none"
              />
            </div>

            {/* Summary/Notes */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Summary / Additional Notes
              </label>
              <textarea
                placeholder="Brief overview or highlights from this role"
                value={newExperience.summary}
                onChange={(e) => updateFieldLocal("summary", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all resize-none"
              />
            </div>

            {/* Skills Used */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Skills Used in This Role
              </label>

              {/* Selected Skills */}
              {newExperience.skillsUsed.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  {newExperience.skillsUsed.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 text-white text-sm font-medium flex items-center gap-2 group hover:from-purple-500/40 hover:to-pink-500/40 transition-all"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Custom Skill */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add custom skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 text-sm"
                />
                <button
                  onClick={addCustomSkill}
                  className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-400/50 text-purple-200 hover:bg-purple-500/30 transition-all text-sm font-medium"
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
                    {availableSkills.slice(0, 15).map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          newExperience.skillsUsed.includes(skill)
                            ? "bg-purple-500/30 border border-purple-400/50 text-white"
                            : "bg-white/5 border border-white/20 text-purple-200 hover:bg-white/10"
                        }`}
                        type="button"
                      >
                        {newExperience.skillsUsed.includes(skill) ? "✓ " : "+ "}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add and Cancel buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={addExperience}
                disabled={
                  !newExperience.company ||
                  !newExperience.role ||
                  !newExperience.startDate
                }
                className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/25"
                type="button"
              >
                <Plus className="w-5 h-5 inline-block mr-2" />
  {editingIndex !== null ? "Update Experience" : "Add New Experience"}
              </button>

              <button
              onClick={handleCancel}
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
