import { createApi } from "@reduxjs/toolkit/query/react";
import { API_BASE, baseQueryWithReauth } from "./baseQuery";
import type { AuthUser, OnboardingPayload } from "@/app/types/onboarding.types";
import { toOnboardingDto } from "@/app/lib/onboarding";
import type { TemplateSummary, WeddingTemplate } from "@/app/types/template.types";
import type { Wishlist, WishlistInput } from "@/app/types/wishlist.types";
import type { GuestInput, GuestList, GuestListInput, RsvpLookup } from "@/app/types/guest.types";
import type { TodoList, TodoListInput } from "@/app/types/todo.types";
import type { PlannerEvent, Vendor } from "@/app/types/dashboard.types";
import type { VendorReviewInput } from "./mock/vendorDb";
import type { CalendarEvent, CalendarEventInput, GoogleCalendarStatus } from "@/app/types/calendar.types";

/** User as the backend returns it from /auth/me and /auth/magic-link/verify */
export interface BackendUser {
  id: string;
  email: string;
  /** "unassigned" until onboarding is done */
  role: "couple" | "planner" | "vendor" | "unassigned";
  onboarded: boolean;
  name: string | null;
  avatar: string | null;
}

export interface VerifyMagicLinkResponse {
  message?: string;
  user?: BackendUser;
}

/** Maps the backend user onto the fields the app uses (role, fullName, avatarUrl). */
export function toAuthUser(user: BackendUser): AuthUser {
  const role = user.role === "unassigned" ? null : user.role;
  return {
    id: user.id,
    email: user.email,
    role,
    onboarded: user.onboarded,
    ...(user.name ? { fullName: user.name } : {}),
    // Vendors have no personal name; the backend's name is their business name
    ...(user.name && role === "vendor" ? { businessName: user.name } : {}),
    ...(user.avatar ? { avatarUrl: user.avatar } : {}),
  };
}

