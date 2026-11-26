import Image from "next/image";
import type { ReactNode } from "react";
import { FONT_VARIABLE_CLASSES } from "@/app/lib/fonts";
import { themeStyle } from "@/app/lib/wedding-utils";
import type { ThemeValues } from "@/app/types/wedding.types";

/** Defines the font variables and the theme's colour and font variables for its children */
export function ThemeScope({
  theme,
  children,
  className = "",
}: {
  theme: ThemeValues;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${FONT_VARIABLE_CLASSES} ${className}`}
      style={{
        ...themeStyle(theme),
        background: "var(--c-bg)",
        color: "var(--c-text)",
        fontFamily: "var(--f-body)",
      }}
    >
      {children}
    </div>
  );
}

/** Images can be uploaded data URLs, so they skip the optimiser. Fills a positioned parent. */
export function FillImage({
  src,
  alt = "",
  className = "",
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes="100vw"
      className={className}
    />
  );
}

export const scriptFont = { fontFamily: "var(--f-script)" } as const;
export const headingFont = { fontFamily: "var(--f-heading)" } as const;
export const bodyFont = { fontFamily: "var(--f-body)" } as const;
