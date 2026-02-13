# Project Context

## Stack
- **Frontend:** SvelteKit 2 + Svelte 5 (runes), TailwindCSS 4, TypeScript
- **Backend:** Payload CMS 3.x on Next.js 15, PostgreSQL/SQLite
- **Libraries:** jsbarcode, qrious (QR), jszip (export)

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
