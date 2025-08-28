"use client";

import Link from "next/link";
import { Button, Menu, type ButtonProps } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconChevronDown } from "@tabler/icons-react";
import type { ReactNode } from "react";

export const ACTIONS_DROPDOWN_VERSION = "0.1.1";

export type ActionConfirm = {
  title?: string;
  message?: ReactNode;
  labels?: { confirm?: string; cancel?: string };
  confirmProps?: Omit<ButtonProps, "style">;
};

export type ActionsDropdownItem =
  | {
      type?: "item";
      key?: string;
      label: string;
      icon?: ReactNode;
      onClick?: () => void;
      href?: string;
      disabled?: boolean;
      color?: string;
      confirm?: ActionConfirm;
    }
  | { type: "divider" };

export type ActionsDropdownProps = {
  label?: string;
  items: ActionsDropdownItem[];
  triggerSize?: ButtonProps["size"];
  triggerVariant?: ButtonProps["variant"];
  rightSection?: ReactNode;
  withinPortal?: boolean;
  position?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  shadow?: "xs" | "sm" | "md" | "lg" | "xl";
};

export default function ActionsDropdown({
  label = "Aksi",
  items,
  triggerSize = "xs",
  triggerVariant = "light",
  rightSection,
  withinPortal = true,
  position = "bottom-end",
  shadow = "md",
}: ActionsDropdownProps) {
  return (
    <Menu withinPortal={withinPortal} position={position} shadow={shadow}>
      <Menu.Target>
        <Button
          size={triggerSize}
          variant={triggerVariant}
          rightSection={rightSection ?? <IconChevronDown size={14} />}
        >
          {label}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((it, idx) => {
          if (it.type === "divider") return <Menu.Divider key={`div-${idx}`} />;

          const itemKey = it.key ?? `act-${idx}`;

          const handle = () => {
            if (it.disabled) return;
            if (it.confirm) {
              const c = it.confirm;
              modals.openConfirmModal({
                title: c.title ?? it.label,
                children: c.message ? <div>{c.message}</div> : undefined,
                labels: {
                  confirm: c.labels?.confirm ?? "Lanjut",
                  cancel: c.labels?.cancel ?? "Batal",
                },
                confirmProps: {
                  color: it.color ?? "red",
                  ...(c.confirmProps ?? {}),
                },
                onConfirm: () => it.onClick?.(),
              });
            } else {
              it.onClick?.();
            }
          };

          const common = {
            leftSection: it.icon,
            disabled: it.disabled,
            color: it.color as any,
          } as const;

          // Link item
          if (it.href) {
            return (
              <Menu.Item
                key={itemKey}
                {...common}
                component={Link}
                href={it.href as any}
              >
                {it.label}
              </Menu.Item>
            );
          }

          // OnClick item
          return (
            <Menu.Item key={itemKey} {...common} onClick={handle}>
              {it.label}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}
