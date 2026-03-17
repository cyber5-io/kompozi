import React from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderSections } from '@/core/sections/RenderSections'
import { ThemeProvider } from '@/core/theme/ThemeProvider'
import { loadTheme } from '@/core/theme/loader'

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

  const theme = await loadTheme()

  return (
    <ThemeProvider theme={theme}>
      <main>
        <RenderSections blocks={page.layout || []} theme={theme.name} />
      </main>
    </ThemeProvider>
  )
}
