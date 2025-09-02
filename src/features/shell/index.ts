// src/features/shell/index.ts

// UI (default exports)
export { default as AppShellLayout } from "./ui/AppShellLayout";
export { default as HeaderBar } from "./ui/HeaderBar";
export { default as SidebarNav } from "./ui/SidebarNav";

// Types dari model
export type { NavItem } from "./model/nav";

// Nav preset (tanpa ikon)
export { SYSADMIN_NAV } from "./model/nav";

// Alias nyaman untuk layout
import { SYSADMIN_NAV as __SYSADMIN_NAV } from "./model/nav";
export const defaultNav = __SYSADMIN_NAV;
