"use client";

import * as React from "react";
import Image from "next/image";

type NavbarProps = {
  title?: string;
  tagline?: string;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
};

export default function Navbar({
  title = "I/O SYSTEM INFORMATION",
  tagline = "DATA • INFORMATION • KNOWLEDGE • WISDOM",
  userName = "John Doe",
  userRole = "Admin",
  avatarUrl = "/avatar.png",
}: NavbarProps) {
  return (
    <header className="w-full border-b">
      <div className="mx-auto flex items-center justify-between p-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="btn-icon" aria-hidden="true">
            <span className="font-bold font-mono leading-none tracking-[0.02em] text-[11px] scale-[0.95]">
              I<span className="px-[1px]">/</span>O
            </span>
          </div>
          <div className="leading-tight">
            <h1
              className="text-sm font-semibold tracking-[0.2em] uppercase"
              aria-label={title}
              title={title}
            >
              {title}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-mono-muted">
              {tagline}
            </p>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <span className="block text-xs font-medium">{userName}</span>
            <span className="block text-[10px]">{userRole}</span>
          </div>
          <Image
            src={avatarUrl}
            alt={`Avatar of ${userName}`}
            width={36}
            height={36}
            className="rounded-none border grayscale transition duration-200 hover:grayscale-0"
          />
        </div>
      </div>
    </header>
  );
}
