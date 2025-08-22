"use client";
import { useMemo, useState } from "react";

export type Tiket = {
  id?: number | string;
  title?: string;
  class?: string;
  date?: string; // YYYY-MM-DD
};

type TiketFormProps = {
  type: "create" | "read" | "update";
  data?: Tiket;
  onClose: () => void;
};

const TiketForm = ({ type, data, onClose }: TiketFormProps) => {
  const initial = useMemo<Tiket>(
    () => ({
      title: data?.title ?? "",
      class: data?.class ?? "",
      date: data?.date ?? "",
    }),
    [data]
  );

  const [form, setForm] = useState<Tiket>(initial);
  const readOnly = type === "read";

  const onChange =
    (k: keyof Tiket) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit logic (API call)
    onClose();
  };

  return (
    <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-3">
      <label className="text-sm">
        <div className="mb-1">Title</div>
        <input
          value={form.title ?? ""}
          onChange={onChange("title")}
          className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
          placeholder="Title..."
          disabled={readOnly}
        />
      </label>

      <label className="text-sm">
        <div className="mb-1">Class</div>
        <input
          value={form.class ?? ""}
          onChange={onChange("class")}
          className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
          placeholder="Class..."
          disabled={readOnly}
        />
      </label>

      <label className="text-sm">
        <div className="mb-1">Date</div>
        <input
          value={form.date ?? ""}
          onChange={onChange("date")}
          className="w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60"
          placeholder="YYYY-MM-DD"
          disabled={readOnly}
        />
      </label>

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-black bg-white hover:bg-black hover:text-white transition"
        >
          {readOnly ? "Close" : "Cancel"}
        </button>
        {!readOnly && (
          <button
            type="submit"
            className="px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition"
          >
            {type === "create" ? "Create" : "Update"}
          </button>
        )}
      </div>
    </form>
  );
};

export default TiketForm;
