"use client";

import { useCallback, useEffect, useState } from "react";
import type { TodoItem } from "@/app/types/dashboard.types";

/**
 * To-dos are kept in localStorage until there is an API for them.
 * Every hook instance stays in sync through a window event, so ticking a task
 * on the overview card updates the To-do page too.
 */
const KEY = "cantox:todos";
const EVENT = "cantox:todos-changed";

function read(): TodoItem[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TodoItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: TodoItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage blocked: changes live in memory only */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: items }));
}

export function useTodos() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(read());
    setLoaded(true);
    const sync = (e: Event) => setItems((e as CustomEvent<TodoItem[]>).detail ?? read());
    const syncStorage = (e: StorageEvent) => e.key === KEY && setItems(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", syncStorage);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  const update = useCallback((fn: (prev: TodoItem[]) => TodoItem[]) => {
    write(fn(read()));
  }, []);

  const add = useCallback(
    (title: string, due?: string) =>
      update((prev) => [
        { id: `t-${Date.now().toString(36)}`, title: title.trim(), done: false, due: due || undefined, createdAt: Date.now() },
        ...prev,
      ]),
    [update]
  );
  const toggle = useCallback((id: string) => update((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))), [update]);
  const remove = useCallback((id: string) => update((prev) => prev.filter((t) => t.id !== id)), [update]);
  const restore = useCallback((item: TodoItem) => update((prev) => [item, ...prev.filter((t) => t.id !== item.id)]), [update]);
  const rename = useCallback(
    (id: string, title: string) => update((prev) => prev.map((t) => (t.id === id ? { ...t, title: title.trim() } : t))),
    [update]
  );
  const clearDone = useCallback(() => update((prev) => prev.filter((t) => !t.done)), [update]);

  return { items, loaded, add, toggle, remove, restore, rename, clearDone };
}
