"use client";

import { useMemo } from "react";
import { EVENTS } from "@/app/data/dashboard";
import { useDashboard } from "./DashboardContext";
import { useTemplateDrafts } from "./templates/useTemplateDrafts";

export interface EventOption {
  id: string;
  label: string;
}

/**
 * What a wishlist or guest list can be attached to: the user's saved wedding
 * websites and, for planners, their events. A previous choice stays listed even
 * if its website was removed.
 */
export function useEventOptions(current?: { id?: string; label?: string }): EventOption[] {
  const { role } = useDashboard();
  const { drafts } = useTemplateDrafts();

  return useMemo(() => {
    const sites = drafts.map((d) => ({ id: `site:${d.template.id}`, label: `${d.template.couple.partnerOne}&${d.template.couple.partnerTwo} wedding website` }));
    const events = role === "planner" ? EVENTS.map((e) => ({ id: `event:${e.id}`, label: e.name })) : [];
    const all = [...sites, ...events];
    if (current?.id && !all.some((o) => o.id === current.id)) all.unshift({ id: current.id, label: current.label ?? "Previous event" });
    return all;
  }, [drafts, role, current?.id, current?.label]);
}
