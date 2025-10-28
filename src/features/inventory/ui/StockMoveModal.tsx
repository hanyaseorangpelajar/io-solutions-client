"use client";

import { useEffect } from "react";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Radio,
  Stack,
  TextInput,
} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StockMoveSchema, type StockMoveInput } from "../model/schema";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: StockMoveInput) => Promise<void> | void;
  title?: string;
  initialType?: "in" | "out" | "adjust";
  isSubmitting?: boolean;
};

export default function StockMoveModal({
  opened,
  onClose,
  onSubmit,
  title = "Mutasi Stok",
  initialType = "in",
  isSubmitting,
}: Props) {
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<StockMoveInput>({
    resolver: zodResolver(StockMoveSchema),
    mode: "onChange",
    defaultValues: {
      type: initialType,
      qty: 1,
      ref: "",
      note: "",
    },
  });

  useEffect(() => {
    if (opened) reset({ type: initialType, qty: 1, ref: "", note: "" });
  }, [opened, initialType, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      radius="lg"
      size="sm"
      centered
    >
      <form
        onSubmit={handleSubmit(async (v) => {
          try {
            await onSubmit(v);
            onClose();
          } catch (e) {
            console.error("Gagal submit stock move:", e);
          }
        })}
        noValidate
      >
        <Stack gap="md">
          <Radio.Group
            name="type"
            label="Jenis mutasi"
            defaultValue={initialType}
            onChange={(v) =>
              setValue("type", v as any, { shouldValidate: true })
            }
          >
            <Group>
              <Radio value="in" label="Stock In" />
              <Radio value="out" label="Stock Out" />
              <Radio value="adjust" label="Adjust" />
            </Group>
          </Radio.Group>

          <NumberInput
            label="Jumlah"
            min={1}
            clampBehavior="strict"
            defaultValue={1}
            onChange={(v) =>
              setValue("qty", Number(v) || 1, { shouldValidate: true })
            }
          />

          <TextInput
            label="Referensi (opsional)"
            placeholder="PO/WO/TT"
            onChange={(e) => setValue("ref", e.currentTarget.value)}
          />
          <TextInput
            label="Catatan (opsional)"
            onChange={(e) => setValue("note", e.currentTarget.value)}
          />

          <Group justify="end">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={!isValid} loading={isSubmitting}>
              Simpan
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
