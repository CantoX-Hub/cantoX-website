import { createApi } from "@reduxjs/toolkit/query/react";
import { API_BASE, baseQueryWithReauth } from "./baseQuery";
import type { AuthUser, OnboardingPayload } from "@/app/types/onboarding.types";
import { toOnboardingDto } from "@/app/lib/onboarding";

/** User as the backend returns it from /auth/me and /auth/magic-link/verify */
export interface BackendUser {
  id: string;
  email: string;
  /** "unassigned" until onboarding is done */
  role: "couple" | "planner" | "vendor" | "unassigned";
  onboarded: boolean;
  name: string | null;
  avatar: string | null;
}

export interface VerifyMagicLinkResponse {
  message?: string;
  user?: BackendUser;
}

/** Maps the backend user onto the fields the app uses (role, fullName, avatarUrl). */
export function toAuthUser(user: BackendUser): AuthUser {
  const role = user.role === "unassigned" ? null : user.role;
  return {
    id: user.id,
    email: user.email,
    role,
    onboarded: user.onboarded,
    ...(user.name ? { fullName: user.name } : {}),
    // Vendors have no personal name; the backend's name is their business name
    ...(user.name && role === "vendor" ? { businessName: user.name } : {}),
    ...(user.avatar ? { avatarUrl: user.avatar } : {}),
  };
}

export interface UploadResponse {
  url: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    health: build.query<unknown, void>({
      query: () => "/health",
    }),

    requestMagicLink: build.mutation<{ message?: string }, { email: string }>({
      query: (body) => ({ url: "/auth/magic-link/request", method: "POST", body }),
    }),

    /** rememberMe false → session cookie cleared when the browser closes; true → 7 days */
    verifyMagicLink: build.mutation<VerifyMagicLinkResponse, { token: string; rememberMe?: boolean }>({
      query: (body) => ({ url: "/auth/magic-link/verify", method: "POST", body }),
    }),

    /** Restores the session on page load and after the Google redirect */
    getMe: build.query<BackendUser, void>({
      query: () => "/auth/me",
    }),

    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),

    // Takes the form payload (authSlice keeps it for the dashboard) and sends
    // only the fields the backend DTO accepts.
    completeOnboarding: build.mutation<unknown, OnboardingPayload>({
      query: (payload) => ({ url: "/onboarding", method: "POST", body: toOnboardingDto(payload) }),
    }),

    uploadFile: build.mutation<UploadResponse, { file: File; folder?: string }>({
      query: ({ file, folder }) => {
        const formData = new FormData();
        formData.append("file", file);
        if (folder) formData.append("folder", folder);
        return { url: "/upload", method: "POST", body: formData };
      },
    }),
  }),
});

export const {
  useHealthQuery,
  useRequestMagicLinkMutation,
  useVerifyMagicLinkMutation,
  useGetMeQuery,
  useLogoutMutation,
  useCompleteOnboardingMutation,
  useUploadFileMutation,
} = api;

/** Full-page redirect — the backend handles the OAuth dance and redirects back. */
export const GOOGLE_AUTH_URL = `${API_BASE}/auth/google`;
