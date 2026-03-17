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
          <div className={`grid gap-8 text-center ${stats.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {stats.map((stat: any, i: number) => (
              <div key={i}>
                {stat.icon && <span className="text-3xl mb-2 block">{stat.icon}</span>}
                <div className="font-heading text-4xl font-bold mb-1">{stat.number}{stat.suffix || ''}</div>
                <div className={hasBg ? 'text-white/70' : 'text-muted'}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
