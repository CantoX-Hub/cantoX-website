"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { WeddingTemplate } from "@/app/types/template.types";

/**
 * The user's edited templates ("My templates"), keyed by template id.
 * Kept in localStorage until the backend has endpoints; every hook instance
 * stays in sync through a window event.
 */
export interface TemplateDraft {
  template: WeddingTemplate;
  /** ms since epoch */
  updatedAt: number;
  status: "draft" | "live";
}

type DraftMap = Record<string, TemplateDraft>;

const KEY = "cantox:template-drafts";
const EVENT = "cantox:template-drafts-changed";

function read(): DraftMap {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as DraftMap) : {};
  } catch {
    return {};
  }
}

/** False when storage is full or blocked (e.g. too many uploaded photos) */
function write(map: DraftMap): boolean {
  let ok = true;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    ok = false;
  }
  if (ok) window.dispatchEvent(new CustomEvent(EVENT, { detail: map }));
  return ok;
}

export function useTemplateDrafts() {
  const [map, setMap] = useState<DraftMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMap(read());
    setLoaded(true);
    const sync = (e: Event) => setMap((e as CustomEvent<DraftMap>).detail ?? read());
    const syncStorage = (e: StorageEvent) => e.key === KEY && setMap(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", syncStorage);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  /** Newest first */
  const drafts = useMemo(() => Object.values(map).sort((a, b) => b.updatedAt - a.updatedAt), [map]);

  const get = useCallback((id: string): TemplateDraft | undefined => map[id], [map]);

  const save = useCallback((template: WeddingTemplate, status: TemplateDraft["status"] = "draft") => {
    return write({ ...read(), [template.id]: { template, updatedAt: Date.now(), status } });
  }, []);

  const remove = useCallback((id: string) => {
    const next = read();
    const removed = next[id];
    delete next[id];
    write(next);
    return removed;
  }, []);

  /** Puts back a draft returned by remove() (for Undo) */
  const restore = useCallback((draft: TemplateDraft) => write({ ...read(), [draft.template.id]: draft }), []);

  return { drafts, loaded, get, save, remove, restore };
}

/** "just now", "5 min ago", "1hr ago", "3 days ago" */
export function timeAgo(ts: number, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}hr ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}
