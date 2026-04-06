# Kompozi

Kompozi is a section-based CMS built on Kompozi Framework (Next.js fork) and Kompozi Engine (PayloadCMS fork).

## Architecture

- **Language:** TypeScript
- **Framework:** Kompozi Framework (Next.js fork) + Kompozi Engine (PayloadCMS fork)
- **Database:** PostgreSQL 16
- **Styling:** Tailwind CSS v4
- **Local dev:** tainer (Kompozi project type)
- **Jira project:** KOMP (Epic: CMS)
- **Package manager:** yarn (run inside containers via `tainer yarn`)

## Project Structure

- `tainer.yaml` — Tainer project config
- `html/` — App source (mounted into container)
  - `src/core/sections/` — Section definitions and components
  - `src/core/theme/` — Theme engine (CSS variables + dynamic loading)
  - `src/collections/` — PayloadCMS collections (Users, Media, Pages)
  - `src/themes/` — Theme configs and styles
  - `src/app/(frontend)/` — Public-facing pages
  - `src/app/(payload)/` — Admin panel and API routes
- `data/` — Persistent runtime data (gitignored)
- `db/` — PostgreSQL data (gitignored)

## Coding Standards

- Use Tailwind CSS v4 (not CSS modules)
- Follow the section pattern: `block.ts` + `Component.tsx` per section
- All yarn/npm commands must run inside containers (not locally)
- No Co-Authored-By or AI mentions in commits
