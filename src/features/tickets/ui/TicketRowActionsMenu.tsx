"use client";

import Link from "next/link";
import { Button, Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconChevronDown,
  IconCircleCheck,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import type { Ticket } from "../model/types";

type Props = {
  ticket: Ticket;
  onEdit: () => void;
  onResolve: () => void;
  onDelete: () => void;
  disableResolve?: boolean;
};

export default function TicketRowActionsMenu({
  ticket,
  onEdit,
  onResolve,
  onDelete,
  disableResolve,
}: Props) {
  return (
    <Menu withinPortal position="bottom-end" shadow="md">
      <Menu.Target>
        <Button
          size="xs"
          variant="light"
          rightSection={<IconChevronDown size={14} />}
        >
          Aksi
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEye size={16} />}
          component={Link}
          href={`/views/tickets/${encodeURIComponent(ticket.id)}`}
        >
          Lihat detail
        </Menu.Item>

        <Menu.Item leftSection={<IconPencil size={16} />} onClick={onEdit}>
          Ubah
        </Menu.Item>

        <Menu.Item
          leftSection={<IconCircleCheck size={16} />}
          onClick={onResolve}
          disabled={disableResolve}
        >
          Tandai selesai
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={() =>
            modals.openConfirmModal({
              title: "Hapus ticket?",
              children: (
                <Text size="sm">
                  {ticket.code} akan dihapus. Tindakan ini tidak dapat
                  dibatalkan.
                </Text>
              ),
              labels: { confirm: "Hapus", cancel: "Batal" },
              confirmProps: { color: "red" },
              onConfirm: onDelete,
            })
          }
        >
          Hapus
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
