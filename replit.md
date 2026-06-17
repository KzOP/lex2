# LexBridge Saudi

منصة سعودية تعليمية للتوعية القانونية تُبسّط الأنظمة واللوائح السعودية للأفراد ورواد الأعمال والطلاب.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/lexbridge run dev` — run the frontend (port 25261)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `GROQ_API_KEY` — Groq API key for Llama 3.3 70B AI assistant

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS, wouter routing, RTL Arabic (IBM Plex Arabic)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: Groq SDK (Llama 3.3 70B) for legal awareness assistant
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle schema (systems, articles, legalTerms, faq, quiz)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/lexbridge/src/` — React frontend (pages/, components/)

## Architecture decisions

- Arabic-first RTL layout with IBM Plex Arabic font
- Black (#0a0a0a) + White + Gold (#c9a84c) brand palette
- AI assistant uses system prompt enforcing awareness-only responses with disclaimer
- No user authentication required (public platform + admin panel without login)
- Quiz correctIndex hidden from frontend until after submission

## Product

- **الرئيسية**: Hero, system cards, platform stats, featured articles
- **الأنظمة**: All 4 legal systems (سوق المال، الشركات، Fintech، PDPL)
- **تفاصيل النظام**: Tabbed view — definition, objectives, obligations, violations, penalties, tips
- **مقارنة الأنظمة**: Side-by-side system comparison
- **المساعد الذكي**: AI chat with Llama 3.3 70B (awareness-only, Arabic)
- **قاموس المصطلحات**: Searchable legal dictionary with alphabetical filter
- **الأسئلة الشائعة**: Accordion FAQ
- **اختبار المعرفة**: Legal knowledge quiz with scoring
- **لوحة الإدارة**: Admin CRUD for systems, articles, terms, FAQ

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any schema change in `lib/db/src/schema/`, run `pnpm run typecheck:libs` before typechecking artifact packages — stale lib declarations cause false TS2305 errors.
- The `AiChatResponse` schema name was renamed to `AiReply` to avoid TS2308 Orval collision.
- groq-sdk is installed in `@workspace/api-server` dependencies.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
