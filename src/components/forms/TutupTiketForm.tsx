"use client";

import { useMemo, useState } from "react";
import { XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_PARTS"
  | "COMPLETED"
  | "CANCELED";

export type TutupTiketPayload = {
  resolutionSummary: string;
  rootCause?: string;
  tests?: string;
  parts?: { name: string; qty: number; unitCost?: number }[];
  laborHours?: number;
  laborCost?: number;
  warrantyDays?: number;
  customerName?: string;
  acknowledged?: boolean;
  followUpDate?: string;
  finalStatus: Extract<TicketStatus, "COMPLETED" | "CANCELED">;
  cancelReason?: string;
};

export type TicketLite = {
  id?: string | number;
  title?: string;
};

type Props = {
  type: "create" | "read" | "update";
  data?: TicketLite;
  onClose: () => void;
  onSubmit?: (payload: TutupTiketPayload) => Promise<void> | void;
};

const rowCls = "flex flex-col gap-1";
const inputCls =
  "w-full border border-black px-3 py-2 rounded-none bg-white disabled:bg-white/60";
const btnPrimary =
  "px-4 py-2 border border-black bg-black text-white hover:bg-white hover:text-black transition";
const btnGhost =
  "px-3 py-2 border border-black bg-white hover:bg-black hover:text-white transition";
const chip =
  "inline-flex items-center gap-1 border border-black px-1.5 py-0.5 text-[10px] uppercase tracking-widest";

const TutupTiketForm = ({ data, onClose, onSubmit }: Props) => {
  const initial = useMemo<TutupTiketPayload>(
    () => ({
      resolutionSummary: "",
      rootCause: "",
      tests: "",
      parts: [],
      laborHours: undefined,
      laborCost: undefined,
      warrantyDays: 30,
      customerName: "",
      acknowledged: false,
      followUpDate: "",
      finalStatus: "COMPLETED",
      cancelReason: "",
    }),
    []
  );

  const [form, setForm] = useState<TutupTiketPayload>(initial);

  const set = <K extends keyof TutupTiketPayload>(
    k: K,
    v: TutupTiketPayload[K]
  ) => setForm((s) => ({ ...s, [k]: v }));

  const addPart = () =>
    setForm((s) => ({
      ...s,
      parts: [...(s.parts || []), { name: "", qty: 1, unitCost: undefined }],
    }));

  const removePart = (idx: number) =>
    setForm((s) => ({
      ...s,
      parts: (s.parts || []).filter((_, i) => i !== idx),
    }));

  const changePart =
    (idx: number, key: "name" | "qty" | "unitCost") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((s) => {
        const parts = [...(s.parts || [])];
        const raw = e.target.value;
        parts[idx] = {
          ...parts[idx],
          [key]:
            key === "name"
              ? raw
              : raw === ""
              ? (undefined as any)
              : Number(raw),
        };
        return { ...s, parts };
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.resolutionSummary.trim()) {
      alert("Resolution summary wajib diisi.");
      return;
    }
    if (form.finalStatus === "CANCELED" && !form.cancelReason?.trim()) {
      alert("Alasan pembatalan wajib diisi untuk status CANCELED.");
      return;
    }

    try {
      await onSubmit?.(form);
    } finally {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={chip}>Close Ticket</span>
          {data?.id && (
            <span className="text-xs border border-black px-2 py-1 rounded-none">
              ID: {String(data.id)}
            </span>
          )}
        </div>
        {data?.title && (
          <div className="text-xs max-w-[60%] truncate text-right">
            {data.title}
          </div>
        )}
      </div>

      <div className={rowCls}>
        <label className="text-sm font-medium">Resolution Summary *</label>
        <textarea
          rows={4}
          className={inputCls}
          placeholder="Jelaskan solusi yang dilakukan, langkah perbaikan, hasil akhir..."
          value={form.resolutionSummary}
          onChange={(e) => set("resolutionSummary", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className={rowCls}>
          <label className="text-sm font-medium">Root Cause</label>
          <textarea
            rows={3}
            className={inputCls}
            placeholder="Akar masalah/penyebab..."
            value={form.rootCause}
            onChange={(e) => set("rootCause", e.target.value)}
          />
        </div>
        <div className={rowCls}>
          <label className="text-sm font-medium">Tests Performed</label>
          <textarea
            rows={3}
            className={inputCls}
            placeholder="Contoh: power-on test, stress test, I/O test, burn-in 2 jam..."
            value={form.tests}
            onChange={(e) => set("tests", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Parts Used</label>
          <button
            type="button"
            onClick={addPart}
            className={btnGhost}
            aria-label="Add part"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        {(form.parts || []).length === 0 && (
          <div className="text-xs text-black/60">Belum ada item.</div>
        )}
        <div className="flex flex-col gap-2">
          {(form.parts || []).map((p, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <input
                className={inputCls + " md:col-span-3"}
                placeholder="Nama part (mis. Keyboard ASUS K456)"
                value={p.name}
                onChange={changePart(idx, "name")}
              />
              <input
                type="number"
                className={inputCls}
                placeholder="Qty"
                min={1}
                value={p.qty ?? ""}
                onChange={changePart(idx, "qty")}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  className={inputCls + " flex-1"}
                  placeholder="Unit Cost"
                  min={0}
                  step="0.01"
                  value={p.unitCost ?? ""}
                  onChange={changePart(idx, "unitCost")}
                />
                <button
                  type="button"
                  onClick={() => removePart(idx)}
                  className={btnGhost}
                  aria-label="Remove part"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={rowCls}>
          <label className="text-sm font-medium">Labor Hours</label>
          <input
            type="number"
            min={0}
            step="0.25"
            className={inputCls}
            placeholder="Contoh: 1.5"
            value={form.laborHours ?? ""}
            onChange={(e) =>
              set(
                "laborHours",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
          />
        </div>
        <div className={rowCls}>
          <label className="text-sm font-medium">Labor Cost</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className={inputCls}
            placeholder="Contoh: 150000"
            value={form.laborCost ?? ""}
            onChange={(e) =>
              set(
                "laborCost",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
          />
        </div>
        <div className={rowCls}>
          <label className="text-sm font-medium">Warranty (days)</label>
          <input
            type="number"
            min={0}
            className={inputCls}
            placeholder="Contoh: 30"
            value={form.warrantyDays ?? ""}
            onChange={(e) =>
              set(
                "warrantyDays",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className={rowCls}>
          <label className="text-sm font-medium">Customer Name</label>
          <input
            className={inputCls}
            placeholder="Nama pelanggan"
            value={form.customerName ?? ""}
            onChange={(e) => set("customerName", e.target.value)}
          />
          <label className="inline-flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              className="appearance-none size-4 border border-black checked:bg-black"
              checked={!!form.acknowledged}
              onChange={(e) => set("acknowledged", e.target.checked)}
            />
            <span>Customer acknowledged (setuju/ambil unit)</span>
          </label>
        </div>
        <div className={rowCls}>
          <label className="text-sm font-medium">Follow Up Date</label>
          <input
            type="date"
            className={inputCls}
            value={form.followUpDate ?? ""}
            onChange={(e) => set("followUpDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={rowCls}>
          <label className="text-sm font-medium">Final Status</label>
          <select
            className={inputCls}
            value={form.finalStatus}
            onChange={(e) =>
              set(
                "finalStatus",
                e.target.value as TutupTiketPayload["finalStatus"]
              )
            }
          >
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
        </div>
        {form.finalStatus === "CANCELED" && (
          <div className={"md:col-span-2 " + rowCls}>
            <label className="text-sm font-medium">Cancel Reason</label>
            <input
              className={inputCls}
              placeholder="Alasan pembatalan..."
              value={form.cancelReason ?? ""}
              onChange={(e) => set("cancelReason", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onClose} className={btnGhost}>
          Cancel
        </button>
        <button type="submit" className={btnPrimary}>
          Save & Close
        </button>
      </div>
    </form>
  );
};

export default TutupTiketForm;
