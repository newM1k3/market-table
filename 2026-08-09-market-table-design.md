# Market Table — Design Document

- **Date:** 2026-08-09
- **Status:** Design approved, pending implementation
- **Working name:** Market Table

---

## 1. Overview

Market Table is a PWA that connects farmers' market shoppers with local vendors through recipes, a venue map, and a QR-based purchase tracking system. It serves three user roles — shoppers, vendors, and market administrators — within a shared ecosystem.

The app is seeded with Foodland Ontario's open seasonal availability data to surface what's fresh, and uses curated + community-submitted recipes to drive the core shopping experience.

### Core Value Loop

A shopper arrives at the market → opens the PWA → browses recipes built around what's in season → picks a recipe → sees exactly which vendor stalls have each ingredient → follows a custom market map → scans QR codes at each vendor to check off purchases and track spending → leaves with a receipt summary and pantry history.

### User Roles

| Role | Description |
|---|---|
| **Shopper** | Browse recipes → get vendor-matched shopping list → navigate market map → scan QR at stalls → budget tracker + pantry history |
| **Vendor** | Passive by default (auto-analytics from shopper scans). Opt in to claim profile, post specials, see richer dashboard data |
| **Market Admin** | Manage stalls/vendors/map, seed recipes, review community submissions, view aggregated analytics |

---

## 2. Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Audience** | Shared ecosystem | Long-term value for all stakeholders, not just shoppers |
| **Scale** | Single market launch, multi-market architected | `market_id` on every table from day one; fast pilot, no rewrite later |
| **Form factor** | PWA (React + Vite) | No app store friction, works on iOS + Android, QR scanning via browser API |
| **Auth** | Anonymous-first; SMS magic link for accounts | Lowest barrier to entry; account only needed for saved data |
| **QR flow** | Shopper scans vendor QR → picks recipe → checks off purchases | Shopper gets budget tracking + pantry; vendor gets analytics |
| **Shopper value** | Shopping list + budget tracker + pantry-aware recipe suggestions | Clear "why would I scan?" answer — immediate utility, not abstract data |
| **Vendor model** | Passive analytics default; opt-in profile + richer data | Zero friction adoption, path to deeper engagement |
| **Map** | Static custom floor plan with positioned markers | Simple to build, covers indoor/outdoor markets, upgrade path to GPS later |
| **Recipes** | Hybrid: curated seeds + community + Foodland Ontario deep links | App isn't empty on day one, grows organically, leverages official seasonal content |
| **Seasonal data** | Foodland Ontario open data via Ontario Data Catalogue | Free, commercially usable, Open Government Licence, programmatic API |

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | React 18 + Vite + TypeScript | PWA with service worker + manifest |
| **Styling & UI** | Tailwind CSS + Lucide React | Mobile-first utility classes, consistent icon set |
| **Auth & Data** | PocketBase | Single binary: auth, DB, real-time subscriptions, file storage. Configured via `VITE_POCKETBASE_URL` |
| **Hosting** | Netlify static hosting + Netlify Functions | Functions handle SMS sending, QR validation, scheduled data jobs |
| **Maps** | Custom SVG overlay (static floor plan image + positioned marker coordinates) | No API dependency; markers are x/y coordinates on the uploaded venue image |
| **QR scanning** | Browser `BarcodeDetector` API or `html5-qrcode` library | Works in PWA on modern mobile browsers |
| **SMS auth** | Twilio (via Netlify Function) | Magic link sent to phone number |

---

## 4. Architecture

### System Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Shopper PWA (React)                    │
│  ┌────────┐ ┌──────────┐ ┌─────┐ ┌───────┐ ┌─────────┐ │
│  │ Home   │ │ Recipes  │ │ Map │ │ Scan  │ │ Account │ │
│  │ (anon) │ │ (anon)   │ │(anon)│ │(anon) │ │ (auth)  │ │
│  └────────┘ └──────────┘ └─────┘ └───────┘ └─────────┘ │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTPS
┌──────────────────────┴───────────────────────────────────┐
│                   Netlify Hosting                         │
│  ┌──────────────────┐  ┌───────────────────────────────┐ │
│  │  Static Assets    │  │  Netlify Functions            │ │
│  │  (PWA build)     │  │  - SMS auth (Twilio)          │ │
│  │                  │  │  - QR validation              │ │
│  │                  │  │  - sync-seasonal-data (weekly) │ │
│  │                  │  │  - generate-analytics (daily)  │ │
│  └──────────────────┘  └──────────────┬────────────────┘ │
└───────────────────────────────────────┼──────────────────┘
                                        │
