"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRequestMagicLinkMutation } from "@/app/services/api";
import { getErrorMessage } from "@/app/services/baseQuery";
import { ROUTES } from "@/app/lib/routes";

/** sessionStorage key GetStarted writes the address to, so it never sits in the URL */
export const PENDING_EMAIL_KEY = "canto:pending-email";
/** Seconds before another link can be requested */
const RESEND_COOLDOWN = 30;

function readPendingEmail(): string | null {
  try {
    return sessionStorage.getItem(PENDING_EMAIL_KEY);
  } catch {
    return null;
  }
}

export default function CheckEmail() {
  const [email, setEmail] = useState<string | null>(null);
  // Starts cooling down: a link was just sent from Get Started
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resent, setResent] = useState(false);
  const [requestMagicLink, { isLoading, error }] = useRequestMagicLinkMutation();

  useEffect(() => {
    setEmail(readPendingEmail());
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const resend = async () => {
    if (!email) return;
    setResent(false);
    try {
      await requestMagicLink({ email }).unwrap();
      setResent(true);
      setCooldown(RESEND_COOLDOWN);
    } catch {
      // Shown below from `error`
    }
  };

  const linkClass = "font-medium text-[#C99532] underline-offset-2 hover:underline";

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[700px] text-center">
        <Image src="/empty-message.svg" alt="" width={120} height={120} className="mx-auto" priority />

        <h1 className="mt-4 text-md sm:text-lg text-[#11151D]">Check your email</h1>
        <p className="mt-3 font-medium text-[12px] leading-6 text-[#62748E]">
          We&apos;ve sent a temporary login link to{" "}
          {email ? <span className="font-semibold text-[#62748E]">{email}</span> : "your email"}. Click the link to
          securely access your CantoX account.
        </p>

        <p className="mt-6 text-[12px] font-medium leading-6 text-[#62748E]">
          <span className=" text-[#62748E]">Can&apos;t find the email?</span> Check your spam or junk
          folder, or{" "}
          {!email ? (
            <Link href={ROUTES.getStarted} className={linkClass}>
              request a new link
            </Link>
          ) : cooldown > 0 || isLoading ? (
            <span className="text-[#9CA1A9]">
              {isLoading ? "sending a new link…" : `request a new link in ${cooldown}s`}
            </span>
          ) : (
            <button type="button" onClick={resend} className={linkClass}>
              request a new link
            </button>
          )}
          .
        </p>

        <div aria-live="polite" className="mt-3 min-h-[20px] text-xs">
          {error ? (
            <p role="alert" className="text-red-600">
              {getErrorMessage(error)}
            </p>
          ) : resent ? (
            <p className="text-[#16A34A]">A new link is on its way.</p>
          ) : null}
        </div>

        {email && (
          <Link href={ROUTES.getStarted} className=" inline-block text-xs text-[#6B7280] hover:text-[#B78628]">
            Use a different email
          </Link>
        )}
      </div>
    </div>
  );
}
