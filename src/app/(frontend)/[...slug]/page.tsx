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
    </main>
  )
}
