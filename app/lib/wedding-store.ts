"use client";

// Local dummy for the backend: everything lives in localStorage under one key

import { useSyncExternalStore } from "react";
import { getTemplateById } from "@/app/data/wedding-templates";
import type {
  UserTemplate,
  Wedding,
  WeddingContent,
  ThemeOverrides,
} from "@/app/types/wedding.types";
import { coupleNames, emptyCore, uniqueSlug } from "./wedding-utils";

const STORAGE_KEY = "canto:app:v1";

export interface StoreState {
  /** false on the server and before the first client read */
  ready: boolean;
  userTemplates: UserTemplate[];
  weddings: Wedding[];
}

const EMPTY: StoreState = { ready: false, userTemplates: [], weddings: [] };

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedState: StoreState = EMPTY;

function read(): StoreState {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode etc.): behave as an empty, session-less store
  }
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  if (!raw) {
    cachedState = { ...EMPTY, ready: true };
    return cachedState;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    cachedState = {
      ready: true,
      userTemplates: parsed.userTemplates ?? [],
      weddings: parsed.weddings ?? [],
    };
  } catch {
    cachedState = { ...EMPTY, ready: true };
  }
  return cachedState;
}

function write(next: Omit<StoreState, "ready">) {
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    throw new Error("Could not save. Your browser storage is full or blocked.");
  }
  cachedRaw = raw;
  cachedState = { ready: true, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Non-reactive snapshot for event handlers */
export const getState = (): StoreState => read();

const nowIso = () => new Date().toISOString();


export const hasTemplate = (state: StoreState, templateId: string) =>
  state.userTemplates.some((t) => t.templateId === templateId);

export function acquireTemplate(templateId: string) {
  const state = getState();
  if (hasTemplate(state, templateId)) return;
  write({
    weddings: state.weddings,
    userTemplates: [...state.userTemplates, { templateId, acquiredAt: nowIso() }],
  });
}


export const getWeddingForTemplate = (state: StoreState, templateId: string) =>
  state.weddings.find((w) => w.templateId === templateId);

export const getWeddingBySlug = (state: StoreState, slug: string) =>
  state.weddings.find((w) => w.slug === slug);

/** Created the first time the studio opens for a template; essentials start empty */
export function ensureWedding(templateId: string): Wedding {
  const state = getState();
  const existing = getWeddingForTemplate(state, templateId);
  if (existing) return existing;

  const template = getTemplateById(templateId);
  if (!template) throw new Error("Unknown template");

  const content: WeddingContent = { ...emptyCore() };
  const stamp = nowIso();
  const wedding: Wedding = {
    id: `wed_${Math.random().toString(36).slice(2, 10)}`,
    templateId,
    slug: uniqueSlug(
      coupleNames(template.mock),
      state.weddings.map((w) => w.slug)
    ),
    coupleDisplayNames: "",
    weddingDate: "",
    weddingLocation: "",
    content,
    customizations: null,
    status: "draft",
    createdAt: stamp,
    updatedAt: stamp,
    publishedAt: null,
  };

  write({
    userTemplates: hasTemplate(state, templateId)
      ? state.userTemplates
      : [...state.userTemplates, { templateId, acquiredAt: stamp }],
    weddings: [...state.weddings, wedding],
  });
  return wedding;
}

export interface WeddingSave {
  content: WeddingContent;
  customizations: ThemeOverrides | null;
  goLive?: boolean;
}

export function saveWedding(weddingId: string, save: WeddingSave): Wedding {
  const state = getState();
  const current = state.weddings.find((w) => w.id === weddingId);
  if (!current) throw new Error("Wedding not found");

  const stamp = nowIso();
  const names = coupleNames(save.content);

  // Slug follows the couple's names until the site has been published once; after
  // that the shared link must not change under people.
  const takenElsewhere = state.weddings.filter((w) => w.id !== weddingId).map((w) => w.slug);
  const slug =
    current.publishedAt || !names ? current.slug : uniqueSlug(names, takenElsewhere);

  const next: Wedding = {
    ...current,
    slug,
    coupleDisplayNames: names,
    weddingDate: save.content.weddingDate,
    weddingLocation: save.content.venue,
    content: save.content,
    customizations: save.customizations,
    status: save.goLive ? "live" : current.status,
    updatedAt: stamp,
    publishedAt: save.goLive ? current.publishedAt ?? stamp : current.publishedAt,
  };

  write({
    userTemplates: state.userTemplates,
    weddings: state.weddings.map((w) => (w.id === weddingId ? next : w)),
  });
  return next;
}
