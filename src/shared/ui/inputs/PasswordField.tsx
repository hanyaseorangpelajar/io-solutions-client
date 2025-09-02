"use client";

import { PasswordInput, Text, type PasswordInputProps } from "@mantine/core";
import { useCallback, useState } from "react";

export type PasswordFieldProps = PasswordInputProps & {
  /** Tampilkan asterisk wajib secara konsisten */
  requiredAsterisk?: boolean;
  /** Menampilkan hint Caps Lock aktif di bawah input */
  showCapsLockHint?: boolean;
};

export default function PasswordField({
  requiredAsterisk = true,
  withAsterisk,
  showCapsLockHint = true,
  onKeyDown,
  onKeyUp,
  ...props
}: PasswordFieldProps) {
  const [capsOn, setCapsOn] = useState(false);

  const handleKeyEvt = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      setCapsOn(!!e.getModifierState?.("CapsLock"));
    },
    []
  );

  return (
    <>
      <PasswordInput
        withAsterisk={withAsterisk ?? (props.required && requiredAsterisk)}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyEvt(e);
        }}
        onKeyUp={(e) => {
          onKeyUp?.(e);
          handleKeyEvt(e);
        }}
        {...props}
      />
      {showCapsLockHint && capsOn && (
        <Text size="xs" c="red.6" mt={4}>
          Caps Lock aktif
        </Text>
      )}
    </>
  );
}
