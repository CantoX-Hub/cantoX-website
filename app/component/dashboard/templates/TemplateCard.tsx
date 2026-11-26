"use client";

/* eslint-disable @next/next/no-img-element -- thumbnails will come from the API/CDN */

import Link from "next/link";
import { IconButton, Skeleton, Tooltip } from "@mui/material";
import { Trash2 } from "lucide-react";
import { RiExpandDiagonalLine } from "react-icons/ri";
import type { TemplateSummary, TemplateTier } from "@/app/types/template.types";
import { Stars } from "../ui";

export function TierBadge({ tier }: { tier: TemplateTier }) {
  return tier === "premium" ? (
    <span className="inline-flex rounded-[3px] bg-[#C99532] px-1.5 py-[2px] text-[11px] font-semibold text-white">Premium</span>
  ) : (
    <span className="inline-flex rounded-[3px] border border-[#DDE1E4] bg-[#EAF0F5] px-1.5 py-[1px] text-[11px] font-semibold text-[#62676D]">Free</span>
  );
}

export const editorHref = (id: string) => `/dashboard/templates/${encodeURIComponent(id)}`;

/** Library / My templates card. The whole card opens the editor. */
export function TemplateCard({
  template,
  meta,
  onRemove,
}: {
  template: TemplateSummary;
  meta?: string;
  onRemove?: () => void;
}) {
  return (
    <div className="group relative flex h-full flex-col rounded-lg border-2 border-[#E2E8F0] bg-white p-4 transition-all duration-200 focus-within:shadow-[0_10px_30px_rgba(6,13,24,0.08)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(6,13,24,0.08)]">
      <div className="aspect-[5/4] w-full overflow-hidden rounded-md bg-[#F4F1EC]">
        <img src={template.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col py-4">
        <h3 className="text-[14px] sm:text-base text-[#060D18]">
          {/* Stretched link: the whole card is clickable */}
          <Link
            href={editorHref(template.id)}
            className="rounded after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none group-focus-within:after:outline group-focus-within:after:outline-2 group-focus-within:after:outline-[#C99532]"
          >
            {template.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-4 text-[#857E75] font-medium">{template.description}</p>
        <div className="mt-2">
          <Stars value={template.rating} />
        </div>
        {meta && <p className="mt-1 text-[12px] text-[#9CA3AF]">{meta}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          <TierBadge tier={template.tier} />
          {onRemove ? (
            <Tooltip title="Remove from My templates">
              <IconButton size="small" onClick={onRemove} aria-label={`Remove ${template.name} from My templates`} sx={{ position: "relative", zIndex: 1, color: "#6B7280", "&:hover": { color: "#DC2626" } }}>
                <Trash2 size={15} />
              </IconButton>
            </Tooltip>
          ) : (
            <RiExpandDiagonalLine aria-hidden className="h-4 w-4 text-[#0F0F0F] opacity-60 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      </div>
    </div>
  );
}

export function TemplateCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#E8E8EC] p-2">
      <Skeleton variant="rounded" sx={{ aspectRatio: "5 / 4", height: "auto" }} />
      <Skeleton width="60%" sx={{ mt: 1.5 }} />
      <Skeleton width="90%" />
      <Skeleton width="40%" />
    </div>
  );
}
