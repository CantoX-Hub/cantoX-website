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

  const data = (error as { data?: unknown }).data;
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message: unknown }).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(" ");
  }

  return fallback;
}
