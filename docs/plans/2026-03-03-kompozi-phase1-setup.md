# Kompozi Phase 1: Project Setup & Core Architecture

**Goal:** Set up the Kompozi CMS repo from scratch with Next.js + PayloadCMS + Docker + PostgreSQL, and build the core section system + theme engine that everything else builds on.

**Architecture:** PayloadCMS 3.78 embedded in Next.js 15.5 app. Pages collection with a `layout` blocks field. Sections are the building blocks — each is a PayloadCMS block definition + React component + CSS module. A theme engine loads CSS variables and optional section style overrides from a theme directory. The starter theme provides a clean default look.

**Tech Stack:** Next.js 15.5.12, PayloadCMS 3.78.0, React 19, TypeScript 5.7, PostgreSQL 16, Docker, Caddy, yarn

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `.env`

**Step 1: Initialize yarn project and install dependencies**

```bash
cd /Users/lenineto/ddev/cyber5/cyber5.io/kompozi
yarn init -y
yarn add next@15.5.12 react@19.0.1 react-dom@19.0.1 payload@3.78.0 \
  @payloadcms/db-postgres@3.78.0 @payloadcms/next@3.78.0 \
  @payloadcms/richtext-lexical@3.78.0 @payloadcms/ui@3.78.0 \
  graphql sharp
yarn add -D typescript@5.7.0 @types/node @types/react @types/react-dom
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./payload.config.ts"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create next.config.mjs**

```javascript
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@payloadcms/ui',
    '@payloadcms/next',
    '@payloadcms/richtext-lexical',
  ],
}

export default withPayload(nextConfig)
```

**Step 4: Create .gitignore**

```
node_modules/
.next/
.env
*.tsbuildinfo
next-env.d.ts
payload-types.ts
```

**Step 5: Create .env.example and .env**

`.env.example`:
```
POSTGRES_USER=payload
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=kompozi
PAYLOAD_SECRET=your_payload_secret_minimum_32_characters
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
DATABASE_URI=postgresql://payload:your_secure_password_here@localhost:5432/kompozi
```

`.env` (dev values):
```
POSTGRES_USER=payload
POSTGRES_PASSWORD=kompozi_dev_password_2026
POSTGRES_DB=kompozi
PAYLOAD_SECRET=kompozi_dev_secret_change_in_production_abcdef1234567890
NEXT_PUBLIC_SERVER_URL=https://kompozi.local
DATABASE_URI=postgresql://payload:kompozi_dev_password_2026@kompozi-postgres:5432/kompozi
```

**Step 6: Verify project builds (dry run)**

Run: `cd /Users/lenineto/ddev/cyber5/cyber5.io/kompozi && yarn tsc --noEmit`
Expected: May fail (no source files yet) — that's fine, just verifying TS is installed.

**Step 7: Commit**

```bash
git add package.json yarn.lock tsconfig.json next.config.mjs .gitignore .env.example
git commit -m "feat: initialize project with Next.js 15.5, PayloadCMS 3.78, TypeScript"
```

---

## Task 2: Docker Infrastructure

**Files:**
- Create: `docker-compose.yml`
- Create: `Dockerfile`
- Create: `Caddyfile`

**Step 1: Create docker-compose.yml**

```yaml
services:
  kompozi-caddy:
    image: caddy:2-alpine
    container_name: kompozi-caddy
    restart: unless-stopped
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      kompozi-network:
        ipv4_address: 172.22.0.10
    depends_on:
      - kompozi-app

  kompozi-postgres:
    image: postgres:16-alpine
    container_name: kompozi-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-payload}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-kompozi}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-payload} -d ${POSTGRES_DB:-kompozi}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      kompozi-network:
        ipv4_address: 172.22.0.20

  kompozi-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: kompozi-app
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_URI: postgresql://${POSTGRES_USER:-payload}:${POSTGRES_PASSWORD}@kompozi-postgres:5432/${POSTGRES_DB:-kompozi}
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
      NEXT_PUBLIC_SERVER_URL: https://kompozi.local
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      kompozi-postgres:
        condition: service_healthy
    networks:
      kompozi-network:
        ipv4_address: 172.22.0.30

networks:
  kompozi-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.22.0.0/16

volumes:
  pgdata:
    driver: local
  caddy_data:
    driver: local
  caddy_config:
    driver: local