export interface UploadResponse {
  url: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Wishlist", "GuestList", "TodoList", "Vendor", "CalendarEvent", "GoogleCalendar"],
  endpoints: (build) => ({
    health: build.query<unknown, void>({
      query: () => "/health",
    }),

    requestMagicLink: build.mutation<{ message?: string }, { email: string }>({
      query: (body) => ({ url: "/auth/magic-link/request", method: "POST", body }),
    }),

    /** rememberMe false → session cookie cleared when the browser closes; true → 7 days */
    verifyMagicLink: build.mutation<VerifyMagicLinkResponse, { token: string; rememberMe?: boolean }>({
      query: (body) => ({ url: "/auth/magic-link/verify", method: "POST", body }),
    }),

    /** Permanently deletes the signed-in account and its personal details */
    deleteAccount: build.mutation<void, void>({
      query: () => ({ url: "/auth/me", method: "DELETE" }),
    }),

    /** Restores the session on page load and after the Google redirect */
    getMe: build.query<BackendUser, void>({
      query: () => "/auth/me",
    }),

    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),

    // Takes the form payload (authSlice keeps it for the dashboard) and sends
    // only the fields the backend DTO accepts.
    completeOnboarding: build.mutation<unknown, OnboardingPayload>({
      query: (payload) => ({ url: "/onboarding", method: "POST", body: toOnboardingDto(payload) }),
    }),

    uploadFile: build.mutation<UploadResponse, { file: File; folder?: string }>({
      query: ({ file, folder }) => {
        const formData = new FormData();
        formData.append("file", file);
        if (folder) formData.append("folder", folder);
        return { url: "/upload", method: "POST", body: formData };
      },
    }),

    /* ---------- Templates ----------
     * Dummy data until the backend has templates. When it does, replace each
     * queryFn with `query: () => "/templates"` / `query: (id) => \`/templates/${id}\``;
     * the components don't change. The data is imported lazily so it isn't in
     * every page's bundle. */

    getTemplates: build.query<TemplateSummary[], void>({
      queryFn: async () => {
        const { TEMPLATE_SUMMARIES } = await import("@/app/data/templates");
        return { data: TEMPLATE_SUMMARIES };
      },
    }),

    getTemplate: build.query<WeddingTemplate, string>({
      queryFn: async (id) => {
        const { TEMPLATES } = await import("@/app/data/templates");
        const template = TEMPLATES.find((t) => t.id === id);
        return template
          ? { data: template }
          : { error: { status: 404, data: { error: { message: "Template not found." } } } };
      },
    }),

    /* ---------- Wishlists ----------
     * Backed by a localStorage mock (services/mock/wishlistDb). Swap each
     * queryFn for a `query` when the backend has wishlist endpoints. */

    getWishlists: build.query<Wishlist[], void>({
      queryFn: () => mock(wishlists, (db) => db.list(), WISHLIST_404),
      providesTags: (list) => [...(list ?? []).map((w) => ({ type: "Wishlist" as const, id: w.id })), { type: "Wishlist", id: "LIST" }],
    }),

    getWishlist: build.query<Wishlist, string>({
      queryFn: (id) => mock(wishlists, (db) => db.get(id), WISHLIST_404),
      providesTags: (_r, _e, id) => [{ type: "Wishlist", id }],
    }),

    createWishlist: build.mutation<Wishlist, WishlistInput>({
      queryFn: (input) => mock(wishlists, (db) => db.create(input), WISHLIST_404),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    updateWishlist: build.mutation<Wishlist, { id: string; input: WishlistInput }>({
      queryFn: ({ id, input }) => mock(wishlists, (db) => db.update(id, input), WISHLIST_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Wishlist", id }, { type: "Wishlist", id: "LIST" }],
    }),

    deleteWishlist: build.mutation<null, string>({
      queryFn: (id) => mock(wishlists, (db) => (db.remove(id), null), WISHLIST_404),
      invalidatesTags: (_r, _e, id) => [{ type: "Wishlist", id }, { type: "Wishlist", id: "LIST" }],
    }),

    /** Updates "Opened …" on the list */
    openWishlist: build.mutation<null, string>({
      queryFn: (id) => mock(wishlists, (db) => (db.open(id), null), WISHLIST_404),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    /** Guest tapped "I've purchased this" */
    setWishlistItemPurchased: build.mutation<Wishlist, { id: string; itemId: string; purchased: boolean }>({
      queryFn: ({ id, itemId, purchased }) => mock(wishlists, (db) => db.setPurchased(id, itemId, purchased), WISHLIST_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Wishlist", id }],
    }),

    /* ---------- Guest lists ----------
     * Backed by a localStorage mock (services/mock/guestDb). Every mutation
     * returns the updated list, so the detail page refreshes from one tag. */

    getGuestLists: build.query<GuestList[], void>({
      queryFn: () => mock(guestLists, (db) => db.list(), GUESTS_404),
      providesTags: (lists) => [...(lists ?? []).map((l) => ({ type: "GuestList" as const, id: l.id })), { type: "GuestList", id: "LIST" }],
    }),

    getGuestList: build.query<GuestList, string>({
      queryFn: (id) => mock(guestLists, (db) => db.get(id), GUESTS_404),
      providesTags: (_r, _e, id) => [{ type: "GuestList", id }],
    }),

    createGuestList: build.mutation<GuestList, GuestListInput>({
      queryFn: (input) => mock(guestLists, (db) => db.create(input), GUESTS_404),
      invalidatesTags: [{ type: "GuestList", id: "LIST" }],
    }),

    updateGuestList: build.mutation<GuestList, { id: string; input: Partial<GuestListInput> }>({
      queryFn: ({ id, input }) => mock(guestLists, (db) => db.update(id, input), GUESTS_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "GuestList", id }, { type: "GuestList", id: "LIST" }],
    }),

    deleteGuestList: build.mutation<null, string>({
      queryFn: (id) => mock(guestLists, (db) => (db.remove(id), null), GUESTS_404),
      invalidatesTags: (_r, _e, id) => [{ type: "GuestList", id }, { type: "GuestList", id: "LIST" }],
    }),

    openGuestList: build.mutation<null, string>({
      queryFn: (id) => mock(guestLists, (db) => (db.open(id), null), GUESTS_404),
      invalidatesTags: [{ type: "GuestList", id: "LIST" }],
    }),

    addGuestTable: build.mutation<GuestList, string>({
      queryFn: (id) => mock(guestLists, (db) => db.addTable(id), GUESTS_404),
      invalidatesTags: (_r, _e, id) => [{ type: "GuestList", id }],
    }),

    /** One guest from the panel, or many from a CSV. `invite` marks them invited. */
    addGuests: build.mutation<GuestList, { id: string; guests: GuestInput[]; invite?: boolean }>({
      queryFn: ({ id, guests, invite = false }) => mock(guestLists, (db) => db.addGuests(id, guests, invite), GUESTS_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "GuestList", id }],
    }),

    updateGuest: build.mutation<GuestList, { id: string; guestId: string; guest: GuestInput; invite?: boolean }>({
      queryFn: ({ id, guestId, guest, invite = false }) => mock(guestLists, (db) => db.updateGuest(id, guestId, guest, invite), GUESTS_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "GuestList", id }],
    }),

    deleteGuests: build.mutation<GuestList, { id: string; guestIds: string[] }>({
      queryFn: ({ id, guestIds }) => mock(guestLists, (db) => db.deleteGuests(id, guestIds), GUESTS_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "GuestList", id }],
    }),

    /** TODO(backend): should actually send the WhatsApp / SMS / email invites */
    inviteGuests: build.mutation<GuestList, { id: string; guestIds: string[] }>({
      queryFn: ({ id, guestIds }) => mock(guestLists, (db) => db.invite(id, guestIds), GUESTS_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "GuestList", id }],
    }),

    /** Public RSVP page: find yourself by name or phone */
    lookupRsvp: build.query<RsvpLookup, { id: string; query: string }>({
      queryFn: ({ id, query }) => mock(guestLists, (db) => db.lookup(id, query), GUESTS_404),
      providesTags: (_r, _e, { id }) => [{ type: "GuestList", id }],
    }),

    respondRsvp: build.mutation<null, { id: string; guestId: string; status: "confirmed" | "declined" }>({
      queryFn: ({ id, guestId, status }) => mock(guestLists, (db) => (db.respond(id, guestId, status) ? null : undefined), GUESTS_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "GuestList", id }],
    }),

    /* ---------- To-do lists ----------
     * Backed by a localStorage mock (services/mock/todoDb). Swap each queryFn
     * for a `query` when the backend has to-do endpoints.
     * TODO(backend): reminders are only stored; sending them needs the server. */

    getTodoLists: build.query<TodoList[], void>({
      queryFn: () => mock(todoLists, (db) => db.list(), TODO_404),
      providesTags: (lists) => [...(lists ?? []).map((l) => ({ type: "TodoList" as const, id: l.id })), { type: "TodoList", id: "LIST" }],
    }),

    createTodoList: build.mutation<TodoList, TodoListInput>({
      queryFn: (input) => mock(todoLists, (db) => db.create(input), TODO_404),
      invalidatesTags: [{ type: "TodoList", id: "LIST" }],
    }),

    updateTodoList: build.mutation<TodoList, { id: string; input: Partial<TodoListInput> }>({
      queryFn: ({ id, input }) => mock(todoLists, (db) => db.update(id, input), TODO_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "TodoList", id }, { type: "TodoList", id: "LIST" }],
    }),

