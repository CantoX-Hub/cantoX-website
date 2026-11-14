import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { sessionExpired } from "@/app/store/authActions";

/**
 * Leave NEXT_PUBLIC_API_URL empty and proxy /api/v1 through next.config rewrites
 * so the auth cookies are first-party. Set it to the backend origin otherwise.
 */
export const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";
export const API_BASE = `${API_ORIGIN}/api/v1`;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  credentials: "include",
});

// Auth routes never trigger a refresh retry.
const NO_REFRESH = [
  "/auth/refresh",
  "/auth/magic-link/request",
  "/auth/magic-link/verify",
  "/auth/logout",
];

// Shared so parallel 401s wait on one refresh call.
let refreshPromise: Promise<boolean> | null = null;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args.url;

  if (result.error?.status !== 401 || NO_REFRESH.includes(url)) {
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = Promise.resolve(
      rawBaseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions)
    )
      .then((refresh) => !refresh.error)
      .finally(() => {
        refreshPromise = null;
      });
  }

  const refreshed = await refreshPromise;

  if (refreshed) {
    result = await rawBaseQuery(args, api, extraOptions);
  } else {
    api.dispatch(sessionExpired());
  }

  return result;
};

/* ---------- Cold starts ---------- */

/**
 * The backend sleeps when idle (Render free plan) and takes ~40s to wake.
 * Ping it as soon as a sign-in page opens, so it's awake by the time the
 * user submits. Fire-and-forget; failures are ignored.
 */
let wakePromise: Promise<void> | null = null;
export function wakeBackend(): Promise<void> {
  if (!wakePromise) {
    wakePromise = fetch(`${API_BASE}/health`, { cache: "no-store" })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        // Allow another wake-up later if the server goes back to sleep
        setTimeout(() => {
          wakePromise = null;
        }, 60_000);
      });
  }
  return wakePromise;
}

/** Errors that mean "server unreachable or still starting", worth one retry */
export function isWakingError(error: unknown): boolean {
  const status = (error as { status?: unknown } | null)?.status;
  return status === "FETCH_ERROR" || status === 500 || status === 502 || status === 503 || status === 504;
}

/* ---------- Error helpers ---------- */

export function hasStatus(error: unknown, status: number): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    "status" in error &&
    (error as { status: unknown }).status === status
  );
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (!error || typeof error !== "object" || !("status" in error)) {
    return fallback;
  }

  if ((error as { status: unknown }).status === "FETCH_ERROR") {
    return "We couldn't reach the server. Check your connection and try again.";
  }

  // Backend errors look like { error: { code, message } }; validation errors
  // give message as an array. A top-level { message } is accepted too.
  const data = (error as { data?: unknown }).data as
    | { message?: unknown; error?: { message?: unknown } }
    | null
    | undefined;
  const message = data && typeof data === "object" ? data.error?.message ?? data.message : undefined;
  if (typeof message === "string" && message) return message;
  if (Array.isArray(message) && message.length) return message.map(sentence).join(" ");

  return fallback;
}

/** "email must be an email" → "Email must be an email." */
function sentence(text: unknown): string {
  const s = String(text).trim();
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1) + (/[.!?]$/.test(s) ? "" : ".");
}
