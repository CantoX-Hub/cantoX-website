import type { Metadata } from "next";
import PublicWishlist from "@/app/component/wishlist/PublicWishlist";

export const metadata: Metadata = { title: "Wishlist · canto" };

/** Public page guests open from a shared link (no sign-in needed) */
export default function Page({ params }: { params: { id: string } }) {
  return <PublicWishlist id={decodeURIComponent(params.id)} />;
}
