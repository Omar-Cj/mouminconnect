# Mumin Build Connect — MVP

**Your trusted bridge to a better home.** Mumin Build Connect (MBC) is the intermediary between people who want to build and verified construction companies in Somaliland. A customer registers, submits an inquiry describing what they want to build, and the MBC admin reviews it, matches a suitable company, coordinates the first meeting and follows up until the construction agreement is signed.

This repository is the **client-side MVP**: there is no backend or database yet. Accounts, inquiries and companies live in the browser's `localStorage`, seeded with realistic demo data so every screen can be reviewed end to end.

## Stack

- React 19 + TypeScript 7 + Vite 8
- React Router 8 (declarative mode)
- Tailwind CSS 4 with the brand theme (navy `#0f2b5b`, gold `#c9a227`, Montserrat + Inter)
- lucide-react icons
- Brand assets cropped from the original brand boards: `src/assets/brand/`

## Run it

```bash
npm install --legacy-peer-deps   # the scaffold's typescript-eslint peer range predates TS 7
npm run dev                      # http://localhost:5173
npm run build                    # typecheck + production build into dist/
```

## Demo accounts

| Role     | Email                          | Password    |
| -------- | ------------------------------ | ----------- |
| Admin    | `admin@muminbuildconnect.com`  | `Admin@123` |
| Customer | `amina@example.com`            | `Demo@123`  |

The login page has one-click buttons that fill these in. The admin sidebar has **Reset demo data**, which restores the original sample data and signs you out.

## What is in the MVP

**Public website** — Home, How it works, Services, Companies directory (search, type, city, sort), Company profile, About, Contact (form stored locally), 404.

**Customer area** (`/app`) — register / log in, dashboard of inquiries with progress, 4-step inquiry wizard (project → location & site → budget & timeline → review; draft auto-saved), inquiry detail with status stepper, matched company card, meeting / agreement cards, messages with the MBC team, activity timeline, cancel while still under review, profile & password.

**Admin panel** (`/admin`) — overview (KPIs, needs-attention list, pipeline by stage, recent inquiries, latest activity, company counts), inquiries table with filters, inquiry detail with the full workflow (start review → match company → schedule meeting → record agreement → complete, plus cancel / reopen / change company), customer messages, private internal notes, companies management (add / edit / verify / activate / remove, portfolio), customers list.

**Inquiry workflow** mirrors the brand's "How we work": Submitted → Under review → Company matched → Meeting & assessment → Agreement reached → Completed (or Cancelled).

## Project layout

```
src/
  assets/brand/     logo PNGs (light + white) and brand photos
  components/
    brand/          Logo, social icons
    layout/         Navbar, Footer, PublicLayout, DashboardLayout, AuthLayout
    sections/       Home page sections (Hero, FlowStrip, Services, HowWeWork, …)
    ui/             Button, Field, Badge, Card, Modal, Misc, CompanyCard, InquiryCard, …
  lib/              types, constants (brand, statuses, project types), seed data, storage, auth hashing, hooks
  store/            StoreProvider (users / companies / inquiries / session) and ToastProvider
  pages/            public/, auth/, customer/, admin/
```

## Data & persistence

All state is under `localStorage` keys prefixed `mbc:v1:`. Passwords are SHA-256 hashed client-side only to avoid storing plaintext; this is **not** a security boundary and must be replaced by a real backend before launch. Multiple tabs stay in sync through the `storage` event.

## Suggested next steps

1. Backend + database (auth, inquiries, companies, messaging, file uploads for drawings/photos).
2. Somali / English language toggle (all brand strings are already centralised in `src/lib/constants.ts`).
3. Email / WhatsApp notifications on status changes.
4. Company self-service portal (companies respond to matches, upload portfolios).
5. Reviews and ratings after completion.

## Known issue

`npm run lint` fails in the scaffold because `typescript-eslint` does not yet support TypeScript 7.0. Pin `typescript` to `~6.0` or wait for `typescript-eslint` support for TS ≥ 7.1.
