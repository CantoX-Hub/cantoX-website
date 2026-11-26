/**
 * Stand-in for the to-do API, kept in localStorage. Only services/api.ts
 * should import this; delete it once the backend has to-do endpoints.
 */
import type { TodoList, TodoListInput, TodoTask } from "@/app/types/todo.types";

const KEY = "cantox:todo-lists";
/** Where the old single to-do list was kept; moved into a list on first load */
const LEGACY_KEY = "cantox:todos";
const DAY = 86_400_000;

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

function at(daysFromNow: number, hour: number) {
  const d = new Date(Date.now() + daysFromNow * DAY);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function tasks(items: [string, boolean?][]): TodoTask[] {
  return items.map(([text, done = false]) => ({ id: uid("tsk"), text, done }));
}

function legacy(): TodoList | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    const old = raw ? (JSON.parse(raw) as { title: string; done: boolean }[]) : [];
    if (!Array.isArray(old) || old.length === 0) return null;
    const now = Date.now();
    return { id: uid("todo"), title: "My tasks", tasks: tasks(old.map((t) => [t.title, t.done])), archived: false, createdAt: now, updatedAt: now };
  } catch {
    return null;
  }
}

function seed(): TodoList[] {
  const now = Date.now();
  const base = { archived: false, createdAt: now - 6 * DAY };
  const demo: TodoList[] = [
    {
      ...base,
      id: "wedding-list-1",
      title: "Wedding list 1",
      tasks: tasks([["Reach out to Chef Incredible"], ["Book a DJ for the wedding"], ["Confirm the venue deposit"], ["Follow up with the bride", true]]),
      remindAt: at(1, 8),
      updatedAt: now - DAY,
    },
    {
      ...base,
      id: uid("todo"),
      title: "Guest prep",
      tasks: tasks([["Update the guest list and send"], ["Meeting by 7pm with the Edwin’s family"], ["Amala vendor needed for 300 guests"]]),
      remindAt: at(2, 18),
      updatedAt: now - 2 * DAY,
    },
    {
      ...base,
      id: uid("todo"),
      title: "Décor",
      tasks: tasks([["Shortlist 3 florists"], ["Pick table linen colours"], ["Order welcome signage"]]),
      updatedAt: now - 3 * DAY,
    },
  ];
  const moved = legacy();
  return moved ? [moved, ...demo] : demo;
}

function readAll(): TodoList[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) {
      const initial = seed();
      writeAll(initial);
      window.localStorage.removeItem(LEGACY_KEY);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TodoList[]) : [];
  } catch {
    return [];
  }
}

function writeAll(lists: TodoList[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lists));
  } catch {
    throw new Error("Your browser storage is full, so we couldn't save.");
  }
}

function mutate(id: string, fn: (list: TodoList) => void): TodoList | undefined {
  const all = readAll();
  const list = all.find((l) => l.id === id);
  if (!list) return undefined;
  fn(list);
  list.updatedAt = Date.now();
  writeAll(all);
  return list;
}

function clean(input: Partial<TodoListInput>, list?: TodoList): Partial<TodoList> {
  const out: Partial<TodoList> = {};
  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) throw new Error("Give your list a title.");
    if (title.length > 80) throw new Error("Keep the title under 80 characters.");
    out.title = title;
  }
  if (input.tasks) {
    out.tasks = input.tasks
      .map((t) => ({ id: t.id && list?.tasks.some((x) => x.id === t.id) ? t.id : uid("tsk"), text: t.text.trim().slice(0, 200), done: t.done }))
      .filter((t) => t.text);
  }
  if (input.remindAt !== undefined) {
    if (input.remindAt && Number.isNaN(Date.parse(input.remindAt))) throw new Error("That reminder date isn't valid.");
    out.remindAt = input.remindAt ?? undefined;
  }
  if (input.archived !== undefined) out.archived = input.archived;
  return out;
}

export const todoDb = {
  /** Most recently changed first */
  list: () => readAll().sort((a, b) => b.updatedAt - a.updatedAt),

  get: (id: string) => readAll().find((l) => l.id === id),

  create(input: TodoListInput) {
    const now = Date.now();
    const list: TodoList = { id: uid("todo"), title: "", tasks: [], archived: false, createdAt: now, updatedAt: now, ...clean(input) };
    writeAll([list, ...readAll()]);
    return list;
  },

  update(id: string, input: Partial<TodoListInput>) {
    const all = readAll();
    const current = all.find((l) => l.id === id);
    if (!current) return undefined;
    const changes = clean(input, current);
    return mutate(id, (l) => {
      Object.assign(l, changes);
      if ("remindAt" in changes && !changes.remindAt) delete l.remindAt;
    });
  },

  remove(id: string) {
    const all = readAll();
    if (!all.some((l) => l.id === id)) return undefined;
    writeAll(all.filter((l) => l.id !== id));
    return true;
  },

  toggleTask: (id: string, taskId: string) =>
    mutate(id, (l) => {
      const task = l.tasks.find((t) => t.id === taskId);
      if (!task) throw new Error("That task no longer exists.");
      task.done = !task.done;
    }),
};
