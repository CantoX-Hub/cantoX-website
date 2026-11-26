import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import { api, toAuthUser, type BackendUser } from "@/app/services/api";
import { onboardingAlreadyComplete, sessionExpired } from "./authActions";
import type { AuthUser, OnboardingPayload } from "@/app/types/onboarding.types";
import type { RootState } from "./store";

/**
 * "unknown" until GET /auth/me (or a sign-in) answers. Pages keep showing the
 * last known user from localStorage meanwhile, and only redirect on "guest".
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

/**
 * The backend only returns id, email, role, onboarded, name and avatar. Keep
 * the extra profile fields saved for the same account (partner name, plan…);
 * drop them if a different account signed in.
 */
function fromBackend(current: AuthUser | null, user: BackendUser): AuthUser {
  const sameAccount = current?.id === user.id || (!current?.id && current?.email === user.email);
  return { ...(sameAccount ? current : {}), ...toAuthUser(user) };
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Restores the last known user from localStorage for an instant first paint */
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
        if (payload.user) {
          state.user = fromBackend(state.user, payload.user);
          state.email = payload.user.email;
        }
      })
      .addMatcher(api.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        state.status = "authenticated";
        state.user = fromBackend(state.user, payload);
        state.email = payload.email;
      })
      .addMatcher(api.endpoints.completeOnboarding.matchFulfilled, (state, action) => {
        state.user = withOnboarding(state.user, action.meta.arg.originalArgs);
      })
      .addMatcher(
        isAnyOf(api.endpoints.logout.matchFulfilled, api.endpoints.deleteAccount.matchFulfilled),
        () => ({ ...initialState, status: "guest" as const })
      );
  },
});

export const { hydrateUser } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
