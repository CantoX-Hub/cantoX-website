import { createSlice } from "@reduxjs/toolkit";
import { api } from "@/app/services/api";
import { sessionExpired } from "./authActions";
import type { AuthUser } from "@/app/types/onboarding.types";
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sessionExpired, () => ({ ...initialState, status: "guest" as const }))
      .addMatcher(api.endpoints.requestMagicLink.matchFulfilled, (state, action) => {
        state.email = action.meta.arg.originalArgs.email;
      })
      .addMatcher(api.endpoints.verifyMagicLink.matchFulfilled, (state, { payload }) => {
        state.status = "authenticated";
        state.user = payload.user ?? null;
        if (payload.user?.email) state.email = payload.user.email;
      })
      .addMatcher(api.endpoints.completeOnboarding.matchFulfilled, (state) => {
        if (state.user) state.user.onboarded = true;
      })
      .addMatcher(api.endpoints.logout.matchFulfilled, () => ({
        ...initialState,
        status: "guest" as const,
      }));
  },
});

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
