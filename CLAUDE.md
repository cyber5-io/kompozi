# Kompozi

Kompozi is a section-based CMS built on Kompozi Framework (Next.js fork) and Kompozi Engine (PayloadCMS fork). It powers websites through composable, themed sections managed via an admin panel.

## Architecture

- **Language:** TypeScript
- **Framework:** Kompozi Framework (Next.js fork) + Kompozi Engine (PayloadCMS fork)
- **Database:** PostgreSQL 16 (schema managed by PayloadCMS `push:true`)
- **Styling:** Tailwind CSS v4 (`@theme` block, NOT CSS modules)
- **Local dev:** tainer (Kompozi project type)
- **Jira project:** KOMP
- **Package manager:** yarn (run inside containers via `tainer yarn`)

## Ecosystem

Kompozi consists of three repos:

| Repo | What | Path |
|---|---|---|
| **kompozi** (this) | Main app — sections, themes, collections, pages | `/Users/lenineto/dev/cyber5-io/kompozi` |
| **kompozi-engine** | PayloadCMS fork — admin panel, API, database layer | `/Users/lenineto/dev/cyber5-io/kompozi-engine` |
| **kompozi-framework** | Next.js fork — rendering, routing, build system | `/Users/lenineto/dev/cyber5-io/kompozi-framework` |

This repo is a **consumer** of the engine and framework. It defines sections, themes, collections, and pages. The engine and framework are dependencies installed via yarn.

## Project Structure

```
kompozi/
├── tainer.yaml              # Tainer project config
├── html/                    # App source (mounted into container at /var/www/html)
│   ├── package.json
│   ├── payload.config.ts    # PayloadCMS config (collections, plugins, DB)
│   ├── next.config.mjs
│   ├── site.config.ts       # Site-level config (name, domain)
│   ├── tsconfig.json
│   ├── src/
│   │   ├── core/
│   │   │   ├── sections/    # Section definitions (block.ts + Component.tsx)
│   │   │   └── theme/       # Theme engine (ThemeProvider, loader, types)
│   │   ├── collections/     # PayloadCMS collections (Users, Media, Pages)
│   │   ├── themes/          # Theme configs and global CSS
│   │   ├── app/
│   │   │   ├── (frontend)/  # Public-facing pages (catch-all slug routing)
│   │   │   └── (payload)/   # Admin panel and API routes
│   │   └── components/      # Shared UI components
│   └── docs/                # Implementation plans and design docs
├── data/                    # Persistent runtime data (gitignored contents)
└── db/                      # PostgreSQL data (gitignored contents)
```

## Section System

Every section follows the same pattern: a **block definition** (`block.ts`) that declares the CMS fields, and a **React component** (`Component.tsx`) that renders the data.

### Creating a new section

1. Create a folder: `src/core/sections/MySection/`
2. Create `block.ts` — PayloadCMS Block definition:

```typescript
import type { Block } from 'payload'

export const MySectionBlock: Block = {
  slug: 'mySection',
  labels: { singular: 'My Section', plural: 'My Sections' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText' },
  ],
}
```

3. Create `Component.tsx` — React component:

```typescript
import type { SectionProps } from '../types'

export function MySection({ data, theme }: SectionProps) {
  const { title, content } = data
  return (
    <section data-section="mySection">
      <h2>{title}</h2>
      {/* render content */}
    </section>
  )
}
```

4. Register in `src/core/sections/index.ts`:

```typescript
import { MySectionBlock } from './MySection/block'
import { MySection } from './MySection/Component'

// Add to the sections record:
mySection: { block: MySectionBlock, Component: MySection },
```

### Section types (SectionProps)

```typescript
export type SectionProps = {
  data: Record<string, any>  // Block field values from CMS
  theme?: string             // Active theme name
}
```

### Section rendering

`RenderSections` iterates over a page's blocks array and renders the matching component:

```typescript
<RenderSections blocks={page.sections} theme={activeTheme} />
```

### Current sections

About, Clients, Contact, Content, CTA, Hero, Numbers, Services, Team, Testimonials

## Theme Engine

Themes control colors, fonts, and optional per-section CSS overrides. They are defined as TypeScript config files.

### ThemeConfig type

```typescript
export type ThemeConfig = {
  name: string
  label: string
  colors: {
    primary: string      // Brand primary (buttons, links)
    secondary: string    // Secondary accent
    accent: string       // Highlights
    background: string   // Page background
    surface: string      // Card/section backgrounds
    foreground: string   // Primary text
    muted: string        // Secondary text
    border: string       // Borders, dividers
  }
  fonts: {
    heading: string      // Font stack for headings
    body: string         // Font stack for body text
  }
  sectionOverrides?: Record<string, string>  // Per-section CSS classes
}
```

### Creating a theme

1. Create `src/themes/mytheme/theme.config.ts`:

```typescript
import type { ThemeConfig } from '@/core/theme/types'

const myTheme: ThemeConfig = {
  name: 'mytheme',
  label: 'My Theme',
  colors: { primary: '#2563eb', /* ... */ },
  fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
}

export default myTheme
```

2. Create `src/themes/mytheme/globals.css` with Tailwind CSS v4 `@theme` block overrides

### Current themes

`starter` — default clean theme with blue primary

## Collections (PayloadCMS)

- **Pages** — main content, uses `sectionBlocks` as block field options. Slug-based routing.
- **Media** — file uploads
- **Users** — admin authentication

### Pages collection

Pages have a `sections` field (block type) that accepts any registered section. The frontend uses a catch-all `[...slug]/page.tsx` that loads the page by slug and renders its sections.

## Database

- PostgreSQL 16 with `push:true` (auto-migrates schema on dev start)
- **Warning**: removing fields with `push:true` can cause hangs (KOMP-25). Drop columns manually via psql if needed.
- DB credentials in `.env` (auto-generated by tainer)
- Access via: `tainer exec tainer-kompozi-db-ct psql -U tainer -d tainer`

## Tailwind CSS v4

- Uses `@theme` block in `globals.css` for CSS variables (NOT `tailwind.config.js`)
- Dynamic class names don't work — use style attributes for dynamic values
- Custom animations defined in `@theme` block

## Development Workflow

```bash
tainer start                    # Start the project
tainer yarn install             # Install dependencies
tainer yarn add <package>       # Add a dependency
tainer node dev                 # Switch to dev mode (next dev)
tainer node prod                # Build + switch to prod mode
tainer db export                # Export database dump
tainer db import                # Import database dump
```

Admin panel: `https://kompozi.tainer.me/admin`
Default login: `tainer@tainer.me` / `tainer`

## Coding Standards

- Use Tailwind CSS v4 (not CSS modules)
- Follow the section pattern: `block.ts` + `Component.tsx` per section
- All sections must be registered in `src/core/sections/index.ts`
- `data-section="sectionName"` attribute on the outermost element of each section
- All yarn/npm commands must run inside containers (not locally)
- No Co-Authored-By or AI mentions in commits
