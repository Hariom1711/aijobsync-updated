// // components/profile/SkillsStep.tsx

// import React, { useState } from "react";
// import { SkillsStepProps, CoreSkills } from "@/types/profileWizard";

// export const SkillsStep: React.FC<SkillsStepProps> = ({
//   formData,
//   updateField,
//   addArrayItem,
//   removeArrayItem,
// }) => {
//   const [skillInput, setSkillInput] = useState("");
//   const [skillCategory, setSkillCategory] = useState("");
//   const [softSkillInput, setSoftSkillInput] = useState("");
//   const [toolInput, setToolInput] = useState("");
//   const [newCategory, setNewCategory] = useState("");
//   const [showAddCategory, setShowAddCategory] = useState(false);

//   const suggestedCategories: string[] = [
//     "Technical Skills",
//     "Programming Languages",
//     "Marketing Skills",
//     "Financial Analysis",
//     "Design Tools",
//     "Business Strategy",
//     "Data Analysis",
//     "Sales Techniques",
//     "Content Creation",
//     "Healthcare Skills",
//     "Legal Knowledge",
//     "Operations Management",
//   ];

//   const suggestedSoftSkills: string[] = [
//     "Communication",
//     "Leadership",
//     "Teamwork",
//     "Problem Solving",
//     "Time Management",
//     "Adaptability",
//     "Critical Thinking",
//     "Creativity",
//     "Attention to Detail",
//     "Project Management",
//     "Negotiation",
//     "Public Speaking",
//   ];

//   const suggestedTools: Record<string, string[]> = {
//     "IT/Tech": ["VS Code", "Git", "Docker", "AWS", "Jira", "Postman"],
//     Design: [
//       "Figma",
//       "Adobe Photoshop",
//       "Illustrator",
//       "Canva",
//       "Sketch",
//       "InVision",
//     ],
//     Marketing: [
//       "Google Analytics",
//       "HubSpot",
//       "Mailchimp",
//       "SEMrush",
//       "Hootsuite",
//       "Buffer",
//     ],
//     Finance: [
//       "Excel",
//       "QuickBooks",
//       "SAP",
//       "Tableau",
//       "Bloomberg Terminal",
//       "Oracle",
//     ],
//     Data: ["Python", "SQL", "Tableau", "Power BI", "Excel", "R"],
//     Business: [
//       "Microsoft Office",
//       "Salesforce",
//       "Slack",
//       "Asana",
//       "Trello",
//       "Notion",
//     ],
//     Content: [
//       "WordPress",
//       "Google Docs",
//       "Grammarly",
//       "Canva",
//       "Adobe Premiere",
//       "Final Cut",
//     ],
//   };

//   const addCategory = (): void => {
//     if (newCategory.trim() && !formData.coreSkills[newCategory.trim()]) {
//       const updatedSkills: CoreSkills = {
//         ...formData.coreSkills,
//         [newCategory.trim()]: [],
//       };
//       updateField("coreSkills", updatedSkills);
//       setSkillCategory(newCategory.trim());
//       setNewCategory("");
//       setShowAddCategory(false);
//     }
//   };

//   const addSkill = (): void => {
//     if (skillInput.trim() && skillCategory) {
//       const updatedSkills: CoreSkills = { ...formData.coreSkills };

//       if (!updatedSkills[skillCategory]) {
//         updatedSkills[skillCategory] = [];
//       }

//       if (!updatedSkills[skillCategory].includes(skillInput.trim())) {
//         updatedSkills[skillCategory] = [
//           ...updatedSkills[skillCategory],
//           skillInput.trim(),
//         ];
//         updateField("coreSkills", updatedSkills);
//       }
//       setSkillInput("");
//     }
//   };

//   const removeSkill = (category: string, skill: string): void => {
//     const updatedSkills: CoreSkills = { ...formData.coreSkills };
//     updatedSkills[category] = updatedSkills[category].filter(
//       (s) => s !== skill
//     );

//     if (updatedSkills[category].length === 0) {
//       delete updatedSkills[category];
//     }

//     updateField("coreSkills", updatedSkills);
//   };

//   const addSoftSkill = (): void => {
//     if (
//       softSkillInput.trim() &&
//       !formData.softSkills.includes(softSkillInput.trim())
//     ) {
//       addArrayItem("softSkills", softSkillInput.trim());
//       setSoftSkillInput("");
//     }
//   };

