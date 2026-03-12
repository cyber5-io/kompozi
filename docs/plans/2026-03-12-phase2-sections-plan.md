# Phase 2: Section Expansion — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 8 new sections to Kompozi and retrofit existing Hero/About with `data-section` attributes, providing enough building blocks to assemble most business/agency pages.

**Architecture:** Each section is two files: `block.ts` (PayloadCMS block schema) + `Component.tsx` (React component with Tailwind). All sections are registered in `src/core/sections/index.ts` which exports `sectionBlocks` consumed by the Pages collection. Every section root element uses `<section data-section="{slug}">` for theme targeting.

**Tech Stack:** PayloadCMS 3.78.0, React 19, TypeScript, Tailwind CSS v4

**Conventions (all tasks must follow):**
- Root element: `<section data-section="{slug}" className="...">`
- Tailwind utilities only — no CSS Modules
- Theme colors: `bg-primary`, `text-foreground`, `text-muted`, `bg-surface`, `border-border`, etc.
- Theme fonts: `font-heading`, `font-body`
- Container: `mx-auto max-w-[1200px] px-6`
- Import `SectionProps` from `../types`
- No Claude/AI references in commits
- No local yarn/npm — all runs inside Docker

---

## Task 0: Retrofit Hero and About with data-section

**Files:**
- Modify: `src/core/sections/Hero/Component.tsx`
- Modify: `src/core/sections/About/Component.tsx`

- [ ] **Step 1: Add data-section="hero" to Hero**

In `src/core/sections/Hero/Component.tsx`, change the `<section` opening tag from:

```tsx
<section
  className={`relative flex items-center ${isCentered ? 'justify-center text-center' : ''} ${hasImage ? 'min-h-[80vh] text-white' : 'min-h-[60vh]'} py-24 bg-cover bg-center`}
  style={hasImage ? { backgroundImage: `url(${bgUrl})` } : undefined}
>
```

to:

```tsx
<section
  data-section="hero"
  className={`relative flex items-center ${isCentered ? 'justify-center text-center' : ''} ${hasImage ? 'min-h-[80vh] text-white' : 'min-h-[60vh]'} py-24 bg-cover bg-center`}
  style={hasImage ? { backgroundImage: `url(${bgUrl})` } : undefined}
>
```

- [ ] **Step 2: Add data-section="about" to About**

In `src/core/sections/About/Component.tsx`, change:

```tsx
<section className="py-20 bg-background">
```

to:

```tsx
<section data-section="about" className="py-20 bg-background">
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/Hero/Component.tsx src/core/sections/About/Component.tsx
git commit -m "refactor: add data-section attributes to Hero and About"
```

---

## Task 1: Services Grid Section

**Files:**
- Create: `src/core/sections/Services/block.ts`
- Create: `src/core/sections/Services/Component.tsx`

- [ ] **Step 1: Create block definition**

Create `src/core/sections/Services/block.ts`:

```typescript
import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  labels: {
    singular: 'Services Section',
    plural: 'Services Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: '3col',
      options: [
        { label: '3 Columns', value: '3col' },
        { label: '4 Columns', value: '4col' },
        { label: 'Icon List', value: 'iconList' },
      ],
    },
    {
      name: 'smallTitle',
      type: 'text',
      admin: { description: 'Small text above main title' },
    },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Emoji or icon class' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create component**

Create `src/core/sections/Services/Component.tsx`:

```tsx
import React from 'react'
import type { SectionProps } from '../types'

