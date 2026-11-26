import { notFound } from "next/navigation";
import ComingSoon from "@/app/component/dashboard/ComingSoon";
import { KNOWN_SECTIONS } from "@/app/component/dashboard/sections";

// Templates, Wishlist, Guests, Calendar (+ vendor pages) until they're designed.
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!KNOWN_SECTIONS.includes(section)) notFound();
  return <ComingSoon section={section} />;
}
