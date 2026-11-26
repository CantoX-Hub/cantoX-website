export interface TodoTask {
  id: string;
  text: string;
  done: boolean;
}

/** A named to-do list. Open tasks keep the order the user dragged them into. */
export interface TodoList {
  id: string;
  title: string;
  tasks: TodoTask[];
  /** ISO date-time of the reminder, if one is set */
  remindAt?: string;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TodoListInput {
  title: string;
  /** Tasks without an id are new */
  tasks: { id?: string; text: string; done: boolean }[];
  /** null clears the reminder */
  remindAt?: string | null;
  archived?: boolean;
}
