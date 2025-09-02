"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Modal, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";
import TextField from "@/shared/ui/inputs/TextField";
import { TicketFormSchema, type TicketFormInput } from "../model/schema";
import type { Ticket } from "../model/types";

export default function TicketFormModal({
  opened,
  onClose,
  onSubmit,
  initial,
  mode = "create",
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: TicketFormInput) => Promise<void> | void;
  initial?: Partial<Ticket>;
  mode?: "create" | "edit";
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm<TicketFormInput>({
    resolver: zodResolver(TicketFormSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      requester: "",
      priority: "medium",
      status: "open",
      assignee: "",
      description: "",
    },
  });

  useEffect(() => {
    if (opened) {
      reset({
        subject: initial?.subject ?? "",
        requester: initial?.requester ?? "",
        priority: initial?.priority ?? "medium",
        status: initial?.status ?? "open",
        assignee: initial?.assignee ?? "",
        description: initial?.description ?? "",
      });
    }
  }, [opened, reset, initial]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === "create" ? "Buat Ticket" : "Ubah Ticket"}
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
        <Stack gap="sm">
          <TextField
            label="Subjek"
            placeholder="Masalah yang ingin dilaporkan"
            error={errors.subject?.message}
            autoFocus
            {...register("subject")}
          />

          <TextField
            label="Pemohon"
            placeholder="Nama pemohon"
            error={errors.requester?.message}
            {...register("requester")}
          />

          <Group grow>
            <Select
              label="Prioritas"
              data={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "urgent", label: "Urgent" },
              ]}
              defaultValue="medium"
              onChange={(v) =>
                setValue("priority", (v as any) ?? "medium", {
                  shouldValidate: true,
                })
              }
              value={undefined}
              // Mantine Select uncontrolled by default; we push into RHF via setValue
            />
            <Select
              label="Status"
              data={[
                { value: "open", label: "Open" },
                { value: "in_progress", label: "In progress" },
                { value: "resolved", label: "Resolved" },
                { value: "closed", label: "Closed" },
              ]}
              defaultValue="open"
              onChange={(v) =>
                setValue("status", (v as any) ?? "open", {
                  shouldValidate: true,
                })
              }
              value={undefined}
            />
          </Group>

          <TextField
            label="Teknisi (opsional)"
            placeholder="Nama teknisi"
            {...register("assignee")}
          />

          <Textarea
            label="Deskripsi"
            minRows={3}
            autosize
            {...register("description")}
          />

          <Group justify="end" mt="xs">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={!isValid}>
              {mode === "create" ? "Buat" : "Simpan"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