```

Note: Uses subnet 172.22.x.x (different from cyber5's 172.21.x.x) to avoid conflicts.

**Step 2: Create Dockerfile**

```dockerfile
FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
```

**Step 3: Create Caddyfile**

```
kompozi.local {
    reverse_proxy kompozi-app:3000
    tls internal
}
```

**Step 4: Commit**

```bash
git add docker-compose.yml Dockerfile Caddyfile
git commit -m "feat: add Docker infrastructure (PostgreSQL, Caddy, app)"
```

---

## Task 3: PayloadCMS Configuration & Core Collections

**Files:**
- Create: `payload.config.ts`
- Create: `src/collections/Users.ts`
- Create: `src/collections/Media.ts`
- Create: `src/collections/Pages.ts`

**Step 1: Create Users collection**

```typescript
// src/collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
}
```

**Step 2: Create Media collection**

```typescript
// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Alternative text for accessibility',
      },
    },
  ],
}
```

**Step 3: Create Pages collection (initially with empty blocks array — sections added in Task 6)**

```typescript
// src/collections/Pages.ts
import type { CollectionConfig } from 'payload'

const formatSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if ((operation === 'create' || operation === 'update') && !data.slug && data.title) {
          data.slug = formatSlug(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title if left empty',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    // layout blocks field added in Task 6 after sections are defined
    {
      name: 'layout',
      type: 'blocks',
      blocks: [], // populated after section blocks are created
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Meta Title' },
        { name: 'description', type: 'textarea', label: 'Meta Description' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Social Share Image' },
      ],
    },
  ],
}
```

**Step 4: Create payload.config.ts**

```typescript
// payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Kompozi',
    },
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: true,
  }),

  editor: lexicalEditor({}),

  sharp,

  collections: [Users, Media, Pages],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

**Step 5: Commit**

```bash
git add payload.config.ts src/collections/
git commit -m "feat: add PayloadCMS config with Users, Media, Pages collections"
```

---

## Task 4: Next.js App Router Shell

**Files:**
- Create: `src/app/(frontend)/layout.tsx`
- Create: `src/app/(frontend)/page.tsx`
- Create: `src/app/(frontend)/[...slug]/page.tsx`
- Create: `src/app/(payload)/admin/[[...segments]]/page.tsx`
- Create: `src/app/(payload)/admin/[[...segments]]/not-found.tsx`
- Create: `src/app/(payload)/api/[...slug]/route.ts`
- Create: `src/app/(payload)/layout.tsx`

**Step 1: Create PayloadCMS admin routes**

These are boilerplate required by PayloadCMS to serve the admin panel and API.

```typescript
// src/app/(payload)/admin/[[...segments]]/page.tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from './importMap'

type Args = { params: Promise<{ segments: string[] }>; searchParams: Promise<{ [key: string]: string | string[] }> }

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
```

```typescript
// src/app/(payload)/admin/[[...segments]]/not-found.tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'
import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from './importMap'

type Args = { params: Promise<{ segments: string[] }>; searchParams: Promise<{ [key: string]: string | string[] }> }

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
```

```typescript
// src/app/(payload)/api/[...slug]/route.ts
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
```

```typescript
// src/app/(payload)/layout.tsx
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/[[...segments]]/importMap'
import './custom.scss'

type Args = { children: React.ReactNode }

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
```

Note: The `importMap` file is auto-generated by PayloadCMS on first build. Create a placeholder:

```typescript
// src/app/(payload)/admin/[[...segments]]/importMap.ts
// This file is auto-generated by PayloadCMS during build
export const importMap = {}
```

```scss
// src/app/(payload)/custom.scss
// Custom admin styles (empty for now)
```

**Step 2: Create frontend layout**

```tsx
// src/app/(frontend)/layout.tsx
import React from 'react'

export const metadata = {
  title: 'Kompozi',
  description: 'Built with Kompozi',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Step 3: Create homepage**

```tsx
// src/app/(frontend)/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

async function getHomePage() {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
        status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })
    return pages.docs[0] || null
  } catch {
    return null
  }
}

export default async function HomePage() {
  const page = await getHomePage()

  if (!page) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Kompozi</h1>
        <p>No homepage found. Create a page with slug &quot;home&quot; in the admin panel.</p>
        <a href="/admin">Go to Admin</a>
      </main>
    )
  }

  return (
    <main>
      <h1>{page.title}</h1>
      {/* RenderSections will be added in Task 6 */}
    </main>
  )
}
```

**Step 4: Create dynamic slug route**

```tsx
// src/app/(frontend)/[...slug]/page.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

