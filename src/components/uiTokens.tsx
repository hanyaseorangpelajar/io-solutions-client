// src/components/uiTokens.ts
export const mono = {
  label: "text-xs uppercase tracking-widest text-black/70",
  control:
    "w-full border border-black bg-white px-3 py-2 rounded-none outline-none placeholder:text-black/40",
  note: "text-[10px] text-black/60",

  // Buttons
  btnPrimary:
    "px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition",
  btnGhost:
    "px-3 py-2 border border-black bg-white hover:bg-black hover:text-white transition",

  // Icon button (8x8) + ikon
  iconBtn:
    "group w-8 h-8 inline-flex items-center justify-center rounded-none border border-black bg-black hover:bg-white transition",
  icon: "w-4 h-4 text-white group-hover:text-black transition-colors",

  // Chip/tag (warna default hitam; bisa di-invert saat row hover)
  chip: "inline-flex items-center gap-1 border border-black px-2 py-0.5 text-[10px] uppercase tracking-widest bg-black text-white",
};
