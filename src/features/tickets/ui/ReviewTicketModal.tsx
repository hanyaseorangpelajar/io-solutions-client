"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
  TagsInput,
  ComboboxItem,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import {
  TicketCompleteSchema,
  type TicketCompleteInput,
} from "../model/schema";
import type { ServiceTicketDto } from "../model/types";

export default function ReviewTicketModal({
  opened,
  onClose,
  onSubmit,
  ticket,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: TicketCompleteInput) => Promise<void> | void;
  ticket: ServiceTicketDto | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TicketCompleteInput>({
    resolver: zodResolver(TicketCompleteSchema),
    mode: "onChange",
    defaultValues: {
      diagnosis: "",
      solution: "",
      tags: [],
    },
  });

  const [tagData, setTagData] = useState<ComboboxItem[]>([]);

  useEffect(() => {
    if (opened && ticket) {
      reset({
        diagnosis: ticket.technicianDiagnosis || "",
        solution: ticket.technicianSolution || "",
        tags: [],
      });
      setTagData([]);
    }
  }, [opened, reset, ticket]);

  if (!ticket) return null;
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Review & Arsipkan Tiket: #${ticket.ticketNumber}`}
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
            error={errors.solution?.message}
            withAsterisk
            minRows={4}
            {...register("solution")}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagsInput
                {...field}
                label="Tags (Label)"
                placeholder="Ketik tag lalu tekan Enter..."
                data={tagData}
                clearable
                error={errors.tags?.message}
              />
            )}
          />

          <Group justify="end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              Review & Arsipkan ke KB
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