┌───────────────────────────────────────┴──────────────────┐
│                    PocketBase Server                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │   Auth    │ │   DB     │ │ Realtime │ │ File Store │ │
│  │ (SMS +   │ │(PostgreSQL│ │(WS subs) │ │ (images,   │ │
│  │  guest)  │ │  -like)  │ │          │ │  floorplan)│ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
└──────────────────────────────────────────────────────────┘
                                        │
┌───────────────────────────────────────┴──────────────────┐
│                 External Data Sources                     │
│  ┌──────────────────────┐  ┌────────────────────────┐   │
│  │ Ontario Data Catalogue│  │ Foodland Ontario        │   │
│  │ (CKAN API)           │  │ Recipes Portal          │   │
│  │ Seasonal availability │  │ (deep-linked, not       │   │
│  │ open data            │  │  scraped)               │   │
│  └──────────────────────┘  └────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Multi-Market Readiness

Every table carries a `market_id` foreign key. The first market is `market_id = 1`. Adding a second market means creating a new `market` row and assigning its vendors, stalls, recipes, and admins. Cross-market analytics (future) are a simple `market_id` aggregation.

---

## 5. Data Model

### Core Tables

```sql
-- Market (tenant boundary)
market (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  location        TEXT,
  floor_plan_url  TEXT,           -- uploaded floor plan image
  created_at      TIMESTAMP
)

-- Stall (positioned on floor plan)
stall (
  id              TEXT PRIMARY KEY,
  market_id       TEXT REFERENCES market(id),
  label           TEXT NOT NULL,  -- "A1", "B3", etc.
  x               REAL NOT NULL,  -- x-coordinate on floor plan
  y               REAL NOT NULL,  -- y-coordinate on floor plan
  category        TEXT            -- "produce", "bakery", "dairy", etc.
)

-- Vendor
vendor (
  id              TEXT PRIMARY KEY,
  market_id       TEXT REFERENCES market(id),
  name            TEXT NOT NULL,
  description     TEXT,
  stall_id        TEXT REFERENCES stall(id),
  logo_url        TEXT,
  claimed         BOOLEAN DEFAULT false,
  contact_email   TEXT,
  created_at      TIMESTAMP
)

-- Product (what a vendor sells)
product (
  id              TEXT PRIMARY KEY,
  vendor_id       TEXT REFERENCES vendor(id),
  name            TEXT NOT NULL,
  category        TEXT,
  price_estimate  TEXT,           -- "$3–5 / bunch"
  seasonal_tags   JSONB           -- ["spring", "summer"]
)

-- Seasonal availability (from Ontario Data Catalogue)
seasonal_availability (
  id              TEXT PRIMARY KEY,
  product_name    TEXT NOT NULL,
  season          TEXT NOT NULL,  -- "spring", "summer", "fall", "winter", "year-round"
  months          JSONB,          -- [5, 6, 7, 8, 9]
  source          TEXT DEFAULT 'foodland-ontario',
  updated_at      TIMESTAMP
)

-- Recipe
recipe (
  id              TEXT PRIMARY KEY,
  market_id       TEXT REFERENCES market(id),
  title           TEXT NOT NULL,
  description     TEXT,
  image_url       TEXT,
  source          TEXT NOT NULL,  -- "curated" | "community"
  author_id       TEXT,           -- references shopper(id) for community
  status          TEXT DEFAULT 'pending', -- "pending" | "approved" | "rejected"
  cook_time_min   INTEGER,
  servings        INTEGER,
  seasonal_tags   JSONB,
  foodland_url    TEXT,           -- optional deep link to Foodland Ontario recipe
  created_at      TIMESTAMP
)

-- Recipe ingredient (matched to vendor products at query time)
recipe_ingredient (
  id              TEXT PRIMARY KEY,
  recipe_id       TEXT REFERENCES recipe(id),
  product_name    TEXT NOT NULL,   -- "heirloom tomatoes"
  quantity        TEXT,            -- "4", "2 cups"
  unit            TEXT             -- "whole", "cups", "bunch"
)

-- Shopper (created on SMS sign-up)
shopper (
  id              TEXT PRIMARY KEY,
  phone_hash      TEXT UNIQUE,     -- hashed phone number
  market_id       TEXT REFERENCES market(id),
  display_name    TEXT,
  created_at      TIMESTAMP
)

-- Pantry item (tracks what shopper bought and when)
pantry_item (
  id              TEXT PRIMARY KEY,
  shopper_id      TEXT REFERENCES shopper(id),
  product_name    TEXT NOT NULL,
  vendor_id       TEXT REFERENCES vendor(id),
  quantity        TEXT,
  purchased_at    TIMESTAMP
)

-- Scan log (QR scan at vendor stall)
scan_log (
  id              TEXT PRIMARY KEY,
  market_id       TEXT REFERENCES market(id),
  shopper_id      TEXT,            -- nullable for anonymous scans
  vendor_id       TEXT REFERENCES vendor(id),
  recipe_id       TEXT REFERENCES recipe(id),
  items           JSONB,           -- [{product_name, quantity, unit}]
  scanned_at      TIMESTAMP
)

-- Vendor product-recipe match (admin-managed or auto-suggested)
vendor_recipe_highlight (
  id              TEXT PRIMARY KEY,
  vendor_id       TEXT REFERENCES vendor(id),
  recipe_id       TEXT REFERENCES recipe(id),
  highlighted_by  TEXT             -- "auto" | "admin" | "vendor"
)
```

