"use client";

import { useState } from "react";
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  TextInput,
  Textarea,
  Select,
  FileInput,
  Button,
  Card,
  SimpleGrid,
} from "@mantine/core";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<string | null>("umum");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const submit = () => {
    console.log({ subject, category, message, attachment });
    // tambahkan integrasi: kirim ke ticketing/support API
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <div>
          <Title order={3} style={{ lineHeight: 1.2 }}>
            Dukungan Pengguna
          </Title>
          <Text c="dimmed">
            Butuh bantuan? Hubungi kami atau kirimkan permintaan dukungan.
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Card withBorder radius="md" p="md">
          <Title order={5} style={{ lineHeight: 1.2 }}>
            Kontak
          </Title>
          <Stack gap={6} mt="xs">
            <Text>Email: support@io-solutions.local</Text>
            <Text>Telepon: 021-1234-5678</Text>
            <Text>Jam: 09.00 – 17.00 WIB</Text>
          </Stack>
        </Card>

        <Paper withBorder radius="md" p="md">
          <Stack gap="md">
            <TextInput
              label="Subjek"
              placeholder="Tuliskan inti masalah"
              value={subject}
              onChange={(e) => setSubject(e.currentTarget.value)}
              withAsterisk
            />
            <Select
              label="Kategori"
              data={[
                { value: "umum", label: "Umum" },
                { value: "akun", label: "Akun & Login" },
                { value: "tiket", label: "Tickets" },
                { value: "inventory", label: "Inventory" },
                { value: "lainnya", label: "Lainnya" },
              ]}
              value={category}
              onChange={setCategory}
              withAsterisk
            />
            <Textarea
              label="Deskripsi"
              placeholder="Jelaskan masalah atau pertanyaan kamu"
              autosize
              minRows={4}
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
              withAsterisk
            />
            <FileInput
              label="Lampiran (opsional)"
              placeholder="Pilih file…"
              value={attachment}
              onChange={setAttachment}
            />
            <Group justify="end">
              <Button variant="default">Bersihkan</Button>
              <Button onClick={submit}>Kirim</Button>
            </Group>
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
