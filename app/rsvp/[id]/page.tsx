import type { Metadata } from "next";
import PublicRsvp from "@/app/component/rsvp/PublicRsvp";

export const metadata: Metadata = { title: "RSVP · canto" };

/** Public page guests open from a shared RSVP link (no sign-in needed) */
export default function Page({ params }: { params: { id: string } }) {
  return <PublicRsvp id={decodeURIComponent(params.id)} />;
}
