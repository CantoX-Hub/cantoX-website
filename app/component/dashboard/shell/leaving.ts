/**
 * Set while logging out so the auth guard doesn't race the logout redirect
 * (the guard would otherwise send a fresh "guest" to /get-started).
 */
export const leaving = { current: false };
