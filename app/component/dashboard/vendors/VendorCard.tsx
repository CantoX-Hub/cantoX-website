import { BadgeCheck } from "lucide-react";
import type { Vendor } from "@/app/types/dashboard.types";
import { CardAction, VendorImage } from "../ui";
import { vendorHref } from "./VendorPanel";
import { CategoryTag, VendorStars, heading } from "./VendorSections";

/** Card grid: 1 column on very small phones, 2 on phones, 3 on tablets, 4 on wide screens.
 *  Tight column gaps and roomier row gaps, as in the design. */
export const VENDOR_GRID =
  "grid grid-cols-1 gap-x-2 gap-y-4 min-[360px]:grid-cols-2 sm:gap-x-2.5 sm:gap-y-6 md:grid-cols-3 lg:gap-y-8 xl:grid-cols-4";

/** Vendor tile. With `onView` the button opens the side panel; without, it links to the vendor page. */
export default function VendorCard({ vendor, onView }: { vendor: Vendor; onView?: (vendor: Vendor) => void }) {
  const label = (
    <>
      View vendor<span className="sr-only">: {vendor.name}</span>
    </>
  );

  return (
    <article className="flex min-w-0 flex-col rounded-lg border-2 border-[#E2E5EA] bg-white p-2.5 sm:p-4">
      <div className="aspect-square overflow-hidden rounded-lg bg-[#F1F4F8]">
        <VendorImage src={vendor.image} alt={vendor.name} category={vendor.category} iconSize={40} />
      </div>

      <div className="mt-3 flex min-w-0 items-center gap-1.5">
        <h3 className="truncate text-[14px] tracking-[-0.02em] text-[#0F0F0F] sm:text-[16px]" style={heading}>
          {vendor.name}
        </h3>
        {vendor.verified && <BadgeCheck size={15} className="shrink-0 text-[#C99532]" aria-label="Verified vendor" />}
      </div>
      <div className="mt-1.5 min-w-0">
        <CategoryTag>{vendor.category}</CategoryTag>
      </div>
      <div className="mb-3 mt-1.5">
        <VendorStars value={vendor.rating} size={17} />
      </div>

      <div className="mt-auto">
        {onView ? (
          <CardAction onClick={() => onView(vendor)}>{label}</CardAction>
        ) : (
          <CardAction href={vendorHref(vendor.id)}>{label}</CardAction>
        )}
      </div>
    </article>
  );
}
