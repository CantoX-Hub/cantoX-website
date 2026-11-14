"use client";

import { createTheme } from "@mui/material/styles";

export const BRAND = {
  gold: "#C99532",
  goldDark: "#A87A22",
  goldTint: "#FBF4E6",
  navy: "#060D18",
  ink: "#0F0F0F",
  muted: "#6B7280",
  line: "#E8E8EC",
  canvas: "#F6F6F8",
} as const;

export const dashboardTheme = createTheme({
  palette: {
    primary: { main: BRAND.gold, dark: BRAND.goldDark, contrastText: "#FFFFFF" },
    secondary: { main: BRAND.navy, contrastText: "#FFFFFF" },
    text: { primary: BRAND.ink, secondary: BRAND.muted },
    divider: BRAND.line,
    success: { main: "#16A34A" },
    warning: { main: "#D97706" },
    background: { default: BRAND.canvas, paper: "#FFFFFF" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: { fontFamily: '"Cal Sans", "DM Sans", sans-serif' },
    h2: { fontFamily: '"Cal Sans", "DM Sans", sans-serif' },
    h3: { fontFamily: '"Cal Sans", "DM Sans", sans-serif' },
    h4: { fontFamily: '"Cal Sans", "DM Sans", sans-serif' },
    h5: { fontFamily: '"Cal Sans", "DM Sans", sans-serif' },
    h6: { fontFamily: '"Cal Sans", "DM Sans", sans-serif' },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8, paddingInline: 16 } },
    },
    MuiIconButton: {
      styleOverrides: { root: { "&:focus-visible": { outline: `2px solid ${BRAND.gold}`, outlineOffset: 2 } } },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 12 } } },
    MuiMenu: {
      styleOverrides: { paper: { border: `1px solid ${BRAND.line}`, boxShadow: "0 12px 32px rgba(6,13,24,0.10)" } },
    },
    MuiPopover: {
      styleOverrides: { paper: { border: `1px solid ${BRAND.line}`, boxShadow: "0 12px 32px rgba(6,13,24,0.10)" } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    MuiTooltip: {
      styleOverrides: { tooltip: { backgroundColor: BRAND.navy, fontSize: 12 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.line },
        },
      },
    },
    MuiTab: { styleOverrides: { root: { textTransform: "none", fontWeight: 500, minHeight: 44 } } },
  },
});
