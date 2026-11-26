import type { Metadata } from "next";
import GetStarted from "../component/auth/GetStarted";

export const metadata: Metadata = {
  title: "Get started | CantoX",
};

export default function GetStartedPage() {
  return (
    <main className="min-h-screen">
      <GetStarted />
    </main>
  );
}
