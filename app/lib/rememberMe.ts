/**
 * "Remember me" is ticked on Get Started, but the backend reads it when the
 * magic link is verified (a later page load, often a new tab). The choice is
 * kept in localStorage in between.
 *
 * rememberMe true  → 7-day cookie that survives a browser restart
 * rememberMe false → session cookie, cleared when the browser closes
 */
const REMEMBER_ME_KEY = "cantox:remember-me";

export function saveRememberMe(value: boolean) {
  try {
    window.localStorage.setItem(REMEMBER_ME_KEY, value ? "1" : "0");
  } catch {
    // Storage blocked: verify falls back to the backend default (remembered)
  }
}

/** Defaults to true (the backend default), e.g. when the link is opened on another device */
export function loadRememberMe(): boolean {
  try {
    return window.localStorage.getItem(REMEMBER_ME_KEY) !== "0";
  } catch {
    return true;
  }
}
