# Market Table

Recipe-driven farmer's market shopping PWA. Browse seasonal recipes, find local vendors, navigate the market map, and track your budget — all in one trip.

Built for Ontario farmers' markets, powered by [Foodland Ontario](https://www.ontario.ca/foodland) seasonal data.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Lucide React icons
- **Auth & Data:** [PocketBase](https://pocketbase.io/) (configured via `VITE_POCKETBASE_URL`)
- **Hosting:** Netlify static hosting + Netlify Functions

## Getting Started

### Prerequisites

- Node.js 20+
- PocketBase instance running (local or hosted)
- (For SMS auth) Twilio account

### Setup

```bash
# 1. Clone and install
cd market-table
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set VITE_POCKETBASE_URL to your PocketBase instance

# 3. Start PocketBase
./pocketbase serve
# PocketBase runs on http://127.0.0.1:8090 by default

# 4. Start dev server
npm run dev
# Opens at http://localhost:3000
```

### PocketBase Setup

1. Create collections matching the schema in `pocketbase/pb_schema.json`
2. Import seed data or use the admin UI to add recipes, vendors, and stalls
3. Enable SMS auth by configuring the `sms-auth` Netlify function

### Netlify Functions (for production)

```bash
# Test functions locally
npx netlify-cli dev

# Deploy
npx netlify-cli deploy --prod
```

Set environment variables in Netlify dashboard:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

## Project Structure

```
market-table/
├── index.html              # Entry HTML with PWA meta tags
├── public/
│   ├── manifest.json       # PWA manifest
│   └── icons/              # App icons (192px, 512px)
├── netlify/
│   └── functions/          # Serverless functions
│       ├── sms-auth/       # SMS login (Twilio)
│       ├── sync-seasonal-data/  # CKAN → PocketBase sync (weekly)
│       └── generate-analytics/  # Daily analytics aggregation
├── src/
│   ├── main.tsx            # React entry
│   ├── App.tsx             # Router setup
│   ├── index.css           # Tailwind + custom styles
│   ├── lib/
│   │   ├── types.ts        # Domain types
│   │   └── pocketbase.ts   # PocketBase client + helpers
│   ├── hooks/
│   │   ├── useAuth.ts      # SMS auth hook
│   │   └── useShoppingList.ts  # Shopping list state
│   ├── data/
│   │   ├── seasonal.ts     # Seasonal seed data + helpers
│   │   └── recipes.ts      # Curated recipe seed data
│   ├── components/
│   │   ├── layout/         # BottomNav, Layout
│   │   ├── home/           # WhatsFresh, VendorSpotlight
│   │   ├── recipes/        # RecipeCard, RecipeGrid, RecipeFilters
│   │   ├── map/            # MarketMap
│   │   ├── scan/           # QRScanner
│   │   ├── shopping/       # ShoppingList, BudgetTracker
│   │   ├── auth/           # SMSLogin
│   │   └── ui/             # Skeleton, EmptyState, ErrorState, Badge
│   └── pages/
│       ├── HomePage.tsx
│       ├── RecipesPage.tsx
│       ├── RecipeDetailPage.tsx
│       ├── MapPage.tsx
│       ├── ScanPage.tsx
│       └── AccountPage.tsx
├── pocketbase/
│   └── pb_schema.json      # PocketBase collection schema
└── package.json
```

## Modifying the App

### Change recipes
Edit `src/data/recipes.ts` — add, remove, or modify the `CURATED_RECIPES` array. In production, recipes are managed via the PocketBase admin UI.

### Change seasonal data
Edit `src/data/seasonal.ts` — the `SEASONAL_SEED` array is the fallback. Production data comes from the weekly CKAN API sync.

### Change colors / branding
Edit `tailwind.config.js` — the `market` and `earth` color palettes define the app's visual identity.

### Change the map
Replace the floor plan image URL in PocketBase (`markets.floor_plan_url`). Stall coordinates are managed in the admin dashboard.

### Add a new page
1. Create the page component in `src/pages/`
2. Add a route in `src/App.tsx`
3. (Optional) Add a nav item in `src/components/layout/BottomNav.tsx`

## State Coverage

| Screen | Loading | Empty | Error | Edge Cases |
|---|---|---|---|---|
| Home | N/A (seed data) | N/A | Seasonal data fallback | Offline: cached static data |
| Recipes | Card skeletons | "No recipes match filters" | Error banner + retry | 0 community recipes → curated only |
| Recipe Detail | N/A (seed data) | 404 state | 404 state | Missing vendor match → "Check with vendors" |
| Map | Floor plan placeholder | "Map coming soon" | Image load failed → vendor list fallback | Tap outside stall → no-op |
| Scan | Camera prompt | "Point camera at QR" | Camera denied → manual code entry | Rapid re-scan → debounced |
| Account | N/A | Login prompt with feature preview | N/A | Already registered → login instead |

## Responsive Design

- Primary target: mobile (375–428px), max-width container at 512px
- Bottom navigation bar with 5 tabs
- Single-column card layout on mobile, 2-column on tablet+
- QR scanner: full viewport on all sizes
- Safe-area insets for notched phones (PWA standalone mode)

## Accessibility

- All interactive elements are keyboard-focusable
- QR scan has a manual stall-code entry fallback
- Color contrast meets WCAG AA via Tailwind's built-in palette
- Screen reader labels on all icon-only buttons

## License & Attribution

Seasonal produce data from the [Ontario Data Catalogue](https://data.ontario.ca/), used under the [Open Government Licence – Ontario](https://www.ontario.ca/page/open-government-licence-ontario).

Recipe links point to [Foodland Ontario](https://www.ontario.ca/foodland/recipes). The Foodland Ontario logo is not used in this application per their trademark guidelines.
