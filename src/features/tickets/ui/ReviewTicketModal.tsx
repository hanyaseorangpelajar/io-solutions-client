"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Text,
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
import type { Ticket } from "../model/types";

export default function ReviewTicketModal({
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
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TicketCompleteInput>({
    resolver: zodResolver(TicketCompleteSchema),
    mode: "onChange",
    defaultValues: {
      diagnosis: "",
      solusi: "",
      tags: [],
    },
  });

  const [tagData, setTagData] = useState<ComboboxItem[]>([]);

  useEffect(() => {
    if (opened && ticket) {
      reset({
        diagnosis: ticket.diagnosisTeknisi || "",
        solusi: ticket.solusiTeknisi || "",
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
      title={`Review & Arsipkan Tiket: #${ticket.nomorTiket}`}
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
