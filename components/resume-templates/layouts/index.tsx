

// import TemplateModern from "./TemplateModern";
// import TemplateClassic from "./TemplateClassic";
// import TemplateMinimal from "./TemplateMinimal";

// /**
//  * Lightweight Template Registry
//  * (No measurements, no template configs)
//  */
// export const TEMPLATE_REGISTRY = {
//   TemplateModern: {
//     id: "TemplateModern",
//     name: "Modern ATS Resume",
//     component: TemplateModern,
//     description: "Clean, one-column layout optimized for ATS parsing.",
//   },

//   TemplateClassic: {
//     id: "TemplateClassic",
//     name: "Classic Professional",
//     component: TemplateClassic,
//     description: "Traditional two-column design with sidebar for skills.",
//   },

//   TemplateMinimal: {
//     id: "TemplateMinimal",
//     name: "Minimal Clean",
//     component: TemplateMinimal,
//     description: "Ultra-clean design with maximum ATS compatibility.",
//   },
// } as const;

// /**
//  * Get template registry entry
//  */
// export function getTemplateConfig(templateId: string) {
//   return (
//     TEMPLATE_REGISTRY[templateId as keyof typeof TEMPLATE_REGISTRY] ||
//     TEMPLATE_REGISTRY.TemplateModern
//   );
// }

// /**
//  * Get template component only
//  */
// export function getTemplateComponent(templateId: string) {
//   return getTemplateConfig(templateId).component;
// }

// /**
//  * Components map (legacy / convenience)
//  */
// export const TEMPLATE_COMPONENTS = {
//   TemplateModern,
//   TemplateClassic,
//   TemplateMinimal,
// };

// /**
//  * Named exports
//  */
// export {
//   TemplateModern,
//   TemplateClassic,
//   TemplateMinimal,
// };


// components/resume-templates/layouts/index.tsx
import TemplateModern from "./TemplateModern";
import TemplateClassic from "./TemplateClassic";
import TemplateMinimal from "./TemplateMinimal";

export const TEMPLATE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  TemplateModern,
  TemplateClassic,
  TemplateMinimal,
};

export { TemplateModern, TemplateClassic, TemplateMinimal };