// /* eslint-disable @typescript-eslint/no-explicit-any */

// // Sidebar.tsx (left column)
// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import SectionToggles from "@/components/resume/SectionToggles";
// import { ResumeData } from "@/types/resume";
// import { Download } from "lucide-react";

// export default function Sidebar({
//   resumeData,
//   toggleSection,
//   onEdit,
//   onAddSection,
//   sectionOrder,
//   setSectionOrder,
  
// }: {
//   resumeData: ResumeData;
//   toggleSection: (k: keyof ResumeData) => void;
//   onEdit: (k: keyof ResumeData) => void;
//   onAddSection: () => void;
//   sectionOrder: (keyof ResumeData)[];
//   setSectionOrder: React.Dispatch<React.SetStateAction<(keyof ResumeData)[]>>;
// }) {
//   return (
//     <Card className="border-white/10 bg-white/10 backdrop-blur-xl lg:col-span-1 h-fit sticky top-6">
//       <CardContent className="p-5 space-y-4">
//         <h2 className="text-white text-lg font-bold mb-2">Customize Resume</h2>
//         <SectionToggles resumeData={resumeData} toggleSection={toggleSection} onEdit={onEdit} onAddSection={onAddSection} sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} />
//         <Button className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//           <Download className="w-4 h-4 mr-2" />
//           Export PDF
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */

// Sidebar.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionToggles from "@/components/resume/SectionToggles";
import { ResumeData } from "@/types/resume";
import { Download, Loader2 } from "lucide-react";
import { exportResumeToPDF } from "@/utils/exportResumePDF";

export default function Sidebar({
  resumeData,
  toggleSection,
  onEdit,
  onAddSection,
  sectionOrder,
  setSectionOrder,
}: {
  resumeData: ResumeData;
  toggleSection: (k: keyof ResumeData) => void;
  onEdit: (k: keyof ResumeData) => void;
  onAddSection: () => void;
  sectionOrder: (keyof ResumeData)[];
  setSectionOrder: React.Dispatch<React.SetStateAction<(keyof ResumeData)[]>>;
}) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      const success = await exportResumeToPDF('my-resume.pdf');
      
      if (success) {
        // Optional: Show success message
        console.log('PDF exported successfully!');
      } else {
        // Optional: Show error message
        alert('Failed to export PDF. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/10 backdrop-blur-xl lg:col-span-1 h-fit sticky top-6">
      <CardContent className="p-5 space-y-4">
        <h2 className="text-white text-lg font-bold mb-2">Customize Resume</h2>
        
        <SectionToggles 
          resumeData={resumeData} 
          toggleSection={toggleSection} 
          onEdit={onEdit} 
          onAddSection={onAddSection} 
          sectionOrder={sectionOrder} 
          setSectionOrder={setSectionOrder} 
        />
        
        <Button 
          className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}