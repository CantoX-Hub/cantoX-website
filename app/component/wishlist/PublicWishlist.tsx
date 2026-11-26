"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useGetWishlistQuery, useSetWishlistItemPurchasedMutation } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import WishlistView from "./WishlistView";

/** The page guests open from a shared wishlist link */
export default function PublicWishlist({ id }: { id: string }) {
  const { data: wishlist, isLoading, error } = useGetWishlistQuery(id);
  const [setPurchased] = useSetWishlistItemPurchasedMutation();

  const toggle = async (itemId: string, purchased: boolean) => {
    try {
      await setPurchased({ id, itemId, purchased }).unwrap();
      toast.success(purchased ? "Thank you! We've let the couple know." : "Purchase undone.");
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <main className="min-h-screen bg-white px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-[1120px]">
        <header className="relative flex items-center justify-between overflow-hidden rounded-xl bg-[#060D18] px-6 py-6 sm:px-12 sm:py-8">
          {/* soft light streaks, as in the design */}
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(115deg,transparent_45%,rgba(255,255,255,0.08)_52%,transparent_58%,rgba(255,255,255,0.05)_66%,transparent_72%)]" />
          <h1 className="relative text-[52px] leading-none text-white sm:text-[84px]" style={{ fontFamily: '"Carattere", cursive' }}>
            WishList
          </h1>
          <div className="relative text-right">
            <p className="text-[11px] text-white/80 sm:text-[13px]">Powered by:</p>
            <Image src="/canto-white.svg" alt="canto" width={146} height={40} className="mt-1 h-auto w-[84px] sm:w-[146px]" />
          </div>
        </header>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-24" aria-label="Loading wishlist">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#C99532] border-t-transparent" />
            </div>
          ) : wishlist ? (
            <>
              <p className="mb-4 text-center text-[15px] text-[#4B5563]">
                {wishlist.name}
                {wishlist.eventLabel && <span className="text-[#9CA3AF]"> · {wishlist.eventLabel}</span>}
              </p>
              <WishlistView message={wishlist.message} items={wishlist.items} cash={wishlist.cash} interactive onTogglePurchased={toggle} />
            </>
          ) : (
            <div className="rounded-2xl bg-[#F3F8FC] px-6 py-20 text-center">
              <p className="text-[18px] font-semibold text-[#0F0F0F]">{hasStatus(error, 404) ? "This wishlist isn't available" : "We couldn't load this wishlist"}</p>
              <p className="mt-2 text-[14px] text-[#6B7280]">
                {hasStatus(error, 404) ? "The link may be wrong, or the wishlist was removed." : getErrorMessage(error)}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
