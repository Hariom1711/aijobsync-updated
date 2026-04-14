
// // src/components/resume-templates/layouts/index.ts

// import TemplateModern, { TemplateModernConfig } from './TemplateModern';
// import TemplateClassic, { TemplateClassicConfig } from './TemplateClassic';
// import TemplateMinimal, { TemplateMinimalConfig } from './TemplateMinimal';
// import { TemplateConfig } from '@/types/template';

// // 🎯 CENTRALIZED TEMPLATE REGISTRY
// // Each template is registered with its component and measurement config
// export const TEMPLATE_REGISTRY: Record<string, TemplateConfig> = {
//   TemplateModern: {
//     id: "TemplateModern",
//     name: "Modern ATS Resume",
//     component: TemplateModern,
//     measurements: TemplateModernConfig,
//     description: "Clean, one-column layout optimized for ATS parsing.",
//   },
//   TemplateClassic: {
//     id: "TemplateClassic",
//     name: "Classic Professional",
//     component: TemplateClassic,
//     measurements: TemplateClassicConfig,
//     description: "Traditional two-column design with sidebar for skills.",
//   },
//   TemplateMinimal: {
//     id: "TemplateMinimal",
//     name: "Minimal Clean",
//     component: TemplateMinimal,
//     measurements: TemplateMinimalConfig,
//     description: "Ultra-clean design with maximum ATS compatibility.",
//   },
// };

// // 🎯 Helper function to get template config
// export function getTemplateConfig(templateId: string): TemplateConfig {
//   return TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY.TemplateModern;
// }

// // 🎯 Helper to get just the measurements
// export function getTemplateMeasurements(templateId: string) {
//   const config = getTemplateConfig(templateId);
//   return config.measurements;
// }

// // 🎯 Legacy export for backward compatibility
// // (Components only, without configs)
// export const TEMPLATE_COMPONENTS = Object.fromEntries(
//   Object.entries(TEMPLATE_REGISTRY).map(([key, config]) => [key, config.component])
// );

// // Named exports
// export { TemplateModern, TemplateClassic, TemplateMinimal };

import TemplateModern from "./TemplateModern";
import TemplateClassic from "./TemplateClassic";
import TemplateMinimal from "./TemplateMinimal";

/**
 * Lightweight Template Registry
 * (No measurements, no template configs)
 */
export const TEMPLATE_REGISTRY = {
  TemplateModern: {
    id: "TemplateModern",
    name: "Modern ATS Resume",
    component: TemplateModern,
    description: "Clean, one-column layout optimized for ATS parsing.",
  },

  TemplateClassic: {
    id: "TemplateClassic",
    name: "Classic Professional",
    component: TemplateClassic,
    description: "Traditional two-column design with sidebar for skills.",
  },

  TemplateMinimal: {
    id: "TemplateMinimal",
    name: "Minimal Clean",
    component: TemplateMinimal,
    description: "Ultra-clean design with maximum ATS compatibility.",
  },
} as const;

/**
 * Get template registry entry
 */
export function getTemplateConfig(templateId: string) {
  return (
    TEMPLATE_REGISTRY[templateId as keyof typeof TEMPLATE_REGISTRY] ||
    TEMPLATE_REGISTRY.TemplateModern
  );
}

/**
 * Get template component only
 */
export function getTemplateComponent(templateId: string) {
  return getTemplateConfig(templateId).component;
}

/**
 * Components map (legacy / convenience)
 */
export const TEMPLATE_COMPONENTS = {
  TemplateModern,
  TemplateClassic,
  TemplateMinimal,
};

/**
 * Named exports
 */
export {
  TemplateModern,
  TemplateClassic,
  TemplateMinimal,
};
