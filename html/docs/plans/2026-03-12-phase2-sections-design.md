# Phase 2 Design: Section Expansion

**Goal:** Build 8 additional sections for Kompozi, providing enough building blocks to assemble most business/agency pages. All sections are theme-agnostic — clean Tailwind + CSS variables — so any theme (including the future Cyber5/Vie theme) can override styling.

## Conventions

- Every section renders `<section data-section="{slug}">` as its root element
- Themes target sections via `[data-section="services"] { ... }` in CSS
- All sections use Tailwind utilities + theme CSS variables (`bg-primary`, `text-foreground`, etc.)
- No CSS Modules — Tailwind only
- Each section: `block.ts` (PayloadCMS fields) + `Component.tsx` (React + Tailwind), registered in `index.ts`
- Retrofit existing Hero and About sections with `data-section` attribute

## Sections

### 1. Services Grid (`data-section="services"`)
- **variant**: 3-col / 4-col / icon-list
- **Fields**: smallTitle, title, description
- **items array**: icon (text — emoji or icon class), title, description, link

### 2. Numbers (`data-section="numbers"`)
- **variant**: default / with-background
- **Fields**: backgroundImage (conditional on with-background)
- **stats array**: number, suffix, label, icon

### 3. CTA (`data-section="cta"`)
- **Fields**: title, description, backgroundImage (optional)
- **buttons array**: label, link, style (primary/secondary/outline)

### 4. Testimonials (`data-section="testimonials"`)
- **variant**: carousel / grid
- **Fields**: title
- **items array**: quote (textarea), author, role, avatar (media upload)

### 5. Clients (`data-section="clients"`)
- **variant**: grid / carousel
- **Fields**: title, grayscale (checkbox)
- **logos array**: logo (media upload), name, link

### 6. Contact (`data-section="contact"`)
- **variant**: default / with-map
- **Fields**: title, description, mapEmbed (text, conditional on with-map), showForm (checkbox)
- **contactInfo group**: email, phone, address
- **formFields**: standard (name, email, message)

### 7. Content (`data-section="content"`)
- **variant**: default / centered / two-column
- **Fields**: title, content (richText)
- **backgroundColor**: transparent / light-gray / dark / primary

### 8. Team (`data-section="team"`)
- **Fields**: title, description
- **members array**: name, role, image (media upload), socialLinks array (platform, url)

## Retrofits

- `Hero/Component.tsx` — add `data-section="hero"`
- `About/Component.tsx` — add `data-section="about"`

## Deferred

- **Showcase/Portfolio** — Phase 3 (needs Showcase collection, complex filtering)
- **Blog/Latest News** — needs Posts collection wired up
- **Video** — can be Hero variant or standalone later
