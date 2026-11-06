import { Suspense } from "react";
import type { Metadata } from "next";
import VerifyMagicLink, { VerifyLayout } from "../../component/auth/VerifyMagicLink";

export const metadata: Metadata = {
  title: "Signing in | CantoX",
};

// The magic-link email should point here: {FRONTEND_URL}/auth/verify?token=...
export default function VerifyPage() {
  return (
    <main>
      <Suspense fallback={<VerifyLayout />}>
        <VerifyMagicLink />
      </Suspense>
    </main>
  );
}
