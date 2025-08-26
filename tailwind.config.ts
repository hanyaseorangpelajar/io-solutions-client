import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "var(--mono-border)",
      },
      ringColor: {
        DEFAULT: "var(--mono-fg)",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        mono: {
          bg: "var(--mono-bg)",
          fg: "var(--mono-fg)",
          border: "var(--mono-border)",
          overlay: "var(--mono-overlay)",
          muted: "var(--mono-muted)",
          label: "var(--mono-label)",
          ph: "var(--mono-ph)",
        },
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
