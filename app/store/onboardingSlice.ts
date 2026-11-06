import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/app/services/api";
import type {
  FormValues,
  OnboardingPhase,
  Role,
} from "@/app/types/onboarding.types";
import type { RootState } from "./store";

export interface OnboardingState {
  /** False until the saved draft has been read from sessionStorage */
  hydrated: boolean;
  phase: OnboardingPhase;
  role: Role | null;
  planId: string | null;
  stepIndex: number;
  /** Kept per role so switching profiles doesn't wipe what was typed */
  values: Record<Role, FormValues>;
}

export const onboardingInitialState: OnboardingState = {
  hydrated: false,
  phase: "profile",
  role: null,
  planId: null,
  stepIndex: 0,
  values: { couple: {}, planner: {}, vendor: {} },
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: onboardingInitialState,
  reducers: {
    hydrateOnboarding(state, action: PayloadAction<Partial<OnboardingState> | null>) {
      return { ...state, ...(action.payload ?? {}), hydrated: true };
    },
    selectRole(state, action: PayloadAction<Role>) {
      if (state.role !== action.payload) {
        state.role = action.payload;
        state.planId = null;
        state.stepIndex = 0;
      }
    },
    confirmRole(state) {
      if (state.role) state.phase = "plan";
    },
    selectPlan(state, action: PayloadAction<string>) {
      state.planId = action.payload;
    },
    confirmPlan(state) {
      state.phase = "form";
      state.stepIndex = 0;
    },
    skipPlan(state) {
      state.planId = null;
      state.phase = "form";
      state.stepIndex = 0;
    },
    setField(state, action: PayloadAction<{ name: string; value: string }>) {
      if (!state.role) return;
      state.values[state.role][action.payload.name] = action.payload.value;
    },
    goToStep(state, action: PayloadAction<number>) {
      state.stepIndex = Math.max(0, action.payload);
    },
    goBack(state) {
      if (state.phase === "form") {
        if (state.stepIndex > 0) state.stepIndex -= 1;
        else state.phase = "plan";
      } else if (state.phase === "plan") {
        state.phase = "profile";
      }
    },
    resetOnboarding: () => ({ ...onboardingInitialState, hydrated: true }),
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.completeOnboarding.matchFulfilled, (state) => {
        state.phase = "done";
      })
      .addMatcher(api.endpoints.logout.matchFulfilled, () => ({
        ...onboardingInitialState,
        hydrated: true,
      }));
  },
});

export const {
  hydrateOnboarding,
  selectRole,
  confirmRole,
  selectPlan,
  confirmPlan,
  skipPlan,
  setField,
  goToStep,
  goBack,
  resetOnboarding,
} = onboardingSlice.actions;

export const selectOnboarding = (state: RootState) => state.onboarding;

export const selectRoleValues = (state: RootState): FormValues => {
  const { role, values } = state.onboarding;
  return role ? values[role] : {};
};

export default onboardingSlice.reducer;
