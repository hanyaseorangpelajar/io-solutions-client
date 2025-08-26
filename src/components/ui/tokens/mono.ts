// src/components/ui/tokens/mono.ts
export const mono = {
  // surface primitives
  card: "bg-surface text-fg border border-border rounded-none",
  panel: "bg-surface text-fg border border-border",

  // spacing shells
  shell: "p-4",
  section: "space-y-4",

  // table row hover invert
  rowInvert: "group/row hover:bg-fg hover:text-bg",

  // action icon button (ghost & solid)
  btnBase:
    "inline-flex items-center justify-center rounded-none border transition " +
    "focus:outline-none focus:ring-0",
  btnGhost:
    "border-border bg-bg text-fg hover:bg-fg hover:text-bg " +
    "[&_*]:text-fg hover:[&_*]:text-bg",
  btnSolid:
    "border-border bg-fg text-bg hover:bg-bg hover:text-fg " +
    "[&_*]:text-bg hover:[&_*]:text-fg",

  // small chips / badges
  chip: "inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] uppercase tracking-widest border border-border",

  // headings
  h1: "text-lg font-semibold",
  h2: "text-sm font-semibold uppercase tracking-wider",
} as const;

export type Mono = typeof mono;
