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
        {title && <h2 className="font-heading text-lg font-semibold text-center text-muted mb-10">{title}</h2>}
        {logos && logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-10">
            {logos.map((item: any, i: number) => {
              const logoUrl = item.logo?.url || item.logo
              if (!logoUrl) return null
              const img = <img src={logoUrl} alt={item.name} className={imgClass} />
              return item.link ? (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer">{img}</a>
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
