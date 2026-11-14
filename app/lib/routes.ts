export const ROUTES = {
  home: "/",
  getStarted: "/get-started",
  checkEmail: "/auth/check-email",
  verify: "/auth/verify",
  /** Google sign-in redirect target */
  authCallback: "/auth/callback",
  onboarding: "/onboarding",
  /** TODO: point at the real dashboard once it exists */
  dashboard: "/dashboard",
} as const;
