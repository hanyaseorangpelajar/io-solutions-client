"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Stack, Textarea, Title } from "@mantine/core";
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
      rootCause: "",
      solution: "",
      parts: [],
      photos: [],
      tags: [],
      extraCosts: [],
    },
  });

  useEffect(() => {
    if (opened) {
      reset({
        rootCause: ticket?.resolution?.rootCause ?? "",
        solution: ticket?.resolution?.solution ?? "",
        parts: ticket?.resolution?.parts ?? [],
        photos: ticket?.resolution?.photos ?? [],
        tags: ticket?.resolution?.tags ?? [],
        extraCosts: ticket?.resolution?.extraCosts ?? [],
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
            label="Akar Masalah (Root Cause)"
            placeholder="Jelaskan apa yang menjadi akar penyebab masalah..."
            error={errors.rootCause?.message}
            withAsterisk
            minRows={4}
            {...register("rootCause")}
          />

          <Textarea
            label="Solusi yang Diberikan"
            placeholder="Jelaskan langkah-langkah solusi yang telah dilakukan..."
            error={errors.solution?.message}
            withAsterisk
            minRows={4}
            {...register("solution")}
          />
          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Simpan Resolusi
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
