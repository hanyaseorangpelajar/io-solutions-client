"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Skema Zod lokal khusus untuk form ini
const DiagnosisSchema = z.object({
  symptom: z.string().min(1, "Gejala/Symptom wajib diisi"),
  diagnosis: z.string().min(1, "Hasil diagnosis wajib diisi"),
});

type DiagnosisFormInput = z.infer<typeof DiagnosisSchema>;

export default function AddDiagnosisModal({
  opened,
  onClose,
  onSubmit,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: DiagnosisFormInput) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DiagnosisFormInput>({
    resolver: zodResolver(DiagnosisSchema),
    mode: "onChange",
    defaultValues: {
      symptom: "",
      diagnosis: "",
    },
  });

  useEffect(() => {
    if (opened) {
      reset(); // Selalu reset saat modal dibuka
    }
  }, [opened, reset]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Tambah Diagnosis Teknisi"
      radius="lg"
      size="lg"
      centered
    >
      <form
        onSubmit={handleSubmit(async (v) => {
          await onSubmit(v);
          onClose();
        })}
        noValidate
      >
        <Stack gap="md">
          <Textarea
            label="Gejala / Keluhan"
            placeholder="Jelaskan gejala yang ditemukan atau keluhan pelanggan..."
            error={errors.symptom?.message}
            withAsterisk
            minRows={3}
            {...register("symptom")}
          />

          <Textarea
            label="Hasil Diagnosis"
            placeholder="Jelaskan temuan atau diagnosis teknis Anda..."
            error={errors.diagnosis?.message}
            withAsterisk
            minRows={3}
            {...register("diagnosis")}
          />

          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Simpan Diagnosis
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
