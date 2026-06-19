export const theme = {
  colors: {
    primary: "#ff5018",
    secondary: "#381d2a",

    background: "#0f0f12",
    surface: "#16161d",
    surfaceHover: "#1e1e28",

    textPrimary: "#ffffff",
    textSecondary: "#b5b5b5",
    textMuted: "#6b6b7b",

    border: "rgba(255,255,255,0.08)",
    borderSubtle: "rgba(255,255,255,0.04)",

    success: "#22c55e",
    successMuted: "rgba(34,197,94,0.15)",
    error: "#ef4444",
    errorMuted: "rgba(239,68,68,0.15)",
    warning: "#f59e0b",
    warningMuted: "rgba(245,158,11,0.15)",
    info: "#3b82f6",
    infoMuted: "rgba(59,130,246,0.15)",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  borderRadius: {
    sm: "8px",
    md: "10px",
    lg: "12px",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
} as const;

export type ThemeColors = keyof typeof theme.colors;
