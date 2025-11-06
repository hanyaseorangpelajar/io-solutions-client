"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";
import {
  TicketResolutionSchema,
  type TicketResolutionInput,
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
  onSubmit: (data: TicketResolutionInput) => Promise<void> | void;
  ticket: Ticket | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TicketResolutionInput>({
    resolver: zodResolver(TicketResolutionSchema),
    mode: "onChange",
    defaultValues: {
      solution: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (opened) {
      reset({
        solution: ticket?.resolution?.solution ?? "",
        notes: ticket?.resolution?.notes ?? "",
      });
    }
  }, [opened, reset, ticket]);

  if (!ticket) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Resolve Ticket: #${ticket.code}`}
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
            label="Solusi yang Diberikan"
            placeholder="Jelaskan langkah-langkah solusi yang telah dilakukan..."
            error={errors.solution?.message}
            withAsterisk
            minRows={4}
            {...register("solution")}
          />

          <Textarea
            label="Catatan Tambahan (Opsional)"
            placeholder="Catatan internal atau informasi tambahan..."
            error={errors.notes?.message}
            minRows={3}
            {...register("notes")}
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