export function ServicesSection({ data }: SectionProps) {
  const { variant = '3col', smallTitle, title, description, items } = data

  const gridCols = variant === '4col'
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section data-section="services" className="py-20 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        {(smallTitle || title || description) && (
          <div className="text-center mb-12">
            {smallTitle && (
              <span className="block text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                {smallTitle}
              </span>
            )}
            {title && (
              <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted max-w-[600px] mx-auto">{description}</p>
            )}
          </div>
        )}
        {items && items.length > 0 && (
          variant === 'iconList' ? (
            <div className="space-y-6 max-w-[800px] mx-auto">
              {items.map((item: any, i: number) => (
                <div key={i} className="flex gap-4 items-start">
                  {item.icon && <span className="text-2xl shrink-0 mt-1">{item.icon}</span>}
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-1">{item.title}</h3>
                    {item.description && <p className="text-muted">{item.description}</p>}
                    {item.link && (
                      <a href={item.link} className="text-primary text-sm font-medium mt-2 inline-block hover:opacity-80">
                        Learn more →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid ${gridCols} gap-8`}>
              {items.map((item: any, i: number) => (
                <div key={i} className="p-6 bg-surface rounded-lg border border-border">
                  {item.icon && <span className="text-3xl mb-4 block">{item.icon}</span>}
                  <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                  {item.description && <p className="text-muted text-sm">{item.description}</p>}
                  {item.link && (
                    <a href={item.link} className="text-primary text-sm font-medium mt-4 inline-block hover:opacity-80">
                      Learn more →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/Services/
git commit -m "feat: add Services Grid section"
```

---

## Task 2: Numbers Section

**Files:**
- Create: `src/core/sections/Numbers/block.ts`
- Create: `src/core/sections/Numbers/Component.tsx`

- [ ] **Step 1: Create block definition**

Create `src/core/sections/Numbers/block.ts`:

```typescript
import type { Block } from 'payload'

export const NumbersBlock: Block = {
  slug: 'numbers',
  labels: {
    singular: 'Numbers Section',
    plural: 'Numbers Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'With Background', value: 'withBackground' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'withBackground',
      },
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'number', type: 'number', required: true },
        { name: 'suffix', type: 'text', admin: { description: 'e.g. +, %, K' } },
        { name: 'label', type: 'text', required: true },
        { name: 'icon', type: 'text', admin: { description: 'Emoji or icon class' } },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create component**

Create `src/core/sections/Numbers/Component.tsx`:

```tsx
import React from 'react'
import type { SectionProps } from '../types'

export function NumbersSection({ data }: SectionProps) {
  const { variant = 'default', backgroundImage, stats } = data

  const bgUrl = backgroundImage?.url || backgroundImage
  const hasBg = variant === 'withBackground' && bgUrl

  return (
    <section
      data-section="numbers"
      className={`py-20 bg-cover bg-center bg-no-repeat ${hasBg ? 'text-white relative' : 'bg-surface'}`}
      style={hasBg ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      {hasBg && <div className="absolute inset-0 bg-black/60" />}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        {stats && stats.length > 0 && (
          <div className={`grid gap-8 text-center ${
            stats.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
          }`}>
            {stats.map((stat: any, i: number) => (
              <div key={i}>
                {stat.icon && <span className="text-3xl mb-2 block">{stat.icon}</span>}
                <div className="font-heading text-4xl font-bold mb-1">
                  {stat.number}{stat.suffix || ''}
                </div>
                <div className={hasBg ? 'text-white/70' : 'text-muted'}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/Numbers/
git commit -m "feat: add Numbers/Stats section"
```

---

## Task 3: CTA Section

**Files:**
- Create: `src/core/sections/CTA/block.ts`
- Create: `src/core/sections/CTA/Component.tsx`

- [ ] **Step 1: Create block definition**

Create `src/core/sections/CTA/block.ts`:

```typescript
import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
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
  ],
}
```

- [ ] **Step 2: Create component**

Create `src/core/sections/CTA/Component.tsx`:

```tsx
import React from 'react'
import type { SectionProps } from '../types'

const buttonStyles: Record<string, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  outline: 'bg-transparent border-2 border-current text-primary',
}

const buttonStylesOnImage: Record<string, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  outline: 'bg-transparent border-2 border-white text-white',
}

export function CTASection({ data }: SectionProps) {
  const { title, description, backgroundImage, buttons } = data

  const bgUrl = backgroundImage?.url || backgroundImage
  const hasBg = !!bgUrl

  return (
    <section
      data-section="cta"
      className={`py-20 bg-cover bg-center bg-no-repeat ${hasBg ? 'text-white relative' : 'bg-primary text-white'}`}
      style={hasBg ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      {hasBg && <div className="absolute inset-0 bg-black/60" />}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center">
        <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-4">
          {title}
        </h2>
        {description && (
          <p className={`max-w-[600px] mx-auto mb-8 ${hasBg ? 'text-white/85' : 'text-white/80'}`}>
            {description}
          </p>
        )}
        {buttons && buttons.length > 0 && (
          <div className="flex gap-4 flex-wrap justify-center">
            {buttons.map((btn: any, i: number) => {
              const styleMap = hasBg ? buttonStylesOnImage : buttonStylesOnImage
              const btnClass = styleMap[btn.style || 'primary'] || styleMap.primary
              return (
                <a
                  key={i}
                  href={btn.link}
                  className={`inline-flex items-center px-8 py-3 rounded-md font-semibold text-base no-underline transition-opacity hover:opacity-90 ${btnClass}`}
                >
                  {btn.label}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/CTA/
git commit -m "feat: add CTA section"
```

---

## Task 4: Testimonials Section

**Files:**
- Create: `src/core/sections/Testimonials/block.ts`
- Create: `src/core/sections/Testimonials/Component.tsx`

- [ ] **Step 1: Create block definition**

Create `src/core/sections/Testimonials/block.ts`:

```typescript
import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials Section',
    plural: 'Testimonials Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    { name: 'title', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create component**

Create `src/core/sections/Testimonials/Component.tsx`:

Note: The carousel variant renders the same grid layout in the starter theme. The Cyber5 theme will override this with Swiper later via `[data-section="testimonials"]` CSS targeting.

```tsx
import React from 'react'
import type { SectionProps } from '../types'

export function TestimonialsSection({ data }: SectionProps) {
  const { title, items } = data

  return (
    <section data-section="testimonials" className="py-20 bg-surface">
      <div className="mx-auto max-w-[1200px] px-6">
        {title && (
          <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-center mb-12">
            {title}
          </h2>
        )}
        {items && items.length > 0 && (
          <div className={`grid gap-8 ${
            items.length === 1 ? 'grid-cols-1 max-w-[600px] mx-auto' :
            items.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {items.map((item: any, i: number) => {
              const avatarUrl = item.avatar?.url || item.avatar
              return (
                <div key={i} className="bg-background p-8 rounded-lg border border-border">
                  <p className="text-foreground mb-6 leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt={item.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-foreground">{item.author}</div>
                      {item.role && <div className="text-sm text-muted">{item.role}</div>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/Testimonials/
git commit -m "feat: add Testimonials section"
```

---

## Task 5: Clients Section

**Files:**
- Create: `src/core/sections/Clients/block.ts`
- Create: `src/core/sections/Clients/Component.tsx`

- [ ] **Step 1: Create block definition**

Create `src/core/sections/Clients/block.ts`:

```typescript
import type { Block } from 'payload'

export const ClientsBlock: Block = {
  slug: 'clients',
  labels: {
    singular: 'Clients Section',
    plural: 'Clients Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    { name: 'title', type: 'text' },
    {
      name: 'grayscale',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Display logos in grayscale' },
    },
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create component**

Create `src/core/sections/Clients/Component.tsx`:

Note: Carousel variant renders as a single-row flex layout in the starter theme. The Cyber5 theme can override with a Swiper marquee.

```tsx
import React from 'react'
import type { SectionProps } from '../types'

export function ClientsSection({ data }: SectionProps) {
  const { title, logos, grayscale = true } = data

  const imgClass = grayscale
    ? 'max-h-12 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300'
    : 'max-h-12 w-auto object-contain'

  return (
    <section data-section="clients" className="py-16 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        {title && (
          <h2 className="font-heading text-lg font-semibold text-center text-muted mb-10">
            {title}
          </h2>
        )}
        {logos && logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-10">
            {logos.map((item: any, i: number) => {
              const logoUrl = item.logo?.url || item.logo
              if (!logoUrl) return null
              const img = (
                <img
                  src={logoUrl}
                  alt={item.name}
                  className={imgClass}
                />
              )
              return item.link ? (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">
                  {img}
                </a>
              ) : (
                <div key={i}>{img}</div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/Clients/
git commit -m "feat: add Clients section"
```

---

## Task 6: Contact Section

**Files:**
- Create: `src/core/sections/Contact/block.ts`
- Create: `src/core/sections/Contact/Component.tsx`

- [ ] **Step 1: Create block definition**

Create `src/core/sections/Contact/block.ts`:

```typescript
import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  labels: {
    singular: 'Contact Section',
    plural: 'Contact Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'With Map', value: 'withMap' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'textarea' },
      ],
    },
    {
      name: 'mapEmbed',
      type: 'text',
      admin: {
        description: 'Google Maps embed URL',
        condition: (_, siblingData) => siblingData?.variant === 'withMap',
      },
    },
    {
      name: 'showForm',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
```

- [ ] **Step 2: Create component**

Create `src/core/sections/Contact/Component.tsx`:

Note: The form is a static HTML form in the starter theme — no backend submission. Backend form handling can be added later via PayloadCMS form builder or API route.

```tsx
import React from 'react'
import type { SectionProps } from '../types'

export function ContactSection({ data }: SectionProps) {
  const { variant = 'default', title, description, contactInfo, mapEmbed, showForm = true } = data

  return (
    <section data-section="contact" className="py-20 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted max-w-[600px] mx-auto">{description}</p>
            )}
          </div>
        )}
        <div className={`grid gap-12 ${showForm && contactInfo ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-[600px] mx-auto'}`}>
          {showForm && (
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white rounded-md font-semibold transition-opacity hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          )}
          {contactInfo && (contactInfo.email || contactInfo.phone || contactInfo.address) && (
            <div className="space-y-6">
              {contactInfo.email && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary">{contactInfo.email}</a>
                </div>
              )}
              {contactInfo.phone && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <a href={`tel:${contactInfo.phone}`} className="text-primary">{contactInfo.phone}</a>
                </div>
              )}
              {contactInfo.address && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Address</h3>
                  <p className="text-muted whitespace-pre-line">{contactInfo.address}</p>
                </div>
              )}
            </div>
          )}
        </div>
        {variant === 'withMap' && mapEmbed && (
          <div className="mt-12 rounded-lg overflow-hidden border border-border">
            <iframe
              src={mapEmbed}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location map"
            />
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/Contact/
git commit -m "feat: add Contact section"
```

---

## Task 7: Content Section

**Files:**
- Create: `src/core/sections/Content/block.ts`
- Create: `src/core/sections/Content/Component.tsx`

- [ ] **Step 1: Create block definition**

Create `src/core/sections/Content/block.ts`:

```typescript
import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'content',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Centered', value: 'centered' },
        { label: 'Two Column', value: 'twoColumn' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'content', type: 'richText' },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'transparent',
      options: [
        { label: 'Transparent', value: 'transparent' },
        { label: 'Light Gray', value: 'lightGray' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create component**

Create `src/core/sections/Content/Component.tsx`:

```tsx
import React from 'react'
import type { SectionProps } from '../types'

const bgMap: Record<string, string> = {
  transparent: 'bg-background',
  lightGray: 'bg-surface',
  dark: 'bg-foreground text-background',
  primary: 'bg-primary text-white',
}

export function ContentSection({ data }: SectionProps) {
  const { variant = 'default', title, content, backgroundColor = 'transparent' } = data

  const bgClass = bgMap[backgroundColor] || bgMap.transparent
  const isCentered = variant === 'centered'
  const isTwoCol = variant === 'twoColumn'

  return (
    <section data-section="content" className={`py-20 ${bgClass}`}>
      <div className={`mx-auto max-w-[1200px] px-6 ${isCentered ? 'text-center' : ''}`}>
        {title && (
          <h2 className={`font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-8 ${isCentered ? 'mx-auto' : ''}`}>
            {title}
          </h2>
        )}
        {content && (
          <div className={`leading-relaxed ${isTwoCol ? 'columns-1 md:columns-2 gap-12' : ''} ${isCentered ? 'max-w-[800px] mx-auto' : ''}`}>
            {typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p>Rich text content</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/Content/
git commit -m "feat: add Content section"
```

---

## Task 8: Team Section

**Files:**
- Create: `src/core/sections/Team/block.ts`
- Create: `src/core/sections/Team/Component.tsx`

- [ ] **Step 1: Create block definition**

Create `src/core/sections/Team/block.ts`:

```typescript
import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'team',
  labels: {
    singular: 'Team Section',
    plural: 'Team Sections',
  },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'members',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'socialLinks',
          type: 'array',
          maxRows: 5,
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter / X', value: 'twitter' },
                { label: 'GitHub', value: 'github' },
                { label: 'Website', value: 'website' },
              ],
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
```

- [ ] **Step 2: Create component**

Create `src/core/sections/Team/Component.tsx`:

```tsx
import React from 'react'
import type { SectionProps } from '../types'

const platformLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'X',
  github: 'GitHub',
  website: 'Website',
}

export function TeamSection({ data }: SectionProps) {
  const { title, description, members } = data

  return (
    <section data-section="team" className="py-20 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted max-w-[600px] mx-auto">{description}</p>
            )}
          </div>
        )}
        {members && members.length > 0 && (
          <div className={`grid gap-8 ${
            members.length <= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            {members.map((member: any, i: number) => {
              const imgUrl = member.image?.url || member.image
              return (
                <div key={i} className="text-center">
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                    />
                  )}
                  <h3 className="font-heading text-lg font-semibold">{member.name}</h3>
                  {member.role && <p className="text-muted text-sm mb-3">{member.role}</p>}
                  {member.socialLinks && member.socialLinks.length > 0 && (
                    <div className="flex gap-3 justify-center">
                      {member.socialLinks.map((link: any, j: number) => (
                        <a
                          key={j}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted hover:text-primary transition-colors"
                        >
                          {platformLabels[link.platform] || link.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/Team/
git commit -m "feat: add Team section"
```

---

## Task 9: Register All Sections

**Files:**
- Modify: `src/core/sections/index.ts`

- [ ] **Step 1: Update section registry**

Replace the contents of `src/core/sections/index.ts` with:

```typescript
import { HeroBlock } from './Hero/block'
import { HeroSection } from './Hero/Component'
import { AboutBlock } from './About/block'
import { AboutSection } from './About/Component'
import { ServicesBlock } from './Services/block'
import { ServicesSection } from './Services/Component'
import { NumbersBlock } from './Numbers/block'
import { NumbersSection } from './Numbers/Component'
import { CTABlock } from './CTA/block'
import { CTASection } from './CTA/Component'
import { TestimonialsBlock } from './Testimonials/block'
import { TestimonialsSection } from './Testimonials/Component'
import { ClientsBlock } from './Clients/block'
import { ClientsSection } from './Clients/Component'
import { ContactBlock } from './Contact/block'
import { ContactSection } from './Contact/Component'
import { ContentBlock } from './Content/block'
import { ContentSection } from './Content/Component'
import { TeamBlock } from './Team/block'
import { TeamSection } from './Team/Component'
import type { SectionDefinition } from './types'

export const sections: Record<string, SectionDefinition> = {
  hero: { block: HeroBlock, Component: HeroSection },
  about: { block: AboutBlock, Component: AboutSection },
  services: { block: ServicesBlock, Component: ServicesSection },
  numbers: { block: NumbersBlock, Component: NumbersSection },
  cta: { block: CTABlock, Component: CTASection },
  testimonials: { block: TestimonialsBlock, Component: TestimonialsSection },
  clients: { block: ClientsBlock, Component: ClientsSection },
  contact: { block: ContactBlock, Component: ContactSection },
  content: { block: ContentBlock, Component: ContentSection },
  team: { block: TeamBlock, Component: TeamSection },
}

export const sectionBlocks = Object.values(sections).map((s) => s.block)
```

- [ ] **Step 2: Verify Docker picks up changes**

```bash
docker restart kompozi-app
```

Wait for logs to show `Ready`. Then hard-refresh the admin panel and verify all 10 section types appear when adding a block to a page layout.

- [ ] **Step 3: Commit**

```bash
git add src/core/sections/index.ts
git commit -m "feat: register all Phase 2 sections in section registry"
```

---

## Done — Phase 2 Complete

At this point Kompozi has 10 section types:
- Hero, About (from Phase 1, now with `data-section`)
- Services, Numbers, CTA, Testimonials, Clients, Contact, Content, Team (Phase 2)

All sections are theme-agnostic, using Tailwind + CSS variables, with `data-section` attributes for theme targeting.

**Next:** Phase 3 — Cyber5 theme (Vie visual style applied via `[data-section="..."]` CSS overrides)
