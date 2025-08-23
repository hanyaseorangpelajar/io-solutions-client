// src/components/forms/PublishKBForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/InputLabelField";
import SelectLabelField from "@/components/SelectLabelField";
import FormActions from "@/components/FormActions"; // ⟵ tambah

type Mode = "create" | "read" | "update";
export type PublishKBFormProps = {
  type: Mode; // biasanya "create" untuk publish
  data?: any; // hasil audit: title/summary/tags/steps/dll
  id?: number | string;
  onClose: () => void;
};

type Visibility = "internal" | "public";

function slugify(val: string) {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PublishKBForm({
  type,
  data,
  onClose,
}: PublishKBFormProps) {
  const isRead = type === "read";

  const [title, setTitle] = React.useState<string>(data?.title ?? "");
  const [category, setCategory] = React.useState<string>("hardware");
  const [visibility, setVisibility] = React.useState<Visibility>("internal");
  const [slug, setSlug] = React.useState<string>("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: publish ke KB (backend)
    onClose();
  };

  const handleTitleBlur = () => {
    if (!slug.trim() && title.trim()) {
      setSlug(slugify(title));
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* Preview ringkas */}
      <div className="border border-black p-3">
        <h3 className="font-semibold">{title || "Judul Artikel"}</h3>
        <p className="text-sm mt-1 whitespace-pre-wrap">
          {data?.summary || "Ringkasan solusi akan muncul di sini…"}
        </p>
        {Array.isArray(data?.tags) && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tags.map((t: string) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[10px] border border-black bg-white"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Form meta KB */}
      <InputLabelField
        id="title"
        label="Judul Artikel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        placeholder="Judul artikel KB"
        disabled={isRead}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SelectLabelField
          id="category"
          label="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: "hardware", label: "Hardware" },
            { value: "software", label: "Software" },
            { value: "network", label: "Network" },
            { value: "printer", label: "Printer" },
            { value: "other", label: "Lainnya" },
          ]}
          disabled={isRead}
        />

        <SelectLabelField
          id="visibility"
          label="Visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as Visibility)}
          options={[
            { value: "internal", label: "Internal" },
            { value: "public", label: "Public" },
          ]}
          disabled={isRead}
        />
      </div>

      <InputLabelField
        id="slug"
        label="Slug (opsional)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="asus-x455l-mati-total-short-3v5v"
        disabled={isRead}
        note={<span>Jika kosong, slug akan dibuat otomatis dari judul.</span>}
      />

      {/* Aksi (reusable) */}
      <FormActions
        mode={type}
        onCancel={onClose}
        cancelText="Close"
        submitText="Publish"
      />
    </form>
  );
}
