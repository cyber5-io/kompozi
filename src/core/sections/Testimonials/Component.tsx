import React from 'react'
import type { SectionProps } from '../types'

export function TestimonialsSection({ data }: SectionProps) {
  const { title, items } = data

  return (
    <section data-section="testimonials" className="py-20 bg-surface">
      <div className="mx-auto max-w-[1200px] px-6">
        {title && <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold text-center mb-12">{title}</h2>}
        {items && items.length > 0 && (
          <div className={`grid gap-8 ${items.length === 1 ? 'grid-cols-1 max-w-[600px] mx-auto' : items.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {items.map((item: any, i: number) => {
              const avatarUrl = item.avatar?.url || item.avatar
              return (
                <div key={i} className="bg-background p-8 rounded-lg border border-border">
                  <p className="text-foreground mb-6 leading-relaxed italic">&ldquo;{item.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    {avatarUrl && <img src={avatarUrl} alt={item.author} className="w-12 h-12 rounded-full object-cover" />}
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
