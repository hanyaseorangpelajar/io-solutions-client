"use client";

import { useEffect } from "react";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PartFormSchema, type PartFormInput } from "../model/schema";

type Props = {
  opened: boolean;
  onClose: () => void;
  onSubmit: (v: PartFormInput) => void;
  title?: string;
  initial?: Partial<PartFormInput>;
};

const categories = [
  "Keyboard",
  "Display",
  "Cooling",
  "Network",
  "Storage",
  "Power",
];
const vendors = ["Generic", "ViewSonic", "Arctic", "AMP", "Seagate", "Antec"];

export default function PartFormModal({
  opened,
  onClose,
  onSubmit,
  title = "Tambah Part",
  initial,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PartFormInput>({
    resolver: zodResolver(PartFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      vendor: "",
      unit: "pcs",
      stock: 0,
      minStock: 0,
      location: "",
      price: undefined,
      status: "active",
      ...initial,
    },
  });

  useEffect(() => {
    if (opened) {
      reset({
        name: initial?.name ?? "",
        sku: initial?.sku ?? "",
        category: initial?.category ?? "",
        vendor: initial?.vendor ?? "",
        unit: initial?.unit ?? "pcs",
        stock: initial?.stock ?? 0,
        minStock: initial?.minStock ?? 0,
        location: initial?.location ?? "",
        price: initial?.price,
        status: initial?.status ?? "active",
      });
    }
  }, [opened, initial, reset]);

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
          <TextInput
            label="Nama part"
            withAsterisk
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput label="SKU" {...register("sku")} />
          <Select
            label="Kategori"
            data={categories}
            searchable
            allowDeselect
            onChange={(v) =>
              setValue("category", v ?? "", { shouldValidate: true })
            }
            value={undefined}
            placeholder={initial?.category ?? ""}
          />
          <Select
            label="Vendor"
            data={vendors}
            searchable
            allowDeselect
            onChange={(v) =>
              setValue("vendor", v ?? "", { shouldValidate: true })
            }
            value={undefined}
            placeholder={initial?.vendor ?? ""}
          />
          <Group grow>
            <TextInput label="Unit" withAsterisk {...register("unit")} />
            <NumberInput
              label="Min. stok"
              min={0}
              clampBehavior="strict"
              onChange={(v) =>
                setValue("minStock", Number(v) || 0, { shouldValidate: true })
              }
              defaultValue={initial?.minStock ?? 0}
            />
          </Group>
          <Group grow>
            <NumberInput
              label="Stok awal"
              min={0}
              clampBehavior="strict"
              onChange={(v) =>
                setValue("stock", Number(v) || 0, { shouldValidate: true })
              }
              defaultValue={initial?.stock ?? 0}
            />
            <NumberInput
              label="Harga (opsional)"
              min={0}
              clampBehavior="strict"
              onChange={(v) => setValue("price", Number(v) || 0)}
              defaultValue={initial?.price ?? undefined}
            />
          </Group>
          <TextInput label="Lokasi (rak/bin)" {...register("location")} />
          <Select
            label="Status"
            data={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "discontinued", label: "Discontinued" },
            ]}
            defaultValue={initial?.status ?? "active"}
            onChange={(v) =>
              setValue("status", (v as any) ?? "active", {
                shouldValidate: true,
              })
            }
          />

          <Group justify="end" mt="xs">
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
