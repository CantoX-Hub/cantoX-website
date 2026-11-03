import type { Metadata } from "next";
import ItunuStephenInvite from "@/app/component/templates/ItunuStephenInvite";

export const metadata: Metadata = {
  title: "Itunu & Stephen | CantoX",
  description: "You are invited to the wedding of Itunu & Stephen.",
};

export default function ItunuStephenPage() {
  return <ItunuStephenInvite />;
}
