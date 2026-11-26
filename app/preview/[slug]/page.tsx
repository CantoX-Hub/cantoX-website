"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import TemplateRenderer from "@/app/component/wedding/TemplateRenderer";
import { getTemplateBySlug } from "@/app/data/wedding-templates";
import type { PreviewMessage } from "@/app/types/wedding.types";

/** Mock data for browsing; the studio's iframe swaps in what the couple is typing */
export default function TemplatePreviewPage({ params }: { params: { slug: string } }) {
  const template = getTemplateBySlug(params.slug);
  const [live, setLive] = useState<Pick<PreviewMessage, "content" | "overrides"> | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent<PreviewMessage>) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "canto:preview") return;
      setLive({ content: event.data.content, overrides: event.data.overrides });
    };
    window.addEventListener("message", onMessage);
    // Tell a parent studio we can take data now
    window.parent?.postMessage({ type: "canto:preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!template) notFound();

  return (
    <TemplateRenderer
      template={template}
      content={live?.content ?? null}
      overrides={live?.overrides ?? null}
      placeholders
    />
  );
}
