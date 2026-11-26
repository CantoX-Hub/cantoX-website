/**
 * Stand-in for the planner events API (dummy data from app/data/dashboard).
 * Only services/api.ts should import this; delete it once the backend is ready.
 */
import { EVENTS } from "@/app/data/dashboard";

export const eventDb = {
  list: () => EVENTS.map((e) => ({ ...e, types: [...e.types] })),
  get: (id: string) => EVENTS.find((e) => e.id === id),
};
