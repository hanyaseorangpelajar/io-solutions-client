"use client";

import { useEffect } from "react";
import {
  Button,
  Group,
  Modal,
  Stack,
  TagsInput,
  Text,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuditFormSchema, type AuditFormInput } from "../model/schema";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: AuditFormInput) => void;
  title?: string;
  initial?: Partial<AuditFormInput>;
  recommendedScore?: number;
  /** Tambahkan tombol untuk membuka editor konten resolusi */
  onEditResolution?: () => void;
};

export default function AuditFormModal({
  opened,
  onClose,
  onSubmit,
  title = "Audit Ticket",
  initial,
  recommendedScore,
  onEditResolution,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AuditFormInput>({
    resolver: zodResolver(AuditFormSchema),
    mode: "onChange",
    defaultValues: {
      score: Math.round(recommendedScore ?? 60),
      tags: [],
      notes: "",
      ...initial,
    },
  });

  useEffect(() => {
    if (opened) {
      reset({
        score: Math.round(initial?.score ?? recommendedScore ?? 60),
        tags: initial?.tags ?? [],
        notes: initial?.notes ?? "",
      });
    }
  }, [opened, initial, recommendedScore, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      radius="lg"
      size="md"
      centered
    >
      <form
        onSubmit={handleSubmit((v) => {
          onSubmit(v);
          onClose();
        })}
        noValidate
      >
        <Stack gap="md">
          <NumberInput
            label="Skor kualitas (0–100)"
            min={0}
            max={100}
            clampBehavior="strict"
            withAsterisk
            defaultValue={Math.round(recommendedScore ?? 60)}
            onChange={(n) =>
              setValue("score", Number(n) || 0, { shouldValidate: true })
            }
            error={errors.score?.message}
          />
          {recommendedScore !== undefined && (
            <Text size="xs" c="dimmed">
              Rekomendasi sistem: {Math.round(recommendedScore)}
            </Text>
          )}

          <TagsInput
            label="Tag kurasi"
            placeholder="#hardware #keyboard"
            withAsterisk
            data={[
              "hardware",
              "keyboard",
              "display",
              "network",
              "software",
              "SOP",
              "rootcause",
            ]}
            onChange={(v) => setValue("tags", v, { shouldValidate: true })}
            error={errors.tags?.message}
          />

          <Textarea
            label="Catatan auditor"
            minRows={3}
            autosize
            {...register("notes")}
          />

          <Group justify="space-between" mt="xs">
            {onEditResolution && (
              <Button variant="subtle" onClick={onEditResolution}>
                Edit konten resolusi…
              </Button>
            )}
            <Group>
              <Button variant="default" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                Simpan
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
