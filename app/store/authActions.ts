import { createAction } from "@reduxjs/toolkit";

/** Dispatched by the base query when a refresh attempt fails. Kept separate to avoid import cycles. */
export const sessionExpired = createAction("auth/sessionExpired");
