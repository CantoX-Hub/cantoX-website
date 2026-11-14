"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { IconButton, Tooltip } from "@mui/material";
import { BadgeCheck, Heart } from "lucide-react";
import type { Vendor } from "@/app/types/dashboard.types";
import { CardAction, Stars, VendorImage } from "../ui";

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

export default function VendorCard({
  vendor,
  saved,
  onToggleSave,
}: {
  vendor: Vendor;
  saved?: boolean;
  onToggleSave?: (vendor: Vendor) => void;
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-[#E8E8EC] bg-white p-2 sm:p-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <VendorImage src={vendor.image} alt={vendor.name} category={vendor.category} iconSize={36} />
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
        <h3 className="truncate text-[14px] sm:text-[16px]">{vendor.name}</h3>
        {vendor.verified && <BadgeCheck size={15} className="shrink-0 text-[#C99532]" aria-label="Verified" />}
      </div>
      <p className="mt-0.5 truncate text-[12px] text-[#6B7280] sm:text-[13px]">{vendor.category}</p>
      <div className="mb-3 mt-1.5 flex items-center gap-1.5">
        <Stars value={vendor.rating} />
        <span className="hidden text-[12px] text-[#9CA3AF] sm:inline">({vendor.reviewCount})</span>
      </div>
      <div className="mt-auto">
        <CardAction href={`/dashboard/vendors/${vendor.id}`}>View vendor</CardAction>
      </div>
    </article>
  );
}
