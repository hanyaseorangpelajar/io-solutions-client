"use client";

import { TextInput, type TextInputProps } from "@mantine/core";

export type TextFieldProps = TextInputProps & {
  /** Tampilkan asterisk wajib secara konsisten */
  requiredAsterisk?: boolean;
};

export default function TextField({
  requiredAsterisk = true,
  withAsterisk,
  ...props
}: TextFieldProps) {
  return (
    <TextInput
      withAsterisk={withAsterisk ?? (props.required && requiredAsterisk)}
      {...props}
    />
  );
}
