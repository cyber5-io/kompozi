import React from 'react'
import type { SectionProps } from '../types'

export function ServicesSection({ data }: SectionProps) {
  const { variant = '3col', smallTitle, title, description, items } = data
  const gridCols = variant === '4col' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <section data-section="services" className="py-20 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        {(smallTitle || title || description) && (
          <div className="text-center mb-12">
            {smallTitle && <span className="block text-sm font-semibold uppercase tracking-wide text-primary mb-2">{smallTitle}</span>}
            {title && <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-4">{title}</h2>}
            {description && <p className="text-muted max-w-[600px] mx-auto">{description}</p>}
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
                    {item.link && <a href={item.link} className="text-primary text-sm font-medium mt-2 inline-block hover:opacity-80">Learn more →</a>}
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
                  {item.link && <a href={item.link} className="text-primary text-sm font-medium mt-4 inline-block hover:opacity-80">Learn more →</a>}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  )
}
