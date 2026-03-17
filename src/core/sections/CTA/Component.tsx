import React from 'react'
import type { SectionProps } from '../types'

const buttonStyles: Record<string, string> = {
  primary: 'bg-white text-primary',
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
        <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-4">{title}</h2>
        {description && <p className={`max-w-[600px] mx-auto mb-8 ${hasBg ? 'text-white/85' : 'text-white/80'}`}>{description}</p>}
        {buttons && buttons.length > 0 && (
          <div className="flex gap-4 flex-wrap justify-center">
            {buttons.map((btn: any, i: number) => {
              const btnClass = buttonStyles[btn.style || 'primary'] || buttonStyles.primary
              return (
                <a key={i} href={btn.link} className={`inline-flex items-center px-8 py-3 rounded-md font-semibold text-base no-underline transition-opacity hover:opacity-90 ${btnClass}`}>
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
