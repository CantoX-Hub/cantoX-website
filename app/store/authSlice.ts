import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/app/services/api";
import { onboardingAlreadyComplete, sessionExpired } from "./authActions";
import type { AuthUser, OnboardingPayload } from "@/app/types/onboarding.types";
import type { RootState } from "./store";

/**
 * "unknown" until something tells us otherwise — there is no GET /auth/me yet,
 * so a fresh page load can't confirm the session on its own.
 */
export type AuthStatus = "unknown" | "authenticated" | "guest";

interface AuthState {
  status: AuthStatus;
  email: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  status: "unknown",
  email: null,
  user: null,
};

/**
 * Keep what was just submitted so the dashboard knows the role and names
 * straight away (onboarding state is reset before redirecting).
 */
function withOnboarding(user: AuthUser | null, body: OnboardingPayload): AuthUser {
  return {
    ...(user ?? {}),
    role: body.role,
    planId: body.planId,
    fullName: body.fullName,
    partnerName: body.partnerName,
    businessName: body.businessName,
    avatarUrl: body.avatarUrl,
    onboarded: true,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Restores the last known user from localStorage (no GET /auth/me yet) */
    hydrateUser(state, action: PayloadAction<AuthUser | null>) {
      if (!state.user && action.payload) state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sessionExpired, () => ({ ...initialState, status: "guest" as const }))
      .addCase(onboardingAlreadyComplete, (state, action) => {
        state.user = withOnboarding(state.user, action.payload);
      })
      .addMatcher(api.endpoints.requestMagicLink.matchFulfilled, (state, action) => {
        state.email = action.meta.arg.originalArgs.email;
      })
      .addMatcher(api.endpoints.verifyMagicLink.matchFulfilled, (state, { payload }) => {
        state.status = "authenticated";
        state.user = payload.user ?? null;
        if (payload.user?.email) state.email = payload.user.email;
      })
      .addMatcher(api.endpoints.completeOnboarding.matchFulfilled, (state, action) => {
        state.user = withOnboarding(state.user, action.meta.arg.originalArgs);
      })
      .addMatcher(api.endpoints.logout.matchFulfilled, () => ({
        ...initialState,
        status: "guest" as const,
      }));
  },
});

export const { hydrateUser } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