//   const addTool = (): void => {
//     if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
//       addArrayItem("tools", toolInput.trim());
//       setToolInput("");
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-black text-white mb-2">
//           Skills & Expertise
//         </h2>
//         <p className="text-purple-200">Showcase what makes you valuable</p>
//       </div>

//       {/* Professional Skills */}
//       <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-white font-bold text-xl">
//             Professional Skills
//           </h3>
//           <button
//             onClick={() => setShowAddCategory(!showAddCategory)}
//             className="text-sm px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition"
//             type="button"
//           >
//             + Add Category
//           </button>
//         </div>

//         {showAddCategory && (
//           <div className="mb-4 p-4 rounded-lg bg-white/5 border border-white/10">
//             <label className="block text-purple-200 text-sm mb-2">
//               Create a skill category
//             </label>
//             <div className="flex gap-2 mb-3">
//               <input
//                 type="text"
//                 value={newCategory}
//                 onChange={(e) => setNewCategory(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && addCategory()}
//                 placeholder="e.g., Marketing Skills, Financial Analysis..."
//                 className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//               />
//               <button
//                 onClick={addCategory}
//                 className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600"
//                 type="button"
//               >
//                 Add
//               </button>
//             </div>
//             <div className="text-xs text-purple-300 mb-2">
//               Or choose from suggestions:
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {suggestedCategories.map((cat, i) => (
//                 <button
//                   key={i}
//                   onClick={() => {
//                     setNewCategory(cat);
//                     const updatedSkills: CoreSkills = {
//                       ...formData.coreSkills,
//                       [cat]: [],
//                     };
//                     updateField("coreSkills", updatedSkills);
//                     setSkillCategory(cat);
//                     setShowAddCategory(false);
//                   }}
//                   className="px-3 py-1 rounded-lg bg-white/10 text-purple-200 text-xs hover:bg-white/20 transition"
//                   type="button"
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {Object.keys(formData.coreSkills).length > 0 && (
//           <div className="mb-4">
//             <div className="flex gap-3 mb-3">
//               <select
//                 value={skillCategory}
//                 onChange={(e) => setSkillCategory(e.target.value)}
//                 className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400"
//               >
//                 <option value="">Select Category</option>
//                 {Object.keys(formData.coreSkills).map((cat, i) => (
//                   <option key={i} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 value={skillInput}
//                 onChange={(e) => setSkillInput(e.target.value)}
//                 onKeyPress={(e) => e.key === "Enter" && addSkill()}
//                 placeholder="Add a skill..."
//                 disabled={!skillCategory}
//                 className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 disabled:opacity-50"
//               />
//               <button
//                 onClick={addSkill}
//                 disabled={!skillCategory}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                 type="button"
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="space-y-4">
//           {Object.keys(formData.coreSkills).length === 0 ? (
//             <div className="text-center py-8 text-purple-300">
//               <p>
//                 Click "Add Category" to start adding your professional skills
//               </p>
//               <p className="text-sm mt-2">
//                 Examples: Technical Skills, Marketing, Finance, Design, etc.
//               </p>
//             </div>
//           ) : (
//             Object.entries(formData.coreSkills).map(
//               ([category, skills], idx) => (
//                 <div key={idx}>
//                   <h4 className="text-purple-200 font-semibold mb-2 flex items-center gap-2">
//                     {category}
//                     <span className="text-xs text-purple-400">
//                       ({skills.length})
//                     </span>
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     {skills.map((skill, i) => (
//                       <span
//                         key={i}
//                         className="px-3 py-1 rounded-lg bg-indigo-500/30 border border-indigo-400/50 text-white text-sm flex items-center gap-2"
//                       >
//                         {skill}
//                         <button
//                           onClick={() => removeSkill(category, skill)}
//                           className="text-red-300 hover:text-red-200 font-bold"
//                           type="button"
//                         >
//                           ×
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )
//             )
//           )}
//         </div>
//       </div>

//       {/* Soft Skills */}
//       <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
//         <h3 className="text-white font-bold text-xl mb-4">Soft Skills</h3>
//         <p className="text-purple-300 text-sm mb-4">
//           Leadership, communication, and interpersonal abilities
//         </p>

//         <div className="flex gap-3 mb-4">
//           <input
//             type="text"
//             value={softSkillInput}
//             onChange={(e) => setSoftSkillInput(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && addSoftSkill()}
//             placeholder="e.g., Leadership, Communication..."
//             className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//           />
//           <button
//             onClick={addSoftSkill}
//             className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600"
//             type="button"
//           >
//             Add
//           </button>
//         </div>

//         <div className="mb-3">
//           <div className="text-xs text-purple-300 mb-2">Quick add:</div>
//           <div className="flex flex-wrap gap-2">
//             {suggestedSoftSkills.map(
//               (skill, i) =>
//                 !formData.softSkills.includes(skill) && (
//                   <button
//                     key={i}
//                     onClick={() => addArrayItem("softSkills", skill)}
//                     className="px-3 py-1 rounded-lg bg-white/10 text-purple-200 text-xs hover:bg-white/20 transition"
//                     type="button"
//                   >
//                     + {skill}
//                   </button>
//                 )
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {formData.softSkills.map((skill, i) => (
//             <span
//               key={i}
//               className="px-3 py-1 rounded-lg bg-emerald-500/30 border border-emerald-400/50 text-white text-sm flex items-center gap-2"
//             >
//               {skill}
//               <button
//                 onClick={() => removeArrayItem("softSkills", i)}
//                 className="text-red-300 hover:text-red-200 font-bold"
//                 type="button"
//               >
//                 ×
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Tools & Software */}
//       <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
//         <h3 className="text-white font-bold text-xl mb-4">
//           Tools & Software
//         </h3>
//         <p className="text-purple-300 text-sm mb-4">
//           Software, platforms, and tools you're proficient in
//         </p>

//         <div className="flex gap-3 mb-4">
//           <input
//             type="text"
//             value={toolInput}
//             onChange={(e) => setToolInput(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && addTool()}
//             placeholder="e.g., Microsoft Excel, Figma, Salesforce..."
//             className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//           />
//           <button
//             onClick={addTool}
//             className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600"
//             type="button"
//           >
//             Add
//           </button>
//         </div>

//         <div className="mb-3">
//           <div className="text-xs text-purple-300 mb-2">
//             Browse by category:
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {Object.entries(suggestedTools).map(([category, tools], idx) => (
//               <div
//                 key={idx}
//                 className="p-3 rounded-lg bg-white/5 border border-white/10"
//               >
//                 <div className="text-xs font-semibold text-purple-200 mb-2">
//                   {category}
//                 </div>
//                 <div className="flex flex-wrap gap-1">
//                   {tools.slice(0, 3).map(
//                     (tool, i) =>
//                       !formData.tools.includes(tool) && (
//                         <button
//                           key={i}
//                           onClick={() => addArrayItem("tools", tool)}
//                           className="text-xs px-2 py-0.5 rounded bg-white/10 text-purple-300 hover:bg-white/20 transition"
//                           type="button"
//                         >
//                           + {tool}
//                         </button>
//                       )
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           {formData.tools.map((tool, i) => (
//             <span
//               key={i}
//               className="px-3 py-1 rounded-lg bg-pink-500/30 border border-pink-400/50 text-white text-sm flex items-center gap-2"
//             >
//               {tool}
//               <button
//                 onClick={() => removeArrayItem("tools", i)}
//                 className="text-red-300 hover:text-red-200 font-bold"
//                 type="button"
//               >
//                 ×
//               </button>
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */

// updated one 
import React, { useState, useEffect } from "react";
import { SkillsStepProps, CoreSkills } from "@/types/profileWizard";

export const SkillsStep: React.FC<SkillsStepProps> = ({
  formData,
  updateField,
  addArrayItem,
  removeArrayItem,
}) => {
  const [skillInput, setSkillInput] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  const suggestedCategories: string[] = [
    "Technical Skills",
    "Programming Languages",
    "Marketing Skills",
    "Financial Analysis",
    "Design Tools",
    "Business Strategy",
    "Data Analysis",
    "Sales Techniques",
    "Content Creation",
    "Healthcare Skills",
    "Legal Knowledge",
    "Operations Management",
  ];

  const suggestedSoftSkills: string[] = [
    "Communication",
    "Leadership",
    "Teamwork",
    "Problem Solving",
    "Time Management",
    "Adaptability",
    "Critical Thinking",
    "Creativity",
    "Attention to Detail",
    "Project Management",
    "Negotiation",
    "Public Speaking",
  ];

  const suggestedTools: Record<string, string[]> = {
    "IT/Tech": ["VS Code", "Git", "Docker", "AWS", "Jira", "Postman"],
    Design: [
      "Figma",
      "Adobe Photoshop",
      "Illustrator",
      "Canva",
      "Sketch",
      "InVision",
    ],
    Marketing: [
      "Google Analytics",
      "HubSpot",
      "Mailchimp",
      "SEMrush",
      "Hootsuite",
      "Buffer",
    ],
    Finance: [
      "Excel",
      "QuickBooks",
      "SAP",
      "Tableau",
      "Bloomberg Terminal",
      "Oracle",
    ],
    Data: ["Python", "SQL", "Tableau", "Power BI", "Excel", "R"],
    Business: [
      "Microsoft Office",
      "Salesforce",
      "Slack",
      "Asana",
      "Trello",
      "Notion",
    ],
    Content: [
      "WordPress",
      "Google Docs",
      "Grammarly",
      "Canva",
      "Adobe Premiere",
      "Final Cut",
    ],
  };

  // 🌟 Default professional skill sets to prepopulate
  const defaultCoreSkills: CoreSkills = {
    "Technical Skills": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    "Programming Languages": ["Python", "Java", "C++", "TypeScript"],
    "Design Tools": ["Figma", "Adobe Photoshop", "Canva"],
    "Data Analysis": ["Excel", "SQL", "Power BI", "Tableau"],
    "Marketing Skills": ["SEO", "Google Ads", "Social Media Marketing"],
  };

  // ✅ Load defaults if empty (one-time)
  useEffect(() => {
    if (Object.keys(formData.coreSkills).length === 0) {
      updateField("coreSkills", defaultCoreSkills);
    }
  }, []);

  const addCategory = (): void => {
    if (newCategory.trim() && !formData.coreSkills[newCategory.trim()]) {
      const updatedSkills: CoreSkills = {
        ...formData.coreSkills,
        [newCategory.trim()]: [],
      };
      updateField("coreSkills", updatedSkills);
      setSkillCategory(newCategory.trim());
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  const addSkill = (): void => {
    if (skillInput.trim() && skillCategory) {
      const updatedSkills: CoreSkills = { ...formData.coreSkills };

      if (!updatedSkills[skillCategory]) {
        updatedSkills[skillCategory] = [];
      }

      if (!updatedSkills[skillCategory].includes(skillInput.trim())) {
        updatedSkills[skillCategory] = [
          ...updatedSkills[skillCategory],
          skillInput.trim(),
        ];
        updateField("coreSkills", updatedSkills);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (category: string, skill: string): void => {
    const updatedSkills: CoreSkills = { ...formData.coreSkills };
    updatedSkills[category] = updatedSkills[category].filter(
      (s) => s !== skill
    );

    if (updatedSkills[category].length === 0) {
      delete updatedSkills[category];
    }

    updateField("coreSkills", updatedSkills);
  };

  const addSoftSkill = (): void => {
    if (
      softSkillInput.trim() &&
      !formData.softSkills.includes(softSkillInput.trim())
    ) {
      addArrayItem("softSkills", softSkillInput.trim());
      setSoftSkillInput("");
    }
  };

  const addTool = (): void => {
    if (toolInput.trim() && !formData.tools.includes(toolInput.trim())) {
      addArrayItem("tools", toolInput.trim());
      setToolInput("");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">
          Skills & Expertise
        </h2>
        <p className="text-purple-200">Showcase what makes you valuable</p>
      </div>

      {/* Professional Skills */}
      <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-xl">Professional Skills</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-sm px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition"
              type="button"
            >
              + Add Category
            </button>
            <button
              onClick={() => updateField("coreSkills", defaultCoreSkills)}
              className="text-sm px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition"
              type="button"
            >
              Reset to Recommended
            </button>
          </div>
        </div>

        {showAddCategory && (
          <div className="mb-4 p-4 rounded-lg bg-white/5 border border-white/10">
            <label className="block text-purple-200 text-sm mb-2">
              Create a skill category
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCategory()}
                placeholder="e.g., Marketing Skills, Financial Analysis..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600"
                type="button"
              >
                Add
              </button>
            </div>
            <div className="text-xs text-purple-300 mb-2">
              Or choose from suggestions:
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const updatedSkills: CoreSkills = {
                      ...formData.coreSkills,
                      [cat]: [],
                    };
                    updateField("coreSkills", updatedSkills);
                    setSkillCategory(cat);
                    setShowAddCategory(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-white/10 text-purple-200 text-xs hover:bg-white/20 transition"
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add new skill */}
        {Object.keys(formData.coreSkills).length > 0 && (
          <div className="mb-4">
            <div className="flex gap-3 mb-3">
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="">Select Category</option>
                {Object.keys(formData.coreSkills).map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                placeholder="Add a skill..."
                disabled={!skillCategory}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 disabled:opacity-50"
              />
              <button
                onClick={addSkill}
                disabled={!skillCategory}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Skill display */}
        <div className="space-y-4">
          {Object.entries(formData.coreSkills).map(([category, skills], idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-purple-200 font-semibold mb-2 flex items-center gap-2">
                {category}
                <span className="text-xs text-purple-400">
                  ({skills.length})
                </span>
              </h4>

              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-indigo-500/30 border border-indigo-400/50 text-white text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(category, skill)}
                      className="text-red-300 hover:text-red-200 font-bold"
                      type="button"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Quick add suggestions under each category */}
              {defaultCoreSkills[category]
                ?.filter((s) => !skills.includes(s))
                .slice(0, 4).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {defaultCoreSkills[category]
                    ?.filter((s) => !skills.includes(s))
                    .slice(0, 4)
                    .map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const updatedSkills = {
                            ...formData.coreSkills,
                            [category]: [...skills, suggestion],
                          };
                          updateField("coreSkills", updatedSkills);
                        }}
                        className="px-2 py-1 text-xs rounded bg-white/10 text-purple-300 hover:bg-white/20 transition"
                        type="button"
                      >
                        + {suggestion}
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
        <h3 className="text-white font-bold text-xl mb-4">Soft Skills</h3>
        <p className="text-purple-300 text-sm mb-4">
          Leadership, communication, and interpersonal abilities
        </p>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={softSkillInput}
            onChange={(e) => setSoftSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSoftSkill()}
            placeholder="e.g., Leadership, Communication..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={addSoftSkill}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600"
            type="button"
          >
            Add
          </button>
        </div>

        <div className="mb-3">
          <div className="text-xs text-purple-300 mb-2">Quick add:</div>
          <div className="flex flex-wrap gap-2">
            {suggestedSoftSkills.map(
              (skill, i) =>
                !formData.softSkills.includes(skill) && (
                  <button
                    key={i}
                    onClick={() => addArrayItem("softSkills", skill)}
                    className="px-3 py-1 rounded-lg bg-white/10 text-purple-200 text-xs hover:bg-white/20 transition"
                    type="button"
                  >
                    + {skill}
                  </button>
                )
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.softSkills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg bg-emerald-500/30 border border-emerald-400/50 text-white text-sm flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => removeArrayItem("softSkills", i)}
                className="text-red-300 hover:text-red-200 font-bold"
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tools & Software */}
      <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
        <h3 className="text-white font-bold text-xl mb-4">
          Tools & Software
        </h3>
        <p className="text-purple-300 text-sm mb-4">
          Software, platforms, and tools you&apos;re proficient in
        </p>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={toolInput}
            onChange={(e) => setToolInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTool()}
            placeholder="e.g., Microsoft Excel, Figma, Salesforce..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={addTool}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600"
            type="button"
          >
            Add
          </button>
        </div>

        <div className="mb-3">
          <div className="text-xs text-purple-300 mb-2">
            Browse by category:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(suggestedTools).map(([category, tools], idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="text-xs font-semibold text-purple-200 mb-2">
                  {category}
                </div>
                <div className="flex flex-wrap gap-1">
                  {tools.slice(0, 3).map(
                    (tool, i) =>
                      !formData.tools.includes(tool) && (
                        <button
                          key={i}
                          onClick={() => addArrayItem("tools", tool)}
                          className="text-xs px-2 py-0.5 rounded bg-white/10 text-purple-300 hover:bg-white/20 transition"
                          type="button"
                        >
                          + {tool}
                        </button>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.tools.map((tool, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg bg-pink-500/30 border border-pink-400/50 text-white text-sm flex items-center gap-2"
            >
              {tool}
              <button
                onClick={() => removeArrayItem("tools", i)}
                className="text-red-300 hover:text-red-200 font-bold"
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
