"use client";

import Image from "next/image";
import { Maximize2, Star } from "lucide-react";
import type { TemplateDefinition, WeddingStatus } from "@/app/types/wedding.types";

export default function LibraryCard({
  template,
  status,
  onOpen,
}: {
  template: TemplateDefinition;
  /** Set for templates in My templates that already have a wedding */
  status?: WeddingStatus;
  onOpen: () => void;
}) {
  const isPremium = template.tier === "Premium";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${template.name} template`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group cursor-pointer rounded-lg border-2 border-[#E2E8F0] bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C99532]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F4F1EC]">
        <Image
          src={template.thumbnail}
          alt=""
          fill
          quality={100}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="py-3">
        <h3 className="text-[16px] text-[#171A20]">{template.name}</h3>
        <p className="mt-2 text-[12px] font-medium text-[#857E75]">{template.description}</p>

        <div className="mt-2.5 flex items-center gap-[2px]" aria-label={`${template.rating} of 5 stars`}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-[11px] w-[11px] ${
                index < template.rating
                  ? "fill-[#FFB800] text-[#FFB800]"
                  : "fill-[#FFE9A8] text-[#FFE9A8]"
              }`}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex rounded-[2px] px-1.5 py-[2px] text-[12px] font-semibold ${
                isPremium
                  ? "bg-[#C9933A] text-white"
                  : "border border-[#DDE1E4] bg-[#EAF0F5] text-[#62676D]"
              }`}
            >
              {isPremium ? "Premium" : "Essential"}
            </span>
            {status && (
              <span
                className={`inline-flex rounded-[2px] px-1.5 py-[2px] text-[12px] font-semibold ${
                  status === "live" ? "bg-[#E4F3E4] text-[#1F7A33]" : "bg-[#F1F5F9] text-[#62676D]"
                }`}
              >
                {status === "live" ? "Live" : "Draft"}
              </span>
            )}
          </div>
          <Maximize2
            aria-hidden="true"
            className="h-[18px] w-[18px] text-[#11151D] opacity-70 transition-opacity group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
}
