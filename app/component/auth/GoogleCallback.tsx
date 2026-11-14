"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/app/services/api";
import { getErrorMessage, hasStatus } from "@/app/services/baseQuery";
import { ROUTES } from "@/app/lib/routes";
import { VerifyLayout } from "./VerifyMagicLink";

/**
 * Google sign-in lands here: the backend sets the auth cookies and redirects
 * to {FRONTEND_URL}/auth/callback. GET /auth/me tells us who signed in and
 * where they go next. (authSlice stores the user from the same response.)
 */
export default function GoogleCallback() {
  const router = useRouter();
  const { data: user, error } = useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (user) router.replace(user.onboarded ? ROUTES.dashboard : ROUTES.onboarding);
  }, [user, router]);

  const message = error
    ? hasStatus(error, 401)
      ? "Google sign-in didn't finish. Please try again."
      : getErrorMessage(error)
    : null;

  return <VerifyLayout error={message} />;
}
