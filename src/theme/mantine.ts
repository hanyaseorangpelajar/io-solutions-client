import {
  createTheme,
  type MantineColorScheme,
  MantineColorsTuple,
  rem,
} from "@mantine/core";
import type { MantineTheme } from "@mantine/core";

/** Palet “monochrome flat” — netral, high contrast */
const mono: MantineColorsTuple = [
  "#f7f7f7",
  "#ececec",
  "#d9d9d9",
  "#c6c6c6",
  "#b1b1b1",
  "#9b9b9b",
  "#767676",
  "#525252",
  "#303030",
  "#121212",
];
export const DEFAULT_SCHEME: MantineColorScheme = "auto";
const theme = createTheme({
  colors: { mono },
  primaryColor: "mono",
  primaryShade: { light: 8, dark: 5 },
  defaultRadius: "md",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
  headings: { fontWeight: "600" },

  /**
   * Catatan:
   * - Jangan pakai selector gabungan dengan koma dalam objek styles (mis. "&:focus, &:focus-within").
   * - Untuk :focus-within gunakan camelCase: "&:focusWithin".
   * - Skema warna pakai CSS function light-dark() + CSS variables Mantine.
   */
  components: {
    Button: {
      defaultProps: { radius: "md", size: "sm" },
      styles: (t: MantineTheme) => ({
        root: {
          borderWidth: rem(1),
          borderStyle: "solid",
          borderColor: t.colors.mono[7],
          boxShadow: "none",
        },
      }),
    },

    TextInput: {
      defaultProps: { radius: "md", size: "sm" },
      styles: (_t: MantineTheme) => ({
        input: {
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
          borderColor: "var(--mantine-color-mono-4)",
          boxShadow: "none",
          outline: "none",
          "&:focus": {
            borderColor: "var(--mantine-color-mono-6)",
          },
          "&:focusWithin": {
            borderColor: "var(--mantine-color-mono-6)",
          },
        },
      }),
    },

    PasswordInput: {
      defaultProps: { radius: "md", size: "sm" },
      styles: (_t: MantineTheme) => ({
        input: {
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
          borderColor: "var(--mantine-color-mono-4)",
          boxShadow: "none",
          outline: "none",
          "&:focus": {
            borderColor: "var(--mantine-color-mono-6)",
          },
          "&:focusWithin": {
            borderColor: "var(--mantine-color-mono-6)",
          },
        },
      }),
    },

    Select: {
      defaultProps: { radius: "md", size: "sm" },
      styles: (_t: MantineTheme) => ({
        input: {
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
          borderColor: "var(--mantine-color-mono-4)",
          outline: "none",
          "&:focus": {
            borderColor: "var(--mantine-color-mono-6)",
          },
          "&:focusWithin": {
            borderColor: "var(--mantine-color-mono-6)",
          },
        },
      }),
    },

    Modal: {
      defaultProps: {
        radius: "lg",
        centered: true,
        size: "lg",
        overlayProps: { blur: 2, opacity: 0.65 },
      },
      styles: (_t: MantineTheme) => ({
        content: {
          border: `${rem(1)} solid var(--mantine-color-mono-7)`,
          background:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))",
        },
        header: { marginBottom: rem(8) },
      }),
    },

    Table: {
      styles: (_t: MantineTheme) => ({
        table: { borderCollapse: "separate", borderSpacing: "0" },
        th: {
          fontWeight: 600,
          background:
            "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
          borderBottom: `${rem(1)} solid var(--mantine-color-mono-7)`,
        },
        td: {
          borderBottom: `${rem(
            1
          )} solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6))`,
        },
        tr: {
          transition: "background-color 120ms ease",
          "&[dataHovered]": {
            background:
              "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
          },
        },
      }),
    },
  },
});

export default theme;
