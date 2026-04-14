// // components/profile/EducationStep.tsx

// import React, { useState } from "react";
// import { GraduationCap } from "lucide-react";
// import { EducationStepProps, Education } from "@/types/profileWizard";

// export const EducationStep: React.FC<EducationStepProps> = ({
//   formData,
//   addArrayItem,
//   removeArrayItem,
// }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [currentEdu, setCurrentEdu] = useState<Education>({
//     degree: "",
//     field: "",
//     institution: "",
//     location: "",
//     startDate: "",
//     endDate: "",
//     grade: "",
//   });

//   const handleAdd = () => {
//     if (currentEdu.degree && currentEdu.institution) {
//       addArrayItem("education", currentEdu);
//       setCurrentEdu({
//         degree: "",
//         field: "",
//         institution: "",
//         location: "",
//         startDate: "",
//         endDate: "",
//         grade: "",
//       });
//       setShowForm(false);
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-3xl mx-auto">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-black text-white mb-2">Education</h2>
//         <p className="text-purple-200">Add your academic qualifications</p>
//       </div>

//       {formData.education.map((edu, index) => (
//         <div
//           key={index}
//           className="p-5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl"
//         >
//           <div className="flex justify-between items-start">
//             <div className="flex-1">
//               <h3 className="text-white font-bold text-lg">
//                 {edu.degree} {edu.field && `in ${edu.field}`}
//               </h3>
//               <p className="text-purple-200">{edu.institution}</p>
//               <p className="text-purple-300 text-sm">
//                 {edu.startDate} - {edu.endDate}
//               </p>
//               {edu.grade && (
//                 <p className="text-purple-300 text-sm">Grade: {edu.grade}</p>
//               )}
//             </div>
//             <button
//               onClick={() => removeArrayItem("education", index)}
//               className="text-red-400 hover:text-red-300 text-sm"
//             >
//               Remove
//             </button>
//           </div>
//         </div>
//       ))}

//       {!showForm ? (
//         <button
//           onClick={() => setShowForm(true)}
//           className="w-full py-4 rounded-xl border-2 border-dashed border-white/30 text-white hover:border-purple-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
//         >
//           <GraduationCap className="w-5 h-5" />
//           Add Education
//         </button>
//       ) : (
//         <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl space-y-4">
//           <div className="grid md:grid-cols-2 gap-4">
//             <input
//               type="text"
//               value={currentEdu.degree}
//               onChange={(e) =>
//                 setCurrentEdu({ ...currentEdu, degree: e.target.value })
//               }
//               placeholder="Degree (e.g., B.Tech)"
//               className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//             />
//             <input
//               type="text"
//               value={currentEdu.field}
//               onChange={(e) =>
//                 setCurrentEdu({ ...currentEdu, field: e.target.value })
//               }
//               placeholder="Field (e.g., Computer Science)"
//               className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//             />
//             <input
//               type="text"
//               value={currentEdu.institution}
//               onChange={(e) =>
//                 setCurrentEdu({ ...currentEdu, institution: e.target.value })
//               }
//               placeholder="Institution"
//               className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//             />
//             <input
//               type="text"
//               value={currentEdu.location}
//               onChange={(e) =>
//                 setCurrentEdu({ ...currentEdu, location: e.target.value })
//               }
//               placeholder="Location"
//               className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//             />
//             <input
//               type="text"
//               value={currentEdu.startDate}
//               onChange={(e) =>
//                 setCurrentEdu({ ...currentEdu, startDate: e.target.value })
//               }
//               placeholder="Start Date (YYYY-MM)"
//               className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//             />
//             <input
//               type="text"
//               value={currentEdu.endDate}
//               onChange={(e) =>
//                 setCurrentEdu({ ...currentEdu, endDate: e.target.value })
//               }
//               placeholder="End Date or 'Present'"
//               className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//             />
//             <input
//               type="text"
//               value={currentEdu.grade}
//               onChange={(e) =>
//                 setCurrentEdu({ ...currentEdu, grade: e.target.value })
//               }
//               placeholder="Grade/CGPA (optional)"
//               className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
//             />
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={handleAdd}
//               className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
//             >
//               Add Education
//             </button>
//             <button
//               onClick={() => setShowForm(false)}
//               className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// components/profile/EducationStep.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */


