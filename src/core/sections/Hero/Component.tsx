import React from 'react'
import type { SectionProps } from '../types'

const buttonStyles: Record<string, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  outline: 'bg-transparent border-2 border-current text-primary',
}

const buttonStylesOnImage: Record<string, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  outline: 'bg-transparent border-2 border-white text-white',
}

export function HeroSection({ data }: SectionProps) {
  const { variant = 'default', title, subtitle, backgroundImage, buttons, overlay } = data

  const bgUrl = backgroundImage?.url || backgroundImage
  const hasImage = variant === 'withImage' && bgUrl
  const isCentered = variant === 'centered'

  return (
    <section
      className={`relative flex items-center ${isCentered ? 'justify-center text-center' : ''} ${hasImage ? 'min-h-[80vh] text-white' : 'min-h-[60vh]'} py-24 bg-cover bg-center`}
      style={hasImage ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      {hasImage && overlay && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 w-full">
        {title && (
          <h1 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold mb-4">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className={`text-[clamp(1.1rem,2vw,1.5rem)] max-w-[600px] mb-8 ${hasImage ? 'text-white/85' : 'text-muted'} ${isCentered ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
        {buttons && buttons.length > 0 && (
          <div className={`flex gap-4 flex-wrap ${isCentered ? 'justify-center' : ''}`}>
            {buttons.map((btn: any, i: number) => {
              const styleMap = hasImage ? buttonStylesOnImage : buttonStyles
              const btnClass = styleMap[btn.style || 'primary'] || styleMap.primary
              return (
                <a
                  key={i}
                  href={btn.link}
                  className={`inline-flex items-center px-8 py-3 rounded-md font-semibold text-base no-underline transition-opacity hover:opacity-90 ${btnClass}`}
                >
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
