// src/components/forms/PublishKBForm.tsx
"use client";

import * as React from "react";
import InputLabelField from "@/components/molecules/InputLabelField";
import SelectLabelField from "@/components/molecules/SelectLabelField";
import FormActions from "@/components/molecules/FormActions";
import TagChip from "@/components/atoms/TagChip";

type Mode = "create" | "read" | "update";
type Visibility = "internal" | "public";

export type PublishKBFormProps = {
  type: Mode; // umumnya "create"
  data?: {
    title?: string;
    summary?: string;
    tags?: string[];
  };
  id?: number | string;
  onClose: () => void;
};

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

  // --- Slug handling (auto sampai user mengedit manual) ---
  const [slug, setSlug] = React.useState<string>("");
  const [slugEdited, setSlugEdited] = React.useState(false);

  // Isi slug otomatis saat mount / saat title berubah, selama user belum edit slug manual
  React.useEffect(() => {
    if (!slugEdited && title.trim()) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  // Perlebar tipe ke union agar cocok dengan InputLabelField
  const onSlugChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSlugEdited(true);
    setSlug(e.target.value);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: publish ke KB (backend)
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* Preview ringkas */}
      <section className="card p-3 transition duration-200">
        <h3 className="font-semibold">{title || "Judul Artikel"}</h3>
        <p className="text-sm mt-1 whitespace-pre-wrap text-[var(--mono-muted)]">
          {data?.summary || "Ringkasan solusi akan muncul di sini…"}
        </p>
        {Array.isArray(data?.tags) && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tags.map((t) => (
              <TagChip key={t} className="px-2 py-0.5 text-[10px]">
                #{t}
              </TagChip>
            ))}
          </div>
        )}
      </section>

      {/* Form meta KB */}
      <InputLabelField
        id="title"
        label="Judul Artikel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
          selectClassName="h-9"
        />

        <SelectLabelField
          id="visibility"
          label="Visibilitas"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value as Visibility)}
          options={[
            { value: "internal", label: "Internal" },
            { value: "public", label: "Publik" },
          ]}
          disabled={isRead}
          selectClassName="h-9"
        />
      </div>

      <InputLabelField
        id="slug"
        label="Slug (opsional)"
        value={slug}
        onChange={onSlugChange}
        placeholder="asus-x455l-mati-total-short-3v5v"
        disabled={isRead}
        note={<span>Jika kosong, slug akan dibuat otomatis dari judul.</span>}
      />

      {/* Aksi */}
      <FormActions
        mode={type}
        onCancel={onClose}
        cancelText="Close"
        submitText="Publish"
      />
    </form>
  );
}