    deleteTodoList: build.mutation<null, string>({
      queryFn: (id) => mock(todoLists, (db) => (db.remove(id) ? null : undefined), TODO_404),
      invalidatesTags: (_r, _e, id) => [{ type: "TodoList", id }, { type: "TodoList", id: "LIST" }],
    }),

    toggleTodoTask: build.mutation<TodoList, { id: string; taskId: string }>({
      queryFn: ({ id, taskId }) => mock(todoLists, (db) => db.toggleTask(id, taskId), TODO_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "TodoList", id }, { type: "TodoList", id: "LIST" }],
    }),

    /* ---------- Vendors ----------
     * Dummy data (services/mock/vendorDb) until the vendor endpoints are live.
     * Then: getVendors → `query: () => "/vendors"` (move search/filters to query
     * params), getVendor → `/vendors/${id}`, addVendorReview → POST `/vendors/${id}/reviews`. */

    getVendors: build.query<Vendor[], void>({
      queryFn: () => mock(vendors, (db) => db.list(), VENDOR_404),
      providesTags: (list) => [...(list ?? []).map((v) => ({ type: "Vendor" as const, id: v.id })), { type: "Vendor", id: "LIST" }],
    }),

    getVendor: build.query<Vendor, string>({
      queryFn: (id) => mock(vendors, (db) => db.get(id), VENDOR_404),
      providesTags: (_r, _e, id) => [{ type: "Vendor", id }],
    }),

    addVendorReview: build.mutation<Vendor, { id: string; review: VendorReviewInput }>({
      queryFn: ({ id, review }) => mock(vendors, (db) => db.addReview(id, review), VENDOR_404),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Vendor", id }],
    }),

    /* ---------- Planner events ----------
     * Dummy data (services/mock/eventDb) until the backend has events.
     * Then: `query: () => "/events"`. */

    getEvents: build.query<PlannerEvent[], void>({
      queryFn: () => mock(events, (db) => db.list(), EVENT_404),
    }),

    /* ---------- Calendar + Google Calendar ----------
     * Dummy data (services/mock/calendarDb) until the backend is ready. Planned endpoints:
     *   GET    /calendar/events                     → getCalendarEvents
     *   POST   /calendar/events  { ...input, syncToGoogle }
     *   PATCH  /calendar/events/:id                 (backend also patches the Google copy)
     *   DELETE /calendar/events/:id                 (backend also deletes the Google copy)
     *   PUT    /calendar/events/:id/google          → copy to Google (events.insert)
     *   DELETE /calendar/events/:id/google          → remove the Google copy
     *   GET    /integrations/google-calendar        → { connected, email }
     *   GET    /integrations/google-calendar/connect   (browser redirect to Google's consent screen;
     *          the callback stores the refresh token server-side and redirects to /dashboard/calendar)
     *   DELETE /integrations/google-calendar        (revoke the token) */

    getCalendarEvents: build.query<CalendarEvent[], void>({
      queryFn: () => mock(calendar, (db) => db.list(), CALENDAR_404),
      providesTags: [{ type: "CalendarEvent", id: "LIST" }],
    }),

    createCalendarEvent: build.mutation<CalendarEvent, { input: CalendarEventInput; syncToGoogle?: boolean }>({
      queryFn: ({ input, syncToGoogle }) => mock(calendar, (db) => db.create(input, syncToGoogle), CALENDAR_404),
      invalidatesTags: [{ type: "CalendarEvent", id: "LIST" }],
    }),

    updateCalendarEvent: build.mutation<CalendarEvent, { id: string; input: CalendarEventInput }>({
      queryFn: ({ id, input }) => mock(calendar, (db) => db.update(id, input), CALENDAR_404),
      invalidatesTags: [{ type: "CalendarEvent", id: "LIST" }],
    }),

    deleteCalendarEvent: build.mutation<null, string>({
      queryFn: (id) => mock(calendar, (db) => (db.remove(id) ? null : undefined), CALENDAR_404),
      invalidatesTags: [{ type: "CalendarEvent", id: "LIST" }],
    }),

    /** Undo for delete. The real API can do this as a create with the old fields. */
    restoreCalendarEvent: build.mutation<CalendarEvent, CalendarEvent>({
      queryFn: (ev) => mock(calendar, (db) => db.restore(ev), CALENDAR_404),
      invalidatesTags: [{ type: "CalendarEvent", id: "LIST" }],
    }),

    setCalendarEventSynced: build.mutation<CalendarEvent, { id: string; synced: boolean }>({
      queryFn: ({ id, synced }) => mock(calendar, (db) => db.setSynced(id, synced), CALENDAR_404),
      invalidatesTags: [{ type: "CalendarEvent", id: "LIST" }],
    }),

    getGoogleCalendarStatus: build.query<GoogleCalendarStatus, void>({
      queryFn: () => mock(calendar, (db) => db.googleStatus(), CALENDAR_404),
      providesTags: ["GoogleCalendar"],
    }),

    /** Real backend: not a mutation; send the browser to GOOGLE_CALENDAR_CONNECT_URL instead */
    connectGoogleCalendar: build.mutation<GoogleCalendarStatus, void>({
      queryFn: async () => {
        await new Promise((r) => setTimeout(r, 900));
        return mock(calendar, (db) => db.connectGoogle(), CALENDAR_404);
      },
      invalidatesTags: ["GoogleCalendar", { type: "CalendarEvent", id: "LIST" }],
    }),

    disconnectGoogleCalendar: build.mutation<GoogleCalendarStatus, void>({
      queryFn: () => mock(calendar, (db) => db.disconnectGoogle(), CALENDAR_404),
      invalidatesTags: ["GoogleCalendar", { type: "CalendarEvent", id: "LIST" }],
    }),
  }),
});

