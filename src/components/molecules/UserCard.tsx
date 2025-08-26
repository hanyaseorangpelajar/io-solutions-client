"use client";
import * as React from "react";
import MonoCard from "@/components/molecules/MonoCard";

type UserCardProps = {
  type: string;
};

export default function UserCard({ type }: UserCardProps) {
  return (
    <MonoCard
      padding
      className="min-w-[130px]"
      header={
        <div className="flex items-center justify-between">
          <span className="badge">2024/25</span>
        </div>
      }
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tabular-nums">1,234</h1>
        <h2 className="text-sm font-bold capitalize">{type}s</h2>
      </div>
    </MonoCard>
  );
}
