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
        {title && <h2 className={`font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-8 ${isCentered ? 'mx-auto' : ''}`}>{title}</h2>}
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
