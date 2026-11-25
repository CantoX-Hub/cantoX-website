"use client";

import { useEffect } from "react";
import Link from "next/link";
import TemplateRenderer from "@/app/component/wedding/TemplateRenderer";
import { getTemplateById } from "@/app/data/wedding-templates";
import { getWeddingBySlug, useStore } from "@/app/lib/wedding-store";

/** Until there is a backend the record lives in this browser, so the link only resolves where it was published */
export default function PublicWeddingPage({ params }: { params: { slug: string } }) {
  const state = useStore();
  const wedding = getWeddingBySlug(state, params.slug);
  const template = wedding ? getTemplateById(wedding.templateId) : undefined;
  const isLive = wedding?.status === "live" && !!template;

  useEffect(() => {
    if (isLive && wedding) document.title = `${wedding.coupleDisplayNames} | CantoX`;
  }, [isLive, wedding]);

  if (!state.ready) {
    return <div className="min-h-screen bg-white" aria-busy="true" />;
  }

  if (!wedding || !template || !isLive) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="text-[28px] text-[#171A20]">This wedding site isn&apos;t live</h1>
        <p className="mt-3 max-w-[420px] text-[14px] text-[#6B7280]">
          The link may be mistyped, or the couple hasn&apos;t published their website yet.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-[4px] bg-[#C99532] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#B78628]"
        >
          Go to Canto
        </Link>
      </main>
    );
  }

  return (
    <TemplateRenderer
      template={template}
      content={wedding.content}
      overrides={wedding.customizations}
      placeholders={false}
    />
  );
}
