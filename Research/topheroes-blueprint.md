# Top Heroes Interactive Guide - Architecture Blueprint (v2)

> Fan-made guide site. Not affiliated with or endorsed by the game's publisher. Game names and art belong to their owners; include this disclaimer in the site footer.

## 1. Product Goals
1. **Roster-driven recommendations:** the user marks the heroes they own and the site returns the best lineups, builds, and gear they can field right now (and what they are "one hero away" from).
2. **Interactive, not a static wiki:** filters, calculators, and tools that respond instantly.
3. **Visually distinctive:** game-aligned color, art-forward cards, motion. Avoid a plain black-and-white wiki look.
4. **Discoverable:** every hero and guide is its own crawlable, shareable page.
5. **Trustworthy:** every build and lineup shows the patch it was verified for.

## 2. Tech Stack
| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro + React islands** (alternative: Vite + React + React Router) | Guide pages render as real HTML for search engines; React is used only for interactive pieces (roster picker, filters, calculators). |
| Language | TypeScript | Safer data models for heroes, lineups, and scoring. |
| Styling | Tailwind CSS + shadcn/ui | Fast to build a custom look, accessible components. |
| Motion | Framer Motion | Card flips, glow, transitions. |
| Data (launch) | **JSON/YAML files in the Git repo** | Content is curated and changes a few times a month. Versioned, free, no backend to maintain. |
| Data (later) | Supabase (PostgreSQL + Auth + RLS) | Add when you want accounts, saved rosters, community votes, or submissions. |
| State | URL params + `localStorage` | Roster persists locally and can be shared via link; no login needed. |
| Hosting | DreamHost (static build) | `npm run build` outputs static files; upload `dist/` via FileZilla. |

### Hosting notes (DreamHost / Apache)
- Astro outputs one HTML file per page, so deep links work out of the box.
- If you choose Vite + React Router instead, add an `.htaccess` rewrite so deep links don't 404:
  ```
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
  ```
- If/when Supabase is added, the anon key is public by design. Security comes from **row-level security (RLS) policies**; never put the service-role key in frontend code.

## 3. Information Architecture (Sitemap)
- **Home / Dashboard:** active and upcoming events, meta snapshot (top lineups), "Build my roster" call to action, patch/last-updated badge.
- **My Roster:** the hub of the site. Pick owned heroes (and optionally stars/level), see recommended lineups, builds, and gear. Shareable URL.
- **Heroes (database):** filterable grid (faction, rarity, role). Individual hero pages: stats, skills, builds per game mode, gear, best teammates.
- **Lineups & Builds:** PvE/PvP tier lists, queue compositions, interactive team builder.
- **Events Calendar:** weekly/monthly rotations, prep guides, local-time display.
- **Strategy & Guilds:** game mechanics, guild admin guides, server-vs-server tactics.
- **About / Changelog:** patch notes for the site's data, fan-site disclaimer, credits.

## 4. Data Model
Designed so it works as JSON files now and maps cleanly to Postgres tables later.

### Core content
- `heroes`: id, name, faction_id, role, rarity, base_stats, art_url
- `factions`: id, name, color
- `faction_bonuses`: id, faction_id, required_count, effect_description
- `skills`: id, hero_id (FK), name, description, cooldown, multipliers
- `gear`: id, name, slot, rarity, stats
- `artifacts`: id, name, effect, rarity

### Builds and lineups
- `builds`: id, hero_id (FK), **game_mode**, stat_priorities, patch_version, last_verified
- `build_gear`: build_id, gear_id, priority
- `build_artifacts`: build_id, artifact_id, priority
- `lineups`: id, name, game_mode, effectiveness_rating (tier), patch_version, last_verified, notes
- `lineup_heroes` (replaces the old `HeroIDs` array): lineup_id, hero_id, slot, is_core (bool), substitute_for (nullable hero_id)

### Events
- `events`: id, name, recurrence_rule (e.g. weekly Monday), start/end overrides, resources_required, rewards, timezone_basis (server time vs UTC)

### User data (stored locally at launch)
- `user_roster`: hero_id, owned, stars, level, owned_gear_ids
- Later in Supabase: `profiles`, `saved_rosters`, `lineup_votes`, all protected by RLS.

## 5. Recommendation Engine (rules-based, no AI)
1. For each lineup, count how many **core** slots the user can fill, allowing listed substitutes.
2. Score = weighted sum: core coverage, substitute penalty, hero stars/level, lineup tier.
3. Output groups: **Ready now**, **One hero away** (name the missing hero), **Long-term goal**.
4. For each owned hero, show the highest-ranked build for the selected game mode and which gear the user already owns vs. still needs.
5. Keep scoring weights in a config file so they are easy to tune when the meta shifts.

## 6. Core Interactive Features
- **Roster picker** with instant filtering (faction, rarity, role); selection saved to `localStorage` and encoded in a shareable URL.
- **Recommended lineups and builds** driven by the engine above.
- **Advanced filtering and sorting** with no page reloads.
- **Lineup synergy checker** (drag-and-drop grid) that calculates faction bonuses. *Verify slot count and bonus thresholds against the actual game before building.*
- **Resource calculators** for upgrade milestones.
- **Visual skill trees** with tooltips for damage multipliers.
- **Event countdowns** in the visitor's local time.

## 7. Visual Design Direction
- Mobile-first (most players are on phones); dark base but **not monochrome**.
- Rarity-colored hero cards: Mythic red/gold, Epic purple, with glow and gradient borders.
- Faction-themed pages and accents using each faction's color.
- Hero art as the visual centerpiece; subtle animated backgrounds.
- Motion with purpose: card flips on hover/tap, smooth filter transitions, progress animations in the roster picker.
- Accessibility: don't rely on color alone (add rarity/faction icons), keep contrast readable.

## 8. Content and Data Freshness
- Every build and lineup carries `patch_version` and `last_verified`, displayed on the page ("Verified for patch X").
- Keep a simple spreadsheet or JSON workflow for updating data; commit each update to Git so there's a history.
- Show a site-wide "Last updated" badge on the dashboard.

## 9. Phased Roadmap
1. **MVP:** hero grid, hero pages, roster picker, recommended lineups/builds, shareable roster URL.
2. **Phase 2:** events calendar, strategy/guild guide pages, changelog.
3. **Phase 3:** synergy checker, resource calculators.
4. **Phase 4:** visual skill trees, Supabase accounts, saved rosters, community voting.

## 10. Open Questions to Confirm
- Exact lineup slot count and faction-bonus rules in the current game version.
- Where hero/skill/gear data will come from and how it will be entered (manual, spreadsheet import, community).
- Whether Astro or plain Vite + React fits your comfort level better (Astro is better for search traffic; Vite is simpler if you only want a tool-style app).
