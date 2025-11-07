"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";
import {
  TicketCompleteSchema,
  type TicketCompleteInput,
} from "../model/schema";
import type { Ticket } from "../model/types";

export default function ResolveTicketModal({
  opened,
  onClose,
  onSubmit,
  ticket,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: TicketCompleteInput) => Promise<void> | void;
  ticket: Ticket | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TicketCompleteInput>({
    resolver: zodResolver(TicketCompleteSchema),
    mode: "onChange",
    defaultValues: {
      diagnosis: "",
      solusi: "",
    },
  });

  useEffect(() => {
    if (opened) {
      reset({
        diagnosis: "",
        solusi: "",
      });
    }
  }, [opened, reset, ticket]);

  if (!ticket) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Selesaikan Tiket: #${ticket.nomorTiket}`}
      radius="lg"
      size="xl"
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
            label="Diagnosis"
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
              Selesaikan & Buat Knowledge Base
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