type Props = {
  params: Promise<{ slug: string[] }>
}

async function getPage(slug: string) {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })
  return pages.docs[0] || null
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const pageSlug = slug.join('/')
  const page = await getPage(pageSlug)

  if (!page) {
    notFound()
  }

  return (
    <main>
      <h1>{page.title}</h1>
      {/* RenderSections will be added in Task 6 */}
    </main>
  )
}
```

**Step 5: Commit**

```bash
git add src/app/
git commit -m "feat: add Next.js app router with frontend and payload admin routes"
```

---

## Task 5: Theme Engine

**Files:**
- Create: `src/core/theme/types.ts`
- Create: `src/core/theme/loader.ts`
- Create: `src/core/theme/ThemeProvider.tsx`
- Create: `src/themes/starter/theme.config.ts`
- Create: `src/themes/starter/globals.css`
- Create: `site.config.ts`

**Step 1: Define theme types**

```typescript
// src/core/theme/types.ts
export type ThemeConfig = {
  name: string
  label: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textMuted: string
    border: string
  }
  fonts: {
    heading: string
    body: string
  }
  // Optional CSS class overrides per section type
  sectionOverrides?: Record<string, string>
}
```

**Step 2: Create theme loader**

```typescript
// src/core/theme/loader.ts
import type { ThemeConfig } from './types'

let cachedTheme: ThemeConfig | null = null

export async function loadTheme(): Promise<ThemeConfig> {
  if (cachedTheme) return cachedTheme

  // Dynamic import based on site config
  const { default: siteConfig } = await import('@/../../site.config')
  const themeName = siteConfig.theme || 'starter'

  const { default: themeConfig } = await import(`@/themes/${themeName}/theme.config`)
  cachedTheme = themeConfig
  return themeConfig
}

export function themeToCSS(theme: ThemeConfig): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-muted: ${theme.colors.textMuted};
      --color-border: ${theme.colors.border};
      --font-heading: ${theme.fonts.heading};
      --font-body: ${theme.fonts.body};
    }
  `
}
```

**Step 3: Create ThemeProvider**

```tsx
// src/core/theme/ThemeProvider.tsx
import React from 'react'
import type { ThemeConfig } from './types'
import { themeToCSS } from './loader'

type Props = {
  theme: ThemeConfig
  children: React.ReactNode
}

export function ThemeProvider({ theme, children }: Props) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToCSS(theme) }} />
      <div data-theme={theme.name}>
        {children}
      </div>
    </>
  )
}
```

**Step 4: Create starter theme**

```typescript
// src/themes/starter/theme.config.ts
import type { ThemeConfig } from '@/core/theme/types'

const starterTheme: ThemeConfig = {
  name: 'starter',
  label: 'Starter',
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
  },
  fonts: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
}

export default starterTheme
```

```css
/* src/themes/starter/globals.css */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  line-height: 1.2;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

.section {
  padding: 5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

**Step 5: Create site.config.ts**

```typescript
// site.config.ts
const siteConfig = {
  name: 'Kompozi',
  theme: 'starter',
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
}

export default siteConfig
```

**Step 6: Commit**

```bash
git add src/core/theme/ src/themes/starter/ site.config.ts
git commit -m "feat: add theme engine with CSS variables, ThemeProvider, starter theme"
```

---

## Task 6: Section System + Hero Section

**Files:**
- Create: `src/core/sections/types.ts`
- Create: `src/core/sections/RenderSections.tsx`
- Create: `src/core/sections/Hero/block.ts`
- Create: `src/core/sections/Hero/Component.tsx`
- Create: `src/core/sections/Hero/styles.module.css`
- Create: `src/core/sections/index.ts`
- Modify: `src/collections/Pages.ts` — add Hero block to layout field
- Modify: `src/app/(frontend)/page.tsx` — wire RenderSections
- Modify: `src/app/(frontend)/[...slug]/page.tsx` — wire RenderSections
- Modify: `src/app/(frontend)/layout.tsx` — add theme CSS

**Step 1: Define section types**

```typescript
// src/core/sections/types.ts
import type { Block } from 'payload'

export type SectionDefinition = {
  block: Block
  Component: React.ComponentType<SectionProps>
}

