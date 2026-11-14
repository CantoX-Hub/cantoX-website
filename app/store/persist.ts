import type { AuthUser } from "@/app/types/onboarding.types";
import type { OnboardingState } from "./onboardingSlice";

const KEY = "cantox:onboarding-draft";

// ID numbers are not written to browser storage.
const NEVER_PERSIST = ["idNumber", "ninNumber"];

export function loadOnboardingDraft(): Partial<OnboardingState> | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    if (!parsed || typeof parsed !== "object" || !parsed.values) return null;
    // Never resume on the success screen
    if (parsed.phase === "done") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveOnboardingDraft(state: OnboardingState) {
  try {
    if (state.phase === "done") {
      window.sessionStorage.removeItem(KEY);
      return;
    }
    const values = Object.fromEntries(
      Object.entries(state.values).map(([role, fields]) => [
        role,
        Object.fromEntries(
          Object.entries(fields).filter(([name]) => !NEVER_PERSIST.includes(name))
        ),
      ])
    );
    const draft: Partial<OnboardingState> = {
      phase: state.phase,
      role: state.role,
      planId: state.planId,
      stepIndex: state.stepIndex,
      values: values as OnboardingState["values"],
    };
    window.sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Storage blocked or full — the flow still works in memory.
  }
}

/* ---------- Signed-in user (display data only) ---------- */

const USER_KEY = "cantox:user";
// Only harmless display fields are kept; never tokens or ID numbers.
const USER_FIELDS = ["id", "email", "role", "onboarded", "planId", "fullName", "partnerName", "businessName", "avatarUrl", "verified"];

export function loadUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: AuthUser | null) {
  try {
    if (!user) {
      window.localStorage.removeItem(USER_KEY);
      return;
    }
    const safe = Object.fromEntries(Object.entries(user).filter(([k]) => USER_FIELDS.includes(k)));
    window.localStorage.setItem(USER_KEY, JSON.stringify(safe));
  } catch {
    // Storage blocked — the dashboard falls back to demo data.
  }
}