---

## 6. Shopper Screen Flow

### Screen Map

```
Market Home
├── What's Fresh Today (seasonal data)
├── Featured Recipes
├── Vendor Spotlight
└── [Start Shopping] ──────────────────────────┐
                                               │
Recipes                                         │
├── Filter: meal type, season, dietary          │
├── Card grid with seasonal match badge         │
└── Tap → Recipe Detail ────────────────────────┤
    ├── Full recipe + ingredients               │
    ├── [Shop This Recipe] ─────────────────────┤
    │   ├── Ingredient → Vendor → Stall #       │
    │   ├── Estimated cost per ingredient       │
    │   ├── Running total                        │
    │   ├── Mini map with highlighted route     │
    │   └── [Navigate to Stall] per ingredient  │
    └── [View on Foodland Ontario] (optional)   │
                                               │
Market Map                                      │
├── Floor plan image + vendor markers           │
├── Tap marker → vendor name, products          │
├── In shopping mode: route highlights          │
└── Tap vendor → QR scan prompt                 │
                                               │
QR Scan                                         │
├── Opens device camera                         │
├── Scan → "You're at [Vendor]. Shopping for    │
│   [Recipe Name]?"                             │
├── Checkboxes for each ingredient at this      │
│   vendor                                      │
├── [Confirm] → items checked off list,         │
│   running total updates                       │
└── End-of-trip: receipt summary                │
                                               │
Account (requires sign-in)                      │
├── Active shopping list                        │
├── Pantry (bought + when)                      │
├── Spending history                            │
├── Favorite recipes                            │
└── Favorite vendors                            │
```

### Anonymous vs. Authenticated

| Feature | Anonymous | Authenticated |
|---|---|---|
| Browse recipes | ✅ | ✅ |
| View recipe details | ✅ | ✅ |
| Shop This Recipe (vendor match) | ✅ | ✅ |
| Market map | ✅ | ✅ |
| QR scan + check-off | ✅ | ✅ |
| Save shopping list | ❌ | ✅ |
| Pantry history | ❌ | ✅ |
| Budget tracker / spending history | ❌ | ✅ |
| Favorite recipes/vendors | ❌ | ✅ |
| Submit community recipes | ❌ | ✅ |

