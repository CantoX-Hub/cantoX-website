import { createAction } from "@reduxjs/toolkit";
import type { OnboardingPayload } from "@/app/types/onboarding.types";

/** Dispatched by the base query when a refresh attempt fails. Kept separate to avoid import cycles. */
export const sessionExpired = createAction("auth/sessionExpired");

/**
 * POST /onboarding answered 409 (this account finished onboarding before).
 * Treated like a success: the welcome screen plays, then the dashboard opens.
 */
export const onboardingAlreadyComplete = createAction<OnboardingPayload>("onboarding/alreadyComplete");
