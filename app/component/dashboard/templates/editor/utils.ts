import type { TemplateTheme } from "@/app/types/template.types";

/* ---------- Time: the schema stores "1:00 PM", <input type="time"> wants "13:00" ---------- */

export function to24h(time: string | undefined): string {
  const m = time?.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return "";
  let h = Number(m[1]);
  const ampm = m[3]?.toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

export function to12h(time: string): string {
  const [hh, mm] = time.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return time;
  const ampm = hh >= 12 ? "PM" : "AM";
  return `${hh % 12 || 12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

/* ---------- Files ---------- */

/**
 * Reads an image as a data URL so the preview (and the localStorage draft)
 * can use it without a backend. Swap for the upload endpoint once drafts are
 * saved on the server.
 */
export function readImage(file: File, maxMb: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    if (file.size > maxMb * 1024 * 1024) return reject(new Error(`Images must be ${maxMb}MB or smaller.`));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("We couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

/* ---------- Colours ---------- */

function luminance(hex: string): number | null {
  const m = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const full = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const isLight = (hex: string) => (luminance(hex) ?? 1) > 0.45;

/** New primary: keep text on it readable and derive a softer accent */
export function withPrimary(colors: TemplateTheme["colors"], primary: string): TemplateTheme["colors"] {
  return {
    ...colors,
    primary,
    onPrimary: isLight(primary) ? "#1A1A1A" : "#FFFFFF",
    accent: `color-mix(in srgb, ${primary} 65%, #ffffff)`,
  };
}

/** New page background: keep body text readable and tint the alternate bands */
export function withSecondary(colors: TemplateTheme["colors"], background: string): TemplateTheme["colors"] {
  const light = isLight(background);
  return {
    ...colors,
    background,
    surface: light ? `color-mix(in srgb, ${background} 45%, #ffffff)` : `color-mix(in srgb, ${background} 88%, #ffffff)`,
    text: light ? "#2A1F1A" : "#F3EEE6",
    muted: light ? "#6E6258" : "#B3ABA0",
  };
}

export const DEFAULT_SWATCHES = {
  primary: ["#C62F3B", "#3150D3", "#2FA84F"],
  secondary: ["#F8EEEE", "#E8EEF8", "#EAF5EA"],
};

/** The template's suggestions, with the current colour first if it isn't one of them */
export function swatchesFor(current: string, suggested: string[]) {
  const list = suggested.some((c) => c.toLowerCase() === current.toLowerCase()) ? suggested : [current, ...suggested];
  return list.slice(0, 4);
}
