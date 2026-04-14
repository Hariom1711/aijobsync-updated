// utils/exportResumePDF.ts
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportResumeToPDF(filename: string = 'resume.pdf'): Promise<boolean> {
  try {
    // Get the resume preview container
    const element = document.getElementById('resume-preview-container');
    
    if (!element) {
      console.error('Resume preview container not found');
      return false;
    }

    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Create a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);
    tempContainer.appendChild(clone);

    // Remove problematic styles that html2canvas can't handle
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlEl);
      
      // Replace oklch/oklab colors with their computed RGB values
      if (computedStyle.backgroundColor && 
          (computedStyle.backgroundColor.includes('oklch') || 
           computedStyle.backgroundColor.includes('oklab'))) {
        // Get computed color and set it explicitly
        const color = computedStyle.backgroundColor;
        htmlEl.style.backgroundColor = color;
      }
      
      if (computedStyle.color && 
          (computedStyle.color.includes('oklch') || 
           computedStyle.color.includes('oklab'))) {
        const color = computedStyle.color;
        htmlEl.style.color = color;
      }

      // Remove any CSS variables that might use oklch
      if (htmlEl.style.cssText.includes('oklch') || 
          htmlEl.style.cssText.includes('oklab')) {
        htmlEl.style.cssText = '';
      }
    });

    // Capture the cloned element as a high-quality canvas
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher quality (2x resolution)
      useCORS: true, // Allow cross-origin images
      logging: false, // Disable console logs
      backgroundColor: '#ffffff', // White background
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Additional cleanup in cloned document
        const clonedElement = clonedDoc.getElementById('resume-preview-container');
        if (clonedElement) {
          // Force white background
          clonedElement.style.backgroundColor = '#ffffff';
        }
      }
    });

    // Clean up temporary container
    document.body.removeChild(tempContainer);

    // A4 dimensions in mm (portrait)
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    // Calculate image dimensions to fit A4
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
      undefined,
      'FAST'
    );
    
    heightLeft -= pdfHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        'FAST'
      );
      heightLeft -= pdfHeight;
    }

    // Save the PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return false;
  }
}