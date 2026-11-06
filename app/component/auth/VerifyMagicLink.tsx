"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyMagicLinkMutation } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import { ROUTES } from "@/app/lib/routes";

export default function VerifyMagicLink() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [verify] = useVerifyMagicLinkMutation();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    // Tokens are single-use — guard against Strict Mode's double effect
    if (!token || started.current) return;
    started.current = true;

    verify({ token })
      .unwrap()
      .then((res) => {
        router.replace(res.user?.onboarded ? ROUTES.dashboard : ROUTES.onboarding);
      })
      .catch((err) => {
        setError(
          hasStatus(err, 401) || hasStatus(err, 400)
            ? "This link is invalid or has expired."
            : getErrorMessage(err)
        );
      });
  }, [token, verify, router]);

  const message = !token ? "This link is missing its sign-in token." : error;

  return <VerifyLayout error={message} />;
}

export function VerifyLayout({ error }: { error?: string | null }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <Image src="/logo.svg" alt="Canto" width={105} height={32} className="mx-auto" priority />

        {error ? (
          <div role="alert" className="mt-8">
            <h1 className="text-[22px] text-[#11151D]">We couldn&apos;t sign you in</h1>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">{error}</p>
            <Link
              href={ROUTES.getStarted}
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-[4px] bg-[#C99532] text-sm font-medium text-white transition-colors hover:bg-[#B78628]"
            >
              Request a new link
            </Link>
          </div>
        ) : (
          <div className="mt-8" aria-live="polite">
            <span
              aria-hidden="true"
              className="mx-auto block h-6 w-6 animate-spin rounded-full border-2 border-[#C99532]/20 border-t-[#C99532]"
            />
            <p className="mt-4 text-sm text-[#6B7280]">Signing you in…</p>
          </div>
        )}
      </div>
    </div>
  );
}
