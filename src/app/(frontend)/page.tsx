import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderSections } from '@/core/sections/RenderSections'
import { ThemeProvider } from '@/core/theme/ThemeProvider'
import { loadTheme } from '@/core/theme/loader'

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

  const theme = await loadTheme()

  return (
    <ThemeProvider theme={theme}>
      <main>
        <RenderSections blocks={page.layout || []} theme={theme.name} />
      </main>
    </ThemeProvider>
  )
}