---

## 7. Vendor Experience

### Passive Mode (Default)

Vendors don't interact with the app during market hours. They receive:

- **Printable QR code** for their stall (generated by admin, links to scan flow)
- **Post-market analytics report** (via email or dashboard):
  - "12 shoppers scanned for your basil this week"
  - Top recipes driving their sales
  - Busiest hour
  - Most-requested items

### Opt-In Vendor Dashboard

Claimed vendors access a web dashboard (not PWA — desktop browser oriented):

- **Live activity feed** (market hours): "5 shoppers heading to you for pesto ingredients"
- **Profile management:** add stall photo, update product list, post "today's special"
- **Product-to-recipe matching:** "3 recipes in the app use your heirloom tomatoes — highlight any?"
- **Historical analytics:** weekly trends, seasonal comparisons, recipe-driven revenue

---

## 8. Admin Dashboard

### Features

- **Stall & Floor Plan Manager:** upload/replace floor plan image, place numbered stall markers by clicking on the image, assign vendors to stalls
- **Vendor Roster:** manage vendor list (name, category, products, claimed status), generate/print QR codes per vendor
- **Recipe Manager:** add curated recipes (seeded content), review/approve community submissions, tag with Foodland Ontario seasonal data
- **Analytics Dashboard:**
  - Foot traffic heatmap (which stalls get scanned most)
  - Popular recipes → which vendors benefit
  - Peak hours, busiest market days
  - Seasonal demand trends
  - Vendor performance comparisons (anonymized aggregates)

---

## 9. Foodland Ontario Integration

### What We Use

