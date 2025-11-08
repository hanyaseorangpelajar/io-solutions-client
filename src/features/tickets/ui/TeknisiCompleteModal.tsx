"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, Textarea, Alert } from "@mantine/core";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Ticket } from "../model/types";
import type { TeknisiCompleteInput } from "../api/tickets";
import { IconInfoCircle } from "@tabler/icons-react";

const teknisiSchema = z.object({
  diagnosis: z.string().min(5, "Diagnosis wajib diisi, minimal 5 karakter."),
  solusi: z.string().min(10, "Solusi wajib diisi, minimal 10 karakter."),
});

export default function TeknisiCompleteModal({
  opened,
  onClose,
  onSubmit,
  ticket,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: TeknisiCompleteInput) => Promise<void> | void;
  ticket: Ticket | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TeknisiCompleteInput>({
    resolver: zodResolver(teknisiSchema),
    mode: "onChange",
    defaultValues: {
      diagnosis: "",
      solusi: "",
    },
  });

  useEffect(() => {
    if (opened && ticket) {
      reset({
        diagnosis: ticket.diagnosisTeknisi || "",
        solusi: ticket.solusiTeknisi || "",
      });
    }
  }, [opened, reset, ticket]);

  if (!ticket) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Tutup Tiket: #${ticket.nomorTiket}`}
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
          <Alert
            variant="light"
            color="blue"
            title="Catatan Teknisi"
            icon={<IconInfoCircle />}
          >
            Catatan diagnosis dan solusi Anda akan di-review oleh Admin sebelum
            diarsipkan ke Knowledge Base.
          </Alert>

          <Textarea
            label="Diagnosis Teknisi"
            placeholder="Jelaskan diagnosis akhir dari masalah..."
            error={errors.diagnosis?.message}
            withAsterisk
            minRows={3}
            {...register("diagnosis")}
          />

          <Textarea
            label="Solusi yang Diberikan"
            placeholder="Jelaskan langkah-langkah solusi yang telah dilakukan..."
            error={errors.solusi?.message}
            withAsterisk
            minRows={4}
            {...register("solusi")}
          />

          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Tandai Selesai
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
