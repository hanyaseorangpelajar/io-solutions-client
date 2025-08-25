"use client";

import * as React from "react";
import FormActions from "../../../ui/form/FormActions";
import InputLabelField from "@/components/ui/fields/InputLabelField";

type Mode = "create" | "read" | "update";
export type AuditPengetahuanFormProps = {
  type: Mode;
  data?: {
    title?: string;
    summary?: string;
    rootCause?: string;
    steps?: string;
    verification?: string;
    tags?: string[];
  };
  id?: number | string;
  onClose: () => void;
};

export default function AuditPengetahuanForm({
  type,
  data,
  onClose,
}: AuditPengetahuanFormProps) {
  const isRead = type === "read";

  const [title, setTitle] = React.useState<string>(data?.title ?? "");
  const [summary, setSummary] = React.useState<string>(data?.summary ?? "");
  const [rootCause, setRootCause] = React.useState<string>(
    data?.rootCause ?? ""
  );
  const [steps, setSteps] = React.useState<string>(data?.steps ?? "");
  const [verification, setVerification] = React.useState<string>(
    data?.verification ?? ""
  );
  const [tags, setTags] = React.useState<string[]>(data?.tags ?? []);

  // Sinkron saat `data` berubah (mis. modal dibuka untuk item berbeda)
  React.useEffect(() => {
    setTitle(data?.title ?? "");
    setSummary(data?.summary ?? "");
    setRootCause(data?.rootCause ?? "");
    setSteps(data?.steps ?? "");
    setVerification(data?.verification ?? "");
    setTags(data?.tags ?? []);
  }, [data]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: kirim data ke backend nanti
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <InputLabelField
        id="title"
        label="Judul (ringkas & deskriptif)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Contoh: ASUS X455L mati total — short MOSFET 3V/5V"
        disabled={isRead}
        required
      />

      <InputLabelField
        id="summary"
        label="Ringkasan Solusi"
        multiline
        rows={4}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Jelaskan solusi akhir secara ringkas…"
        disabled={isRead}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputLabelField
          id="rootCause"
          label="Akar Masalah"
          multiline
          rows={4}
          value={rootCause}
          onChange={(e) => setRootCause(e.target.value)}
          placeholder="Penyebab, komponen rusak, kondisi pendukung…"
          disabled={isRead}
        />
        <InputLabelField
          id="verification"
          label="Pengujian/Verifikasi"
          multiline
          rows={4}
          value={verification}
          onChange={(e) => setVerification(e.target.value)}
          placeholder="Power-on test, stress test, burn-in, I/O test…"
          disabled={isRead}
        />
      </div>

      <InputLabelField
        id="steps"
        label="Langkah Perbaikan (bullet/urutan)"
        multiline
        rows={5}
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        placeholder={`- Cek adaptor
- Ukur rail 19V
- Ganti MOSFET AO4407…`}
        disabled={isRead}
        note="Gunakan poin singkat agar mudah dibaca."
      />
      <FormActions
        mode={"update"}
        onCancel={onClose}
        submitText="Simpan & Tutup"
      />
    </form>
  );
}