/* ---------- Local mocks (until the backend has these endpoints) ---------- */

const wishlists = () => import("./mock/wishlistDb").then((m) => m.wishlistDb);
const guestLists = () => import("./mock/guestDb").then((m) => m.guestDb);
const todoLists = () => import("./mock/todoDb").then((m) => m.todoDb);
const WISHLIST_404 = "Wishlist not found.";
const TODO_404 = "To-do list not found.";
const vendors = () => import("./mock/vendorDb").then((m) => m.vendorDb);
const VENDOR_404 = "Vendor not found.";
const events = () => import("./mock/eventDb").then((m) => m.eventDb);
const EVENT_404 = "Event not found.";
const calendar = () => import("./mock/calendarDb").then((m) => m.calendarDb);
const CALENDAR_404 = "Calendar event not found.";
const GUESTS_404 = "Guest list not found.";

/**
 * Runs a call against a mock store and shapes the result like a fetch:
 * undefined → 404, a broken rule (e.g. "Table 002 is full.") → 400 with that message.
 * Mocks are imported lazily so they stay out of every page's bundle.
 */
async function mock<D, T>(load: () => Promise<D>, run: (db: D) => T | undefined, notFound: string) {
  try {
    const data = run(await load());
    if (data === undefined) return { error: { status: 404, data: { error: { message: notFound } } } as const };
    return { data };
  } catch (e) {
    return { error: { status: 400, data: { error: { message: e instanceof Error ? e.message : "Something went wrong." } } } as const };
  }
}

