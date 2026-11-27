"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Button, CircularProgress, Drawer, IconButton, Tooltip } from "@mui/material";
import { PanelLeftOpen, X } from "lucide-react";
import { useGetVendorQuery } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import { AboutBlock, ContactBlock, GalleryLightbox, GalleryTile, MoqBlock, OfferingsBlock, ProfileCard, ReviewsBlock } from "./VendorSections";

/** Photos shown above the reviews; the rest follow the review form, as in the design */
const PHOTOS_BEFORE_REVIEWS = 2;

export const vendorHref = (id: string) => `/dashboard/vendors/${encodeURIComponent(id)}`;

/** Right-side "View vendor" panel. `vendorId` null → closed. */
export default function VendorPanel({ vendorId, onClose }: { vendorId: string | null; onClose: () => void }) {
  const titleId = useId();
  // Keep showing the last vendor while the drawer slides closed
  const [shownId, setShownId] = useState(vendorId);
  useEffect(() => {
    if (vendorId) setShownId(vendorId);
  }, [vendorId]);

  const { data: vendor, isLoading, error, refetch } = useGetVendorQuery(shownId ?? "", { skip: !shownId });
  const [photo, setPhoto] = useState<number | null>(null);

  return (
    <Drawer
      anchor="right"
      open={!!vendorId}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 528 } }, "aria-labelledby": titleId } as object }}
    >
      <div className="flex h-full flex-col px-3">
        <div className="flex items-center gap-4 border-b border-[#E8E8EC] pb-5 pt-7">
          {shownId && (
            <Tooltip title="Open full page">
              <IconButton component={Link} href={vendorHref(shownId)} aria-label="Open vendor as a full page" sx={{ ml: 0.5, color: "#0F0F0F" }}>
                <PanelLeftOpen size={20} />
              </IconButton>
            </Tooltip>
          )}
          <h2 id={titleId} className="flex-1 sm:text-[18px] text-[#0F0F0F]">
            View vendor
          </h2>
          <IconButton onClick={onClose} aria-label="Close" sx={{ mr: 1, color: "#0F0F0F" }}>
            <X size={18} />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto pb-8 pt-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <CircularProgress size={28} aria-label="Loading vendor" />
            </div>
          ) : error || !vendor ? (
            <div className="flex flex-col items-center py-16 text-center">
              <p className="text-[14px] text-[#6B7280]">{getErrorMessage(error, "We couldn't load this vendor.")}</p>
              <Button onClick={() => refetch()} variant="outlined" color="inherit" sx={{ mt: 2, borderColor: "#E8E8EC" }}>
                Try again
              </Button>
            </div>
          ) : (
            <>
              <ProfileCard vendor={vendor} />
              <div className="mt-2">
                <AboutBlock vendor={vendor} />
                <MoqBlock vendor={vendor} />
                <OfferingsBlock vendor={vendor} defaultOpen={false} />
                <ContactBlock vendor={vendor} layout="inline" />
              </div>

              <div className="mt-2 space-y-6">
                {vendor.gallery.slice(0, PHOTOS_BEFORE_REVIEWS).map((_, i) => (
                  <GalleryTile key={i} vendor={vendor} index={i} onOpen={setPhoto} className="aspect-[4/3]" />
                ))}
              </div>

              <div className="mt-6">
                <ReviewsBlock vendor={vendor} />
              </div>

              {vendor.gallery.length > PHOTOS_BEFORE_REVIEWS && (
                <div className="mt-6 space-y-6">
                  {vendor.gallery.slice(PHOTOS_BEFORE_REVIEWS).map((_, i) => (
                    <GalleryTile key={i} vendor={vendor} index={i + PHOTOS_BEFORE_REVIEWS} onOpen={setPhoto} className="aspect-[4/3]" />
                  ))}
                </div>
              )}

              <GalleryLightbox vendor={vendor} index={photo} onChange={setPhoto} />
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
