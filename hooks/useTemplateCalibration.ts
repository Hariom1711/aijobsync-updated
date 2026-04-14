// hooks/useTemplateCalibration.ts
"use client";

import { useState, useEffect, useRef } from "react";
import { ResumeData } from "@/types/resume";
import { TemplateMeasurements } from "@/types/template";

interface CalibrationResult {
  measurements: TemplateMeasurements | null;
  isCalibrating: boolean;
  error: string | null;
}

/**
 * Auto-calibrates template measurements by rendering and measuring DOM elements
 */
export function useTemplateCalibration(
  templateId: string,
  resumeData: ResumeData,
  sectionOrder: (keyof ResumeData)[]
): CalibrationResult {
  const [measurements, setMeasurements] = useState<TemplateMeasurements | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const calibratedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Check if already calibrated for this template
    const cacheKey = `template_measurements_${templateId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        setMeasurements(parsedCache);
        setIsCalibrating(false);
        calibratedRef.current.add(templateId);
        // console.log(`✅ Using cached measurements for ${templateId}`);
        return;
      } catch (e) {
        console.warn('Failed to parse cached measurements', e);
      }
    }

    // Skip if already calibrating
    if (calibratedRef.current.has(templateId)) {
      return;
    }

    setIsCalibrating(true);
    calibratedRef.current.add(templateId);

    const calibrate = async () => {
      try {
        // console.log(`🔧 Auto-calibrating ${templateId}...`);

        // Create hidden measurement container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '794px';
        container.style.padding = '48px';
        container.style.visibility = 'hidden';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);

        // Render measurement template
        container.innerHTML = createMeasurementMarkup(templateId, resumeData, sectionOrder);

        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 300));

        // Measure elements
        const measured: any = {};

        // Header
        const header = container.querySelector('[data-measure="main-header"]');
        measured.headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 90;

        // Section gap
        const firstSection = container.querySelector('[data-section]');
        if (firstSection) {
          const styles = window.getComputedStyle(firstSection);
          measured.sectionGap = parseInt(styles.marginBottom) || 24;
        } else {
          measured.sectionGap = 24;
        }

        // Measure each section type
        const visibleSections = sectionOrder.filter(key => (resumeData[key] as any)?.visible);
        
        for (const sectionKey of visibleSections) {
          const section = container.querySelector(`[data-section="${sectionKey}"]`);
          if (!section) continue;

          // Section header
          const sectionHeader = section.querySelector('[data-measure="section-header"]');
          if (sectionHeader && !measured.sectionHeaderHeight) {
            measured.sectionHeaderHeight = Math.ceil(sectionHeader.getBoundingClientRect().height);
          }

          // Content
          const content = section.querySelector('[data-measure="section-content"]');
          if (content) {
            measured[`${sectionKey}Height`] = Math.ceil(content.getBoundingClientRect().height);
          }

          // Items
          const items = section.querySelectorAll('[data-measure="item"]');
          if (items.length > 0) {
            const heights = Array.from(items).map(item => 
              Math.ceil(item.getBoundingClientRect().height)
            );
            const avgHeight = Math.ceil(heights.reduce((a, b) => a + b, 0) / heights.length);
            measured[`${sectionKey}ItemHeight`] = avgHeight;
          }
        }

        // Cleanup
        document.body.removeChild(container);

        // Build final measurements object
        const finalMeasurements: TemplateMeasurements = {
          headerHeight: measured.headerHeight || 90,
          sectionGap: measured.sectionGap || 24,
          buffer: 80, // Default buffer
          sectionHeaderHeight: measured.sectionHeaderHeight || 40,
          summaryHeight: measured.summaryHeight || 60,
          skillsHeight: measured.skillsHeight || 80,
          experienceItemHeight: measured.experienceItemHeight || 100,
          projectItemHeight: measured.projectsItemHeight || 80,
          educationItemHeight: measured.educationItemHeight || 70,
          achievementItemHeight: measured.achievementsItemHeight || 30,
          certificationItemHeight: measured.certificationsItemHeight || 40,
        };

        // console.log(`✅ Auto-calibration complete for ${templateId}:`, finalMeasurements);

        // Cache the results
        localStorage.setItem(cacheKey, JSON.stringify(finalMeasurements));

        setMeasurements(finalMeasurements);
        setIsCalibrating(false);
      } catch (err) {
        console.error('Calibration error:', err);
        setError('Failed to calibrate template');
        setIsCalibrating(false);
      }
    };

    calibrate();

    return () => {
      // Cleanup if component unmounts during calibration
    };
  }, [templateId, resumeData, sectionOrder]);

  return { measurements, isCalibrating, error };
}

// Helper to create measurement markup
function createMeasurementMarkup(
  templateId: string,
  resumeData: ResumeData,
  sectionOrder: (keyof ResumeData)[]
): string {
  const visibleSections = sectionOrder.filter(key => (resumeData[key] as any)?.visible);

  // Header markup (skip for Classic template)
  const headerMarkup = templateId !== "TemplateClassic" ? `
    <div data-measure="main-header" class="border-b pb-3 mb-6">
      <h1 class="text-3xl font-bold">John Doe</h1>
      <div class="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
        <span>john.doe@email.com</span>
        <span>•</span>
        <span>+91 98765 43210</span>
      </div>
    </div>
  ` : '';

  // Sections markup
  const sectionsMarkup = visibleSections.map(sectionKey => {
    const section = (resumeData[sectionKey] as any);
    if (!section || !section.visible) return '';

    const headerClass = templateId === "TemplateModern" 
      ? "text-lg font-bold uppercase tracking-wide border-b pb-1"
      : templateId === "TemplateClassic"
      ? "text-base font-bold uppercase text-gray-800 border-b-2 border-gray-400 pb-1"
      : "text-sm font-bold uppercase tracking-widest text-gray-800";

    const textClass = templateId === "TemplateModern" ? "text-sm" : "text-xs";

    let contentMarkup = '';

    if (sectionKey === 'summary') {
      contentMarkup = `
        <div data-measure="section-content" class="mt-3">
          <p class="${textClass} leading-relaxed">${section.data}</p>
        </div>
      `;
    } else if (sectionKey === 'skills') {
      contentMarkup = `
        <div data-measure="section-content" class="mt-3">
          <div class="grid grid-cols-3 gap-4 ${textClass}">
            <div><div class="font-semibold">Technical</div></div>
            <div><div class="font-semibold">Soft</div></div>
            <div><div class="font-semibold">Tools</div></div>
          </div>
        </div>
      `;
    } else if (Array.isArray(section.data) && section.data.length > 0) {
      const items = section.data.slice(0, 2).map((item: any) => {
        if (sectionKey === 'experience') {
          return `
            <div data-measure="item" class="space-y-1">
              <div class="flex justify-between items-baseline">
                <h3 class="${templateId === 'TemplateModern' ? 'font-semibold' : 'font-bold text-sm'}">${item.title || 'Job Title'}</h3>
                <span class="text-xs text-gray-600">2020 - 2023</span>
              </div>
              <div class="${textClass} text-gray-600">${item.company || 'Company'}</div>
              <ul class="list-disc list-inside ${textClass} text-gray-700 ml-2">
                ${(item.description || ['Point 1', 'Point 2', 'Point 3']).map((d: string) => `<li>${d}</li>`).join('')}
              </ul>
            </div>
          `;
        } else if (sectionKey === 'education') {
          return `
            <div data-measure="item">
              <div class="flex justify-between">
                <div class="${templateId === 'TemplateModern' ? 'font-semibold' : 'font-bold text-sm'}">${item.degree || 'Degree'}</div>
                <div class="text-xs text-gray-600">2016 - 2020</div>
              </div>
              <div class="${textClass} text-gray-600">${item.institution || 'Institution'}</div>
            </div>
          `;
        } else if (sectionKey === 'projects') {
          return `
            <div data-measure="item">
              <div class="${templateId === 'TemplateModern' ? 'font-semibold' : 'font-bold text-sm'}">${item.name || 'Project'}</div>
              <div class="${textClass} text-gray-700 mt-1">${item.description || 'Description'}</div>
            </div>
          `;
        }
        return `<div data-measure="item" class="${textClass}">Item</div>`;
      }).join('');

      contentMarkup = `<div class="mt-3 space-y-4">${items}</div>`;
    }

    return `
      <div data-section="${sectionKey}" class="mb-6">
        <div data-measure="section-header">
          <h2 class="${headerClass}">${String(sectionKey).toUpperCase()}</h2>
        </div>
        ${contentMarkup}
      </div>
    `;
  }).join('');

  return `
    <div class="space-y-6 text-gray-900">
      ${headerMarkup}
      ${sectionsMarkup}
    </div>
  `;
}

// Export helper to clear cache
export function clearCalibrationCache(templateId?: string) {
  if (templateId) {
    localStorage.removeItem(`template_measurements_${templateId}`);
  } else {
    // Clear all
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('template_measurements_')) {
        localStorage.removeItem(key);
      }
    });
  }
}