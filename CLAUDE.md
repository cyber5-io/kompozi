# Kompozi

Kompozi is a section-based CMS built on Kompozi Framework (Next.js fork) and Kompozi Engine (PayloadCMS fork).

## Architecture

- **Language:** TypeScript
- **Framework:** Kompozi Framework (Next.js fork) + Kompozi Engine (PayloadCMS fork)
- **Database:** PostgreSQL 16
- **Styling:** Tailwind CSS v4
- **Jira project:** KOMP (Epic: CMS)
- **Package manager:** yarn

## Key Directories

- `src/core/sections/` — Section definitions and components
- `src/core/theme/` — Theme engine (CSS variables + dynamic loading)
- `src/collections/` — PayloadCMS collections (Users, Media, Pages)
- `src/themes/` — Theme configs and styles
- `src/app/(frontend)/` — Public-facing pages
- `src/app/(payload)/` — Admin panel and API routes

## Coding Standards

- Use Tailwind CSS v4 (not CSS modules)
- Follow the section pattern: `block.ts` + `Component.tsx` per section
- All yarn/npm commands must run inside containers (not locally)
- No Co-Authored-By or AI mentions in commits
