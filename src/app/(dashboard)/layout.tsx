// src/app/(dashboard)/layout.tsx
import * as React from "react";
import Navbar from "@/components/organisms/Navbar";
import Menu from "@/components/organisms/Menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <div className="p-4 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        {/* Mobile menu (native, tanpa JS) */}
        <section className="lg:hidden">
          <details className="border">
            <summary className="px-3 py-2 cursor-pointer hover:bg-mono-fg hover:text-mono-bg transition">
              Menu
            </summary>
            <div className="p-3">
              <Menu />
            </div>
          </details>
        </section>

        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block sticky top-4 self-start">
          <Menu />
        </aside>

        {/* Page content */}
        <main className="min-h-[60vh]">{children}</main>
      </div>
    </>
  );
}