| Data | Source | License | Integration |
|---|---|---|---|
| Seasonal availability | [Ontario Data Catalogue CKAN API](https://data.ontario.ca/en/api/1/util/snippet/api_info.html?resource_id=f85f9d64-116d-4169-b887-665cf804d113) | Open Government Licence – Ontario | Weekly Netlify Function pulls data → upserts into `seasonal_availability` table |
| Recipes | [Foodland Ontario Recipes Portal](https://www.ontario.ca/foodland/recipes) | Public website | Deep-linked from app ("View full recipe on Foodland Ontario"). No scraping, no hosting their content |
| Logo | Not used | Trademark restricted | Foodland Ontario logo is reserved for farmers/processors/retailers on packaging. Not used in app UI |

### Seasonal Availability Pipeline

```
Weekly Netlify scheduled function
  → Fetch JSON from CKAN API
  → Parse produce + season + months
  → Upsert into PocketBase seasonal_availability table
  → Shopper home screen: "What's Fresh Today"
  → Recipe cards: "100% in season" badge
  → Shopping mode: "Tomatoes are peak season — 4 stalls have them"
```

### Attribution

App footer and analytics pages credit: "Seasonal produce data from the Ontario Data Catalogue, used under the Open Government Licence – Ontario. Recipes linked from Foodland Ontario."

---

## 10. Scheduled Jobs (Netlify Functions)

| Job | Schedule | Description |
|---|---|---|
| `sync-seasonal-data` | Weekly (Sunday 2am ET) | Pulls Ontario Data Catalogue seasonal availability, upserts into PocketBase |
| `generate-analytics` | Daily (market close + 2h) | Aggregates `scan_log` → daily report for admin dashboard |
| `cleanup-anon-sessions` | Daily (3am ET) | Purges expired anonymous sessions from PocketBase |

---

## 11. QR Code Technical Flow

1. Admin generates a QR code per vendor stall (static URL: `https://[app]/scan/[vendor-id]`)
2. QR code is printed and displayed at the stall
3. Shopper opens PWA, taps Scan (or scans directly with camera app → opens PWA)
4. App detects vendor ID from URL
5. Modal: "You're at [Vendor Name]. Shopping for a recipe?"
   - If shopper has an active shopping list → auto-populated
   - Otherwise → browse/select a recipe
6. Checkboxes for each matching ingredient → confirm
7. `scan_log` record created, pantry updated (if authenticated), budget total updates

---

## 12. Quality & States to Cover

### Per Screen

| Screen | Loading | Empty | Error | Edge Cases |
|---|---|---|---|---|
| Home | Skeleton cards | "Welcome! The market opens Saturday at 8am" (pre-market) | Seasonal data unavailable → fallback to static seasonal defaults | Offline: cached seasonal data |
| Recipes | Skeleton card grid | "No recipes match these filters" with clear CTA | Network error → "Pull to retry" | 0 community recipes → show curated only |
| Recipe Detail | Skeleton content | N/A | Recipe not found → 404 state | Missing vendor match for ingredient → "Check with vendors directly" |
| Shopping Mode | Loading vendor matches | "No vendors currently list this ingredient" | Vendor data stale → "Last updated [time]" | Ingredient partially available → show matched + unmatched |
| Map | Floor plan placeholder | "Map not yet available for this market" | Image load failed → fallback vendor list | Tap outside stall area → no-op |
| QR Scan | Camera permission prompt | "Point camera at vendor QR code" | Camera denied → manual vendor code entry | Low light → torch toggle, stale scan → debounce |
| Account | N/A (only shown when logged in) | "Start shopping to build your pantry!" | N/A | Phone number already registered → login instead |

### Responsive Behavior

- Primary target: mobile (375–428px width). Desktop is a secondary view.
- Bottom nav bar: Home, Recipes, Map, Scan, Account (5 tabs)
- Cards: single column mobile, 2-column tablet, 3-column desktop
- Map: full-width on mobile, side panel on desktop
- QR scanner: full viewport on mobile

### Accessibility

- All interactive elements keyboard-reachable
- Color contrast meets WCAG AA
- QR scan has manual vendor-code fallback (for screen reader users)
- Recipe ingredient quantities use clear units, not icon-only

---

## 13. Implementation Phasing

### Phase 1 — MVP (Single Market Pilot)
- Market admin dashboard: stall/map manager, vendor roster, recipe manager
- Shopper PWA: home, recipes, recipe detail, shopping mode (vendor match), static map
- PocketBase schema + auth (guest + SMS)
- 20–30 curated recipes seeded
- Foodland Ontario seasonal data integration
- QR generation (per vendor, printable by admin)

### Phase 2 — QR + Pantry
- QR scan flow (browser camera → scan → check-off → pantry)
- Pantry tracking for authenticated shoppers
- Budget tracker + spending history
- Post-market analytics reports (admin + vendor)

### Phase 3 — Community + Vendor Dashboard
- Community recipe submission + admin approval workflow
- Vendor opt-in dashboard (live feed, profile, analytics)
- Vendor product-recipe matching engine
- Favorites (recipes + vendors)

### Phase 4 — Multi-Market + Advanced
- Multi-market support (admin creates new market, all scoping already in place)
- GPS-backed map option (for outdoor markets)
- Advanced analytics (seasonal trends, cross-market comparisons)
- Native app wrap (Capacitor or React Native)

---

## 14. Open Questions / Future Decisions

- **SMS provider:** Twilio vs. Canadian alternative for better pricing? PocketBase SMS auth plugin compatibility.
- **PocketBase hosting:** Self-hosted on a VPS, or PocketBase cloud (pocketbase.io)?
- **Floor plan tool:** Build a simple click-to-place-marker UI in the admin panel, or use a pre-built image annotation library?
- **Vendor product data:** Who populates this initially — admin manually, or vendor self-service from day one?
- **Market name:** "Market Table" is a working title. Final naming TBD.

---

## 15. References

- [Foodland Ontario Availability Guide](https://www.ontario.ca/foodland/page/availability-guide)
- [Ontario Data Catalogue — Seasonal Availability API](https://data.ontario.ca/en/api/1/util/snippet/api_info.html?resource_id=f85f9d64-116d-4169-b887-665cf804d113)
- [Foodland Ontario Recipes Portal](https://www.ontario.ca/foodland/recipes)
- [Open Government Licence – Ontario](https://www.ontario.ca/page/open-government-licence-ontario)
- [PocketBase Documentation](https://pocketbase.io/docs/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