import React, { useState } from "react";
import { GraduationCap, Edit2, Trash2 } from "lucide-react";
import { EducationStepProps, Education } from "@/types/profileWizard";

export const EducationStep: React.FC<EducationStepProps> = ({
  formData,
  addArrayItem,
  removeArrayItem,
  updateField,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentEdu, setCurrentEdu] = useState<Education>({
    degree: "",
    field: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    grade: "",
  });

  const handleAdd = () => {
    if (currentEdu.degree && currentEdu.institution) {
      if (editingIndex !== null) {
        // Update existing education
        const updatedEducation = [...formData.education];
        updatedEducation[editingIndex] = currentEdu;
        updateField("education", updatedEducation);
        setEditingIndex(null);
      } else {
        // Add new education
        addArrayItem("education", currentEdu);
      }
      
      setCurrentEdu({
        degree: "",
        field: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        grade: "",
      });
      setShowForm(false);
    }
  };

  const handleEdit = (index: number) => {
    setCurrentEdu(formData.education[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(null);
    setCurrentEdu({
      degree: "",
      field: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      grade: "",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Education</h2>
        <p className="text-purple-200">Add your academic qualifications</p>
      </div>

      {formData.education.map((edu, index) => (
        <div
          key={index}
          className="p-5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">
                {edu.degree} {edu.field && `in ${edu.field}`}
              </h3>
              <p className="text-purple-200">{edu.institution}</p>
              {edu.location && (
                <p className="text-purple-300 text-sm">{edu.location}</p>
              )}
              <p className="text-purple-300 text-sm">
                {edu.startDate} - {edu.endDate}
              </p>
              {edu.grade && (
                <p className="text-purple-300 text-sm">Grade: {edu.grade}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 hover:text-purple-200 transition"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeArrayItem("education", index)}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-white/30 text-white hover:border-purple-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
        >
          <GraduationCap className="w-5 h-5" />
          Add Education
        </button>
      ) : (
        <div className="p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl space-y-4">
          <h3 className="text-white font-semibold text-lg">
            {editingIndex !== null ? "Edit Education" : "Add Education"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={currentEdu.degree}
              onChange={(e) =>
                setCurrentEdu({ ...currentEdu, degree: e.target.value })
              }
              placeholder="Degree (e.g., B.Tech)"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              value={currentEdu.field}
              onChange={(e) =>
                setCurrentEdu({ ...currentEdu, field: e.target.value })
              }
              placeholder="Field (e.g., Computer Science)"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              value={currentEdu.institution}
              onChange={(e) =>
                setCurrentEdu({ ...currentEdu, institution: e.target.value })
              }
              placeholder="Institution"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              value={currentEdu.location}
              onChange={(e) =>
                setCurrentEdu({ ...currentEdu, location: e.target.value })
              }
              placeholder="Location"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              value={currentEdu.startDate}
              onChange={(e) =>
                setCurrentEdu({ ...currentEdu, startDate: e.target.value })
              }
              placeholder="Start Date (YYYY-MM)"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              value={currentEdu.endDate}
              onChange={(e) =>
                setCurrentEdu({ ...currentEdu, endDate: e.target.value })
              }
              placeholder="End Date or 'Present'"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              value={currentEdu.grade}
              onChange={(e) =>
                setCurrentEdu({ ...currentEdu, grade: e.target.value })
              }
              placeholder="Grade/CGPA (optional)"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
            >
              {editingIndex !== null ? "Update Education" : "Add Education"}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};