import { createApi } from "@reduxjs/toolkit/query/react";
import { API_BASE, baseQueryWithReauth } from "./baseQuery";
import type { AuthUser, OnboardingPayload } from "@/app/types/onboarding.types";

export interface VerifyMagicLinkResponse {
  user?: AuthUser;
  message?: string;
  [key: string]: unknown;
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

    verifyMagicLink: build.mutation<VerifyMagicLinkResponse, { token: string }>({
      query: (body) => ({ url: "/auth/magic-link/verify", method: "POST", body }),
    }),

    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),

    completeOnboarding: build.mutation<unknown, OnboardingPayload>({
      query: (body) => ({ url: "/onboarding", method: "POST", body }),
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
  useLogoutMutation,
  useCompleteOnboardingMutation,
  useUploadFileMutation,
} = api;

/** Full-page redirect — the backend handles the OAuth dance and redirects back. */
export const GOOGLE_AUTH_URL = `${API_BASE}/auth/google`;
