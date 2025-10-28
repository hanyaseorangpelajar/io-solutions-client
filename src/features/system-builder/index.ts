// src/features/system-builder/index.ts

// ---- Model
export * from "./model/types";
export * from "./model/schema";
export * from "./model/pricing";

// ---- UI (default exports di-alias jadi named)
export { default as SystemBuilderPage } from "./ui/SystemBuilderPage";
export { default as BuildSummary } from "./ui/BuildSummary";
export { default as ComponentPicker } from "./ui/ComponentPicker";
export type { ComponentPickerValue } from "./ui/ComponentPicker";
export { default as SystemTypeCard } from "./ui/SystemTypeCard";
