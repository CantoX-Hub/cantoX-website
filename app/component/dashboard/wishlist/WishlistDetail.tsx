"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { ExternalLink, PencilLine, Share2 } from "lucide-react";
import { useGetWishlistQuery, useOpenWishlistMutation } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import WishlistView from "@/app/component/wishlist/WishlistView";
import { Panel } from "../ui";
import { useShareWishlist, wishlistPublicPath } from "./shared";

export default function WishlistDetail({ id }: { id: string }) {
  const { data: wishlist, isLoading, error } = useGetWishlistQuery(id);
  const [markOpened] = useOpenWishlistMutation();
  const share = useShareWishlist();
  const editHref = `/dashboard/wishlist/${encodeURIComponent(id)}/edit`;

  // Updates "Opened …" on the list
  useEffect(() => {
    if (wishlist) markOpened(id);
    // Only once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!wishlist, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress size={28} aria-label="Loading wishlist" />
      </div>
    );
  }

  if (!wishlist) {
    return (
      <Panel className="flex flex-col items-center px-6 py-16 text-center">
        <p className="text-[16px] font-semibold">{hasStatus(error, 404) ? "This wishlist doesn't exist" : "We couldn't load this wishlist"}</p>
        {!hasStatus(error, 404) && <p className="mt-1 text-[14px] text-[#6B7280]">{getErrorMessage(error)}</p>}
        <Button component={Link} href="/dashboard/wishlist" variant="contained" sx={{ mt: 3 }}>
          Back to wishlists
        </Button>
      </Panel>
    );
  }

  const purchased = wishlist.items.filter((i) => i.purchased).length;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[22px] text-[#0F0F0F] sm:text-[24px]">{wishlist.name}</h1>
            <Tooltip title="Edit wishlist">
              <IconButton component={Link} href={editHref} size="small" aria-label="Edit wishlist">
                <PencilLine size={18} />
              </IconButton>
            </Tooltip>
          </div>
          <p className="mt-0.5 text-[13px] text-[#6B7280]">
            {wishlist.items.length > 0 && `${purchased} of ${wishlist.items.length} gifts purchased`}
            {wishlist.items.length > 0 && wishlist.eventLabel && " · "}
            {wishlist.eventLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button component="a" href={wishlistPublicPath(id)} target="_blank" rel="noopener" variant="text" color="inherit" endIcon={<ExternalLink size={14} />}>
            Guest view
          </Button>
          <Button component={Link} href={editHref} variant="outlined" color="inherit" startIcon={<PencilLine size={16} />} sx={{ borderColor: "#D1D5DB" }}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" endIcon={<Share2 size={16} />} onClick={() => share(id, wishlist.name)}>
            Share
          </Button>
        </div>
      </div>

      <WishlistView message={wishlist.message} items={wishlist.items} cash={wishlist.cash} />
    </>
  );
}
