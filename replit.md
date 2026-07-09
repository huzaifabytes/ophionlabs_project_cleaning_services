# CleanPro

A premium, conversion-focused cleaning services website with a full admin panel. Includes a public-facing homepage with hero carousel, services with before/after sliders, customer reviews, contact form, and an about/team section. The admin panel supports complete CRUD for all content sections without writing code.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/cleaning-site run dev` — run the frontend (port 22467)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — express-session secret

## Admin Access

- URL: `/admin/login`
- Default credentials: `admin` / `admin123`
- Change via `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, wouter
- API: Express 5 with express-session (cookie auth)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- File uploads: Multer → stored in `artifacts/api-server/public/uploads/`

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle schema (settings, slides, services, reviews, contacts, team, about)
- `artifacts/api-server/src/routes/` — Express route handlers (one file per entity)
- `artifacts/cleaning-site/src/pages/` — React pages (Home.tsx, admin/*)
- `artifacts/cleaning-site/src/components/` — Custom components (HeroCarousel, BeforeAfterSlider, StarRating, FileUpload)
- `artifacts/api-server/public/uploads/` — Uploaded/generated images

## Architecture decisions

- Session-based auth (express-session) rather than JWT — simpler for single-admin use case
- Admin credentials from env vars (not DB) to avoid chicken-and-egg provisioning problem
- All API routes follow OpenAPI spec (codegen via Orval) for type safety across frontend/backend
- `GET /reviews?all=1` restricted to authenticated admins (checked server-side, not just frontend)
- File uploads stored locally in API server's `public/uploads/` directory, served as static files at `/api/uploads/*`
- Settings and About use singleton pattern (auto-create row on first GET)

## Product

- **Public website**: Sticky navbar, hero carousel with real images, services grid with before/after drag sliders, customer review cards + submission form, premium contact form with Google Sheets integration, about section with team cards, footer
- **Admin panel** (`/admin/*`): Dashboard, Carousel, Services, Reviews, Contact submissions, Team, About, Settings, Google Sheets config, Navigation, Footer management

## Google Sheets Integration

Set the Google Apps Script URL in Admin → Google Sheets Settings. When a contact form is submitted, the server POSTs to that URL automatically. No code changes needed.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Images uploaded via admin are stored in `artifacts/api-server/public/uploads/` — this directory is NOT in the cleaning-site artifact dir
- After changing `lib/db/src/schema/`, always run `pnpm --filter @workspace/db run push`
- After changing `lib/api-spec/openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen`
- The API server must be rebuilt (`pnpm --filter @workspace/api-server run build`) after backend code changes before restarting
- Overlay opacity in slides is stored as 0–100 (percent) and divided by 100 client-side in HeroCarousel
