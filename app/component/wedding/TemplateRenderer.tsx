"use client";

import { resolveContent, resolveTheme } from "@/app/lib/wedding-utils";
import type {
  TemplateDefinition,
  ThemeOverrides,
  WeddingContent,
} from "@/app/types/wedding.types";
import InviteLayout from "./InviteLayout";
import { ThemeScope } from "./ThemeScope";
import WebsiteLayout from "./WebsiteLayout";

/** Studio preview, gallery preview and public site all render through this */
export default function TemplateRenderer({
  template,
  content,
  overrides,
  placeholders,
}: {
  template: TemplateDefinition;
  content: Partial<WeddingContent> | null;
  overrides: ThemeOverrides | null;
  /** true: empty fields show mock data. false: public site, real values only */
  placeholders: boolean;
}) {
  const theme = resolveTheme(template, overrides);
  const resolved = resolveContent(template, content, placeholders);

  return (
    <ThemeScope theme={theme}>
      {template.layout === "invite" ? (
        <InviteLayout template={template} content={resolved} theme={theme} />
      ) : template.layout === "website" ? (
        <WebsiteLayout template={template} content={resolved} theme={theme} />
      ) : (
        <main className="flex min-h-[100svh] items-center justify-center px-6 text-center">
          <p className="text-[14px] opacity-60">A preview of this template isn&apos;t available yet.</p>
        </main>
      )}
    </ThemeScope>
  );
}
