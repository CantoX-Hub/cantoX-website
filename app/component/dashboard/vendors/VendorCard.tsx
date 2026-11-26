"use client";

import { useCallback, useEffect, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { BadgeCheck, Heart } from "lucide-react";
import type { Vendor } from "@/app/types/dashboard.types";
import { CardAction, VendorImage } from "../ui";
import { vendorHref } from "./VendorPanel";
import { CategoryTag, VendorStars, heading } from "./VendorSections";

const KEY = "cantox:saved-vendors";
const EVENT = "cantox:saved-vendors-changed";

/** Saved vendors, kept in localStorage until there's a wishlist API */
export function useSavedVendors() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const read = () => {
      try {
        setSaved(JSON.parse(window.localStorage.getItem(KEY) ?? "[]"));
      } catch {
        /* ignore */
      }
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);

  const toggle = useCallback((id: string) => {
    let next: string[] = [];
    try {
      const current: string[] = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
      next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
    return next.includes(id);
  }, []);

  return { saved, toggle };
}

/** Vendor tile. With `onView` the button opens the side panel; without, it links to the vendor page. */
export default function VendorCard({
  vendor,
  saved,
  onToggleSave,
  onView,
}: {
  vendor: Vendor;
  saved?: boolean;
  onToggleSave?: (vendor: Vendor) => void;
  onView?: (vendor: Vendor) => void;
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-lg border border-[#E2E5EA] bg-white p-3 sm:p-4">
      <div className="relative aspect-square overflow-hidden rounded-[3px]">
        <VendorImage src={vendor.image} alt={vendor.name} category={vendor.category} iconSize={40} />
        {onToggleSave && (
          <Tooltip title={saved ? "Remove from saved" : "Save vendor"}>
            <IconButton
              onClick={() => onToggleSave(vendor)}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${vendor.name} from saved` : `Save ${vendor.name}`}
              size="small"
              sx={{ position: "absolute", right: 8, top: 8, bgcolor: "rgba(255,255,255,0.92)", "&:hover": { bgcolor: "#fff" } }}
            >
              <Heart size={16} className={saved ? "fill-[#E5484D] text-[#E5484D]" : "text-[#0F0F0F]"} />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <h3 className="truncate text-[15px] tracking-[-0.02em] text-[#0F0F0F] sm:text-[16px]" style={heading}>
          {vendor.name}
        </h3>
        {vendor.verified && <BadgeCheck size={15} className="shrink-0 text-[#C99532]" aria-label="Verified vendor" />}
      </div>
      <div className="mt-1">
        <CategoryTag>{vendor.category}</CategoryTag>
      </div>
      <div className="mb-3 mt-1">
        <VendorStars value={vendor.rating} size={17} />
      </div>
      <div className="mt-auto">
        {onView ? (
          <CardAction onClick={() => onView(vendor)}>
            View vendor<span className="sr-only">: {vendor.name}</span>
          </CardAction>
        ) : (
          <CardAction href={vendorHref(vendor.id)}>
            View vendor<span className="sr-only">: {vendor.name}</span>
          </CardAction>
        )}
      </div>
    </article>
  );
}
