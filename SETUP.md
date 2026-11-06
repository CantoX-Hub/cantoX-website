# CantoX — Sign-in + Onboarding (final, all-in-one)

Everything for sign-in and onboarding (couples, event planners, vendors) in
one place. Every file here is the latest version, so copy them all and replace
whatever you have at the same paths.

---

## 1. Install

```bash
npm install @reduxjs/toolkit react-redux framer-motion lucide-react
```

## 2. Copy the files

Copy the `app/` folder into your project, keeping the paths. Replace files that
already exist.

- **`app/layout.tsx`** is your layout with `<Providers>` wrapped around
  `{children}`. If your layout has changed, keep yours and just add the
  `Providers` import and wrapper.
- **`app/data/pricing.ts`** holds `pricingData` (pricing page + onboarding plans).
  In your existing `app/data/index.ts`, delete the old `pricingData` and add:

  ```ts
  export { pricingData } from "./pricing";
  ```

  `pricing.ts` imports the `PricingPlan` type from `@/app/types/index.types`
  (where your pricing section already gets it). Update that import if your type
  lives elsewhere.

## 3. Connect the backend

1. Copy `.env.example` to `.env.local` and set `BACKEND_URL`.
2. Merge the `rewrites()` from `next.config.example.ts` into your `next.config`.

The app calls `/api/v1/...` on your own domain, and Next forwards it to the
backend. That keeps the login cookies first-party, so you don't need any CORS setup.

## 4. Images

`public-placeholders/` has rough crops taken from the design screenshots, so
you can run the flow straight away. Copy them into `public/`, then swap them for
proper Figma exports:

- `public/onboarding/couple.png`, `planner.png`, `vendor.png` (profile cards)
- `public/avatars/avatar-1.png` … `avatar-11.png` (couples avatar picker)

Also used, and already in your project: `/logo.svg`, `/google.svg`, `/apple.svg`,
`/get-started-couple*.jpg`.

## 5. Try it

- `/get-started`: enter an email, or use Google.
- `/onboarding`: works without signing in, so you can click through every
  step before the backend is ready. Only uploads and Submit need the backend.

---

## How the flow works

```
/get-started  ── email ──▶  magic-link email ──▶  /auth/verify?token=…
      │                                                   │
      └── Google ──▶ backend OAuth ──▶ /onboarding ◀──────┘  (not onboarded)
                                            │               /dashboard (onboarded)
                                            ▼
                        Choose a profile: Couple · Event planner · Vendors
                                            ▼
                        Plan (Continue on a plan, or Skip)
                                            ▼
                        Steps for that profile → Review → Submit → Success
```

| Profile | Steps |
|---|---|
| Couple | Your details (avatar, partner) → Wedding details → Identity → Review |
| Event planner | Your details (logo, DOB) → Business information (CAC **or** NIN) → Documents → Review |
| Vendor | Business information → Contact & location → Documents (CAC, ID, proof of residence) → Review |

- The email typed on Get Started is filled in and locked on "Your details".
- Each profile's answers are kept separately, so switching profile loses nothing.
- The draft survives a page refresh (sessionStorage). ID and NIN numbers are never saved.

## Where things live

| File | What it does |
|---|---|
| `store/store.ts` | Redux store: `api`, `auth`, `onboarding` |
| `store/authSlice.ts` | Who's signed in; updated automatically by the API calls |
| `store/onboardingSlice.ts` | Current screen, chosen profile and plan, current step, typed answers |
| `store/persist.ts` | Saves/restores the onboarding draft |
| `services/api.ts` | Every endpoint as an RTK Query hook. Add new endpoints here |
| `services/baseQuery.ts` | Sends cookies, refreshes once on a 401, signs out if refresh fails |
| `services/upload.ts` | Uploads with a real progress bar (same cookies and refresh) |
| `data/onboarding.ts` | **Edit this to change the forms:** steps, fields, labels, placeholders, required/optional |
| `data/pricing.ts` | Plans and prices (shared with the pricing page) |
| `lib/onboarding.ts` | Validation and the submit payload |
| `types/onboarding.types.ts` | Types for fields, steps and the API payload |
| `component/onboarding/*` | The screens (shell, profile, plan, form, review, success, fields) |
| `component/auth/*` | Get Started and the magic-link verify page |

### Changing a form

Everything is driven by `data/onboarding.ts`. For example, to add a field to
the vendor contact step, add an entry to that step's `fields`:

```ts
{ name: "tiktok", label: "TikTok", type: "text", placeholder: "eg. @lensandlight" },
```

Options: `required`, `span: 2` (full width), `showWhen` (only show when another
field has a value), `requiredWhen`, `pattern` (format check), `reviewLabel`,
`dividerBefore`, `hint`, `accept` / `uploadFolder` (uploads).

---

## Backend contract to confirm

| What | Expected |
|---|---|
| Request magic link | `POST /api/v1/auth/magic-link/request` `{ email }` |
| Magic-link email | links to `{FRONTEND_URL}/auth/verify?token=…` |
| Verify | `POST /api/v1/auth/magic-link/verify` `{ token }` → `{ user: { email, onboarded } }`, sets cookies |
| Refresh | `POST /api/v1/auth/refresh` (cookies) |
| Google | `GET /api/v1/auth/google`, then redirect the browser to `/onboarding` |
| Upload | `POST /api/v1/upload` multipart `file`, `folder` → `{ url }` |
| Submit | `POST /api/v1/onboarding` with the payload below |

The submit body always has `role` (`couple` / `planner` / `vendor`), `planId` if
a plan was chosen (e.g. `couple-premium`, `planner-starter`, `vendor-basic`),
and the filled fields for that profile. The login email isn't sent.

**Not in the current Swagger yet:** `role`, `planId`, `partnerEmail`,
`partnerPhone`, `ninNumber`, `proofOfResidenceUrl`. Planner logos are sent as `avatarUrl`.

## Known gaps

- No `GET /auth/me` yet, so a signed-out visitor can open `/onboarding`. They're
  sent back to Get Started only when an upload or Submit fails auth. An `/auth/me`
  endpoint would let the app redirect them immediately.
- Paid plans: choosing one records `planId` only. There's no checkout step yet.
- `/dashboard` doesn't exist yet (the success screen links to it).
- Apple sign-in is shown as "soon" (no backend endpoint).
