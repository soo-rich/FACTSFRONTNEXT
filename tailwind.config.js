import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            // COULEUR PRIMAIRE - Bleu SOS MART
            primary: {
              50: "#eff8ff",
              100: "#dbeefe",
              200: "#bfe3fd",
              300: "#93d4fb",
              400: "#60bdf7",
              500: "#3ba0f2", // Bleu principal du logo
              600: "#2584e7",
              700: "#1e6fd4",
              800: "#1f5aab",
              900: "#1e4d87",
              950: "#173152",
              DEFAULT: "#3ba0f2",
              foreground: "#ffffff",
            },

            // COULEUR SECONDAIRE - Vert Group
            secondary: {
              50: "#f0fdf4",
              100: "#dcfce7",
              200: "#bbf7d0",
              300: "#86efac",
              400: "#4ade80",
              500: "#22c55e", // Vert principal du logo
              600: "#16a34a",
              700: "#15803d",
              800: "#166534",
              900: "#14532d",
              950: "#052e16",
              DEFAULT: "#22c55e",
              foreground: "#ffffff",
            },

            // COULEUR ACCENT - Orange/Jaune du symbole
            warning: {
              50: "#fffbeb",
              100: "#fef3c7",
              200: "#fde68a",
              300: "#fcd34d",
              400: "#fbbf24",
              500: "#f59e0b", // Orange/jaune du symbole
              600: "#d97706",
              700: "#b45309",
              800: "#92400e",
              900: "#78350f",
              950: "#451a03",
              DEFAULT: "#f59e0b",
              foreground: "#ffffff",
            },

            // COULEURS NEUTRES pour l'équilibre
            default: {
              50: "#f8fafc",
              100: "#f1f5f9",
              200: "#e2e8f0",
              300: "#cbd5e1",
              400: "#94a3b8",
              500: "#64748b",
              600: "#475569",
              700: "#334155",
              800: "#1e293b",
              900: "#0f172a",
              950: "#020617",
              DEFAULT: "#64748b",
              foreground: "#ffffff",
            },

            // SUCCESS - Utilise une variante du vert
            success: {
              50: "#ecfdf5",
              100: "#d1fae5",
              200: "#a7f3d0",
              300: "#6ee7b7",
              400: "#34d399",
              500: "#10b981",
              600: "#059669",
              700: "#047857",
              800: "#065f46",
              900: "#064e3b",
              950: "#022c22",
              DEFAULT: "#10b981",
              foreground: "#ffffff",
            },

            // DANGER - Rouge complémentaire
            danger: {
              50: "#fef2f2",
              100: "#fee2e2",
              200: "#fecaca",
              300: "#fca5a5",
              400: "#f87171",
              500: "#ef4444",
              600: "#dc2626",
              700: "#b91c1c",
              800: "#991b1b",
              900: "#7f1d1d",
              950: "#450a0a",
              DEFAULT: "#ef4444",
              foreground: "#ffffff",
            },
          },
        },

        dark: {
          colors: {
            // COULEUR PRIMAIRE - Bleu SOS MART (ajusté pour le dark)
            primary: {
              50: "#0a1628",
              100: "#0f2540",
              200: "#1e4d87",
              300: "#1f5aab",
              400: "#1e6fd4",
              500: "#2584e7",
              600: "#3ba0f2", // Bleu principal (plus clair en dark)
              700: "#60bdf7",
              800: "#93d4fb",
              900: "#bfe3fd",
              950: "#dbeefe",
              DEFAULT: "#3ba0f2",
              foreground: "#ffffff",
            },

            // COULEUR SECONDAIRE - Vert Group (ajusté pour le dark)
            secondary: {
              50: "#0a1f0a",
              100: "#14532d",
              200: "#166534",
              300: "#15803d",
              400: "#16a34a",
              500: "#22c55e",
              600: "#4ade80", // Vert principal (plus clair en dark)
              700: "#86efac",
              800: "#bbf7d0",
              900: "#dcfce7",
              950: "#f0fdf4",
              DEFAULT: "#4ade80",
              foreground: "#000000",
            },

            // COULEUR ACCENT - Orange/Jaune (ajusté pour le dark)
            warning: {
              50: "#1c1917",
              100: "#78350f",
              200: "#92400e",
              300: "#b45309",
              400: "#d97706",
              500: "#f59e0b",
              600: "#fbbf24", // Orange/jaune (plus clair en dark)
              700: "#fcd34d",
              800: "#fde68a",
              900: "#fef3c7",
              950: "#fffbeb",
              DEFAULT: "#fbbf24",
              foreground: "#000000",
            },

            // Autres couleurs adaptées pour le dark mode
            default: {
              50: "#020617",
              100: "#0f172a",
              200: "#1e293b",
              300: "#334155",
              400: "#475569",
              500: "#64748b",
              600: "#94a3b8",
              700: "#cbd5e1",
              800: "#e2e8f0",
              900: "#f1f5f9",
              950: "#f8fafc",
              DEFAULT: "#334155",
              foreground: "#f8fafc",
            },

            success: {
              50: "#022c22",
              100: "#064e3b",
              200: "#065f46",
              300: "#047857",
              400: "#059669",
              500: "#10b981",
              600: "#34d399",
              700: "#6ee7b7",
              800: "#a7f3d0",
              900: "#d1fae5",
              950: "#ecfdf5",
              DEFAULT: "#34d399",
              foreground: "#000000",
            },

            danger: {
              50: "#450a0a",
              100: "#7f1d1d",
              200: "#991b1b",
              300: "#b91c1c",
              400: "#dc2626",
              500: "#ef4444",
              600: "#f87171",
              700: "#fca5a5",
              800: "#fecaca",
              900: "#fee2e2",
              950: "#fef2f2",
              DEFAULT: "#f87171",
              foreground: "#000000",
            },
          },
        },
      },
    }),
  ],
};

module.exports = config;
