"use client";

import Link from "next/link";
import { Button, CircularProgress } from "@mui/material";
import { useGetWishlistQuery } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import { Panel } from "../ui";
import WishlistForm from "./WishlistForm";

/** Loads the wishlist, then shows the form filled in */
export default function WishlistEdit({ id }: { id: string }) {
  const { data, isLoading, error } = useGetWishlistQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <CircularProgress size={28} aria-label="Loading wishlist" />
      </div>
    );
  }
  if (!data) {
    return (
      <Panel className="flex flex-col items-center px-6 py-16 text-center">
        <p className="text-[16px] font-semibold">{hasStatus(error, 404) ? "This wishlist doesn't exist" : getErrorMessage(error)}</p>
        <Button component={Link} href="/dashboard/wishlist" variant="contained" sx={{ mt: 3 }}>
          Back to wishlists
        </Button>
      </Panel>
    );
  }
  // key: start fresh if a different wishlist loads into the same page
  return <WishlistForm key={data.id} wishlist={data} />;
}
