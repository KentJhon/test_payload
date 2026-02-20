# Project Context

## Stack
- **Frontend:** SvelteKit 2 + Svelte 5 (runes), TailwindCSS 4, TypeScript
- **Backend:** Payload CMS 3.x on Next.js 15, PostgreSQL (Neon)
- **WebSocket Server:** Bun runtime (`ws-server/ws-server.ts`)
- **Libraries:** jsbarcode, qrious (QR), jszip (export)

## Deployment

### Frontend (SvelteKit) — Vercel
- URL: `https://test-website-hazel-alpha.vercel.app`
- Env vars:
  - `VITE_PAYLOAD_URL` — Payload CMS URL
  - `VITE_PUBLIC_WS_URL` — WebSocket server URL (`wss://test-website-op4h.onrender.com/ws`)
  - `VITE_TURN_USERNAME` — Metered TURN credential username
  - `VITE_TURN_CREDENTIAL` — Metered TURN credential password

### Backend (Payload CMS) — Vercel
- URL: `https://test-website-6gzx.vercel.app`
- Database: Neon PostgreSQL
- Env vars: `DATABASE_URL`, `PAYLOAD_SECRET`

### WebSocket Server (Bun) — Render
- URL: `https://test-website-op4h.onrender.com`
- Source: `ws-server/` folder with its own `Dockerfile`
- Handles: dev-chat (`/ws`) and snake-game (`/ws/snake`)
- Env vars: `PAYLOAD_URL` (points to Payload backend for saving chat messages)
- Free tier: spins down after 15min inactivity, ~30s cold start

### TURN Server — Metered.ca
- App: `veentix.metered.live`
- Used for WebRTC calls in dev-chat (relays audio when direct P2P fails)
- Free plan: 500MB/month
- Credentials stored in Vercel env vars (`VITE_TURN_USERNAME`, `VITE_TURN_CREDENTIAL`)

### Key Env Var Notes
- Vite only exposes env vars prefixed with `VITE_` to the browser
- WebSocket stores read `VITE_PUBLIC_WS_URL` (in `chat-ws.svelte.ts`, `snake-ws.svelte.ts`)
- WebRTC config reads `VITE_TURN_USERNAME` + `VITE_TURN_CREDENTIAL` (in `call.svelte.ts`)

## In Progress — TURN Server for WebRTC Calls
- TURN credentials added to `call.svelte.ts` with hardcoded fallback
- **Still failing** when friend initiates call — needs debugging:
  1. Test credentials on Metered "Turn Server Testing tool"
  2. If credentials work, check if Vercel env vars are in the build
  3. If still fails, may be a signaling timing issue
- Once fixed, remove hardcoded credentials from `call.svelte.ts`

## Ticket Generator - Save Progress Feature (Planned)

### Current State
- Page: `frontend/src/routes/ticket-generator/+page.svelte`
- Main component: `frontend/src/lib/components/ticket/TicketGenerator.svelte`
- All state lives in Svelte stores (`frontend/src/lib/stores/`): canvas, csv, elements, labels, ticket-settings, history, selection, templates
- Manual `.veenttix` JSON file export/import exists in `ProjectActions.svelte`
- Template save to Payload CMS exists in `templates.svelte.ts` (uploads bg image to media, saves settings + elements)
- **No auto-save or session persistence** — refreshing the page loses everything

### Decision: Template-Name-Only Approach (No Auth)
- No login/register required
- Template name is the unique key for all saved progress
- Anyone using the app can see/load/overwrite templates (fine for single user / small team)
- Auth can be added later via Payload's built-in user system if needed

### Plan

**Phase 1: `beforeunload` warning for unsaved changes** (Small)
- Track dirty state across stores
- Warn user on page navigation/refresh if there are unsaved changes

**Phase 2: IndexedDB auto-save + restore on load** (Medium)
- Create auto-save service (`lib/stores/autosave.svelte.ts`)
- Use `$effect` to watch all stores, debounce writes (2s) to IndexedDB
- Store background image as Blob in IndexedDB (avoids localStorage size limits)
- On page load, check IndexedDB for saved state and prompt "Resume previous session?" (Restore / Discard)

**Phase 3: Extend Payload CMS for full project saves** (Medium-Large)
- Extend `ticket-templates` collection (or create `saved-projects`) to persist full project state:
  - CSV data + headers
  - Background image (already supported via media upload)
  - All canvas elements
  - Ticket settings (type, dimensions, fit mode)
  - Label config (column, colors, block widths)
  - Print settings (ticket gap)
- Add "Save to Cloud" / "My Projects" UI in sidebar
- Dirty-state indicator showing unsaved changes and last-saved time
- Saving to an existing template name overwrites it

### Hybrid Approach (Recommended)
- **IndexedDB** for seamless crash/refresh recovery (auto, client-side)
- **Payload CMS** for named project persistence (manual, server-side)
- **Keep `.veenttix` export** as offline backup/sharing option

### Key Files Reference
- Stores: `frontend/src/lib/stores/*.svelte.ts`
- Components: `frontend/src/lib/components/ticket/`
- API: `frontend/src/lib/api/templates.ts`
- Types: `frontend/src/lib/types/ticket.ts` (ProjectData, TicketElement, etc.)
- Backend collection: `test-payload/src/collections/TicketTemplate.ts`
- Utils: `frontend/src/lib/utils/` (csv-parser, canvas-render, png-export, etc.)