export const {
  useHealthQuery,
  useRequestMagicLinkMutation,
  useVerifyMagicLinkMutation,
  useGetMeQuery,
  useDeleteAccountMutation,
  useLogoutMutation,
  useCompleteOnboardingMutation,
  useUploadFileMutation,
  useGetTemplatesQuery,
  useGetTemplateQuery,
  useGetWishlistsQuery,
  useGetWishlistQuery,
  useCreateWishlistMutation,
  useUpdateWishlistMutation,
  useDeleteWishlistMutation,
  useOpenWishlistMutation,
  useSetWishlistItemPurchasedMutation,
  useGetGuestListsQuery,
  useGetGuestListQuery,
  useCreateGuestListMutation,
  useUpdateGuestListMutation,
  useDeleteGuestListMutation,
  useOpenGuestListMutation,
  useAddGuestTableMutation,
  useAddGuestsMutation,
  useUpdateGuestMutation,
  useDeleteGuestsMutation,
  useInviteGuestsMutation,
  useLookupRsvpQuery,
  useRespondRsvpMutation,
  useGetTodoListsQuery,
  useCreateTodoListMutation,
  useUpdateTodoListMutation,
  useDeleteTodoListMutation,
  useToggleTodoTaskMutation,
  useGetVendorsQuery,
  useGetVendorQuery,
  useAddVendorReviewMutation,
  useGetEventsQuery,
  useGetCalendarEventsQuery,
  useCreateCalendarEventMutation,
  useUpdateCalendarEventMutation,
  useDeleteCalendarEventMutation,
  useRestoreCalendarEventMutation,
  useSetCalendarEventSyncedMutation,
  useGetGoogleCalendarStatusQuery,
  useConnectGoogleCalendarMutation,
  useDisconnectGoogleCalendarMutation,
} = api;

/** Full-page redirect — the backend handles the OAuth dance and redirects back. */
export const GOOGLE_AUTH_URL = `${API_BASE}/auth/google`;
/** Where "Connect Google Calendar" will send the browser once the backend route exists */
export const GOOGLE_CALENDAR_CONNECT_URL = `${API_BASE}/integrations/google-calendar/connect`;