export type SectionProps = {
  data: Record<string, any>
  theme?: string
}
```

**Step 2: Create Hero block definition**

```typescript
// src/core/sections/Hero/block.ts
import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Centered', value: 'centered' },
        { label: 'With Background Image', value: 'withImage' },
      ],
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'withImage',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
    {
      name: 'overlay',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Add dark overlay on background image',
        condition: (_, siblingData) => siblingData?.variant === 'withImage',
      },
    },
  ],
}
```

**Step 3: Create Hero component**

```tsx
// src/core/sections/Hero/Component.tsx
import React from 'react'
import type { SectionProps } from '../types'
import styles from './styles.module.css'

export function HeroSection({ data }: SectionProps) {
  const { variant = 'default', title, subtitle, backgroundImage, buttons, overlay } = data

  const bgUrl = backgroundImage?.url || backgroundImage
  const hasImage = variant === 'withImage' && bgUrl

  return (
    <section
      className={`${styles.hero} ${styles[variant] || ''}`}
      style={hasImage ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      {hasImage && overlay && <div className={styles.overlay} />}
      <div className={styles.container}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {buttons && buttons.length > 0 && (
          <div className={styles.buttons}>
            {buttons.map((btn: any, i: number) => (
              <a
                key={i}
                href={btn.link}
                className={`${styles.button} ${styles[`button--${btn.style || 'primary'}`]}`}
              >
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

**Step 4: Create Hero styles**

```css
/* src/core/sections/Hero/styles.module.css */
.hero {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 60vh;
  padding: 6rem 0;
  background-size: cover;
  background-position: center;
}

.hero.centered {
  text-align: center;
  justify-content: center;
}

.hero.withImage {
  min-height: 80vh;
  color: #fff;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.title {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  color: var(--color-text-muted);
  max-width: 600px;
  margin-bottom: 2rem;
}

.withImage .subtitle {
  color: rgba(255, 255, 255, 0.85);
}

.buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: opacity 0.2s;
}

.button:hover {
  opacity: 0.9;
}

.button--primary {
  background: var(--color-primary);
  color: #fff;
}

.button--secondary {
  background: var(--color-secondary);
  color: #fff;
}

.button--outline {
  background: transparent;
  border: 2px solid currentColor;
  color: var(--color-primary);
}

.withImage .button--outline {
  color: #fff;
  border-color: #fff;
}
```

**Step 5: Create section index and RenderSections**

```typescript
// src/core/sections/index.ts
import { HeroBlock } from './Hero/block'
import { HeroSection } from './Hero/Component'
import type { SectionDefinition } from './types'

export const sections: Record<string, SectionDefinition> = {
  hero: {
    block: HeroBlock,
    Component: HeroSection,
  },
}

// Export all blocks for use in Pages collection
export const sectionBlocks = Object.values(sections).map((s) => s.block)
```

```tsx
// src/core/sections/RenderSections.tsx
import React from 'react'
import { sections } from './index'

type Block = {
  blockType: string
  [key: string]: any
}

type Props = {
  blocks: Block[]
  theme?: string
}

export function RenderSections({ blocks, theme }: Props) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType, id, blockName, ...blockData } = block
        const section = sections[blockType]

        if (!section) {
          console.warn(`Unknown section type: ${blockType}`)
          return null
        }

        const { Component } = section
        return <Component key={id || `${blockType}-${index}`} data={blockData} theme={theme} />
      })}
    </>
  )
}
```

**Step 6: Update Pages collection to use section blocks**

Modify `src/collections/Pages.ts`:
- Import `sectionBlocks` from `@/core/sections`
- Replace the empty `blocks: []` with `blocks: sectionBlocks`

```typescript
// Updated import at top of file
import { sectionBlocks } from '@/core/sections'

// Updated layout field
{
  name: 'layout',
  type: 'blocks',
  blocks: sectionBlocks,
},
```

**Step 7: Wire RenderSections into frontend pages**

Update `src/app/(frontend)/layout.tsx` to import theme CSS:
```tsx
import '@/themes/starter/globals.css'
```

Update `src/app/(frontend)/page.tsx` — add RenderSections and ThemeProvider:
```tsx
import { RenderSections } from '@/core/sections/RenderSections'
import { ThemeProvider } from '@/core/theme/ThemeProvider'
import { loadTheme } from '@/core/theme/loader'

// In the component, after getting the page:
const theme = await loadTheme()

// In the return when page exists:
<ThemeProvider theme={theme}>
  <main>
    <RenderSections blocks={page.layout as any[] || []} />
  </main>
</ThemeProvider>
```

Same pattern for `src/app/(frontend)/[...slug]/page.tsx`.

**Step 8: Commit**

```bash
git add src/core/sections/ src/collections/Pages.ts src/app/
git commit -m "feat: add section system with Hero section, RenderSections, wire to pages"
```

---

## Task 7: Smoke Test — Build & Run

**Step 1: Build the project**

```bash
cd /Users/lenineto/ddev/cyber5/cyber5.io/kompozi
docker compose up --build
```

**Step 2: Verify admin panel**

Navigate to `https://kompozi.local/admin` (or http://localhost:3000/admin if not using Caddy).
- Create admin user
- Create a page with title "Home", slug "home", status "Published"
- Add a Hero section with title and subtitle
- Save

**Step 3: Verify frontend**

Navigate to `https://kompozi.local/` (or http://localhost:3000).
- Should display the Hero section with the content from admin

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues from smoke test"
```

---

## Task 8: Add About Section (validate the pattern scales)

**Files:**
- Create: `src/core/sections/About/block.ts`
- Create: `src/core/sections/About/Component.tsx`
- Create: `src/core/sections/About/styles.module.css`
- Modify: `src/core/sections/index.ts` — register About section

**Step 1: Create About block**

```typescript
// src/core/sections/About/block.ts
import type { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'about',
  labels: {
    singular: 'About Section',
    plural: 'About Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (Image Right)', value: 'default' },
        { label: 'Image Left', value: 'imageLeft' },
        { label: 'Centered', value: 'centered' },
      ],
    },
    {
      name: 'smallTitle',
      type: 'text',
      admin: { description: 'Small text above main title' },
    },
    { name: 'title', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'button',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
```

**Step 2: Create About component**

```tsx
// src/core/sections/About/Component.tsx
import React from 'react'
import type { SectionProps } from '../types'
import styles from './styles.module.css'

export function AboutSection({ data }: SectionProps) {
  const { variant = 'default', smallTitle, title, content, image, button } = data
  const imgUrl = image?.url || image

  return (
    <section className={`section ${styles.about} ${styles[variant] || ''}`}>
      <div className={`container ${styles.grid}`}>
        {imgUrl && (
          <div className={styles.imageWrap}>
            <img src={imgUrl} alt={image?.alt || title || ''} />
          </div>
        )}
        <div className={styles.textWrap}>
          {smallTitle && <span className={styles.smallTitle}>{smallTitle}</span>}
          {title && <h2 className={styles.title}>{title}</h2>}
          {content && (
            <div className={styles.content}>
              {typeof content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p>Rich text content</p>
              )}
            </div>
          )}
          {button?.label && button?.link && (
            <a href={button.link} className={styles.button}>
              {button.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
```

**Step 3: Create About styles**

```css
/* src/core/sections/About/styles.module.css */
.about {
  background: var(--color-background);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.imageLeft .grid {
  direction: rtl;
}

.imageLeft .grid > * {
  direction: ltr;
}

.centered .grid {
  grid-template-columns: 1fr;
  text-align: center;
  max-width: 800px;
}

.imageWrap img {
  width: 100%;
  border-radius: 0.5rem;
}

.smallTitle {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  margin-bottom: 1.5rem;
}

.content {
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.button {
  display: inline-flex;
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 0.375rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}

.button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

**Step 4: Register in sections index**

Add to `src/core/sections/index.ts`:
```typescript
import { AboutBlock } from './About/block'
import { AboutSection } from './About/Component'

// Add to sections record:
about: {
  block: AboutBlock,
  Component: AboutSection,
},
```

**Step 5: Test in admin — add About section to homepage, verify it renders**

**Step 6: Commit**

```bash
git add src/core/sections/About/ src/core/sections/index.ts
git commit -m "feat: add About section (validates section pattern scales)"
```

---

## Done — Phase 1 Complete

At this point you have:
- Working Next.js + PayloadCMS app with Docker
- Theme engine with CSS variables and starter theme
- Section system with standardized interfaces
- Two working sections (Hero, About) proving the pattern
- Pages collection with blocks-based layout
- Dynamic routing for any page slug

**Next phases** (separate plans):
- Phase 2: Build remaining sections (Services, CTA, Contact, Content, Testimonials, Numbers, Clients, Showcase)
- Phase 3: Cyber5 theme
- Phase 4: Admin polish
