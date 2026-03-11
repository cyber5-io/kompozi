import React from 'react'
import type { SectionProps } from '../types'

export function AboutSection({ data }: SectionProps) {
  const { variant = 'default', smallTitle, title, content, image, button } = data
  const imgUrl = image?.url || image
  const isCentered = variant === 'centered'
  const isImageLeft = variant === 'imageLeft'

  return (
    <section className="py-20 bg-background">
      <div
        className={`mx-auto max-w-[1200px] px-6 ${
          isCentered
            ? 'max-w-[800px] text-center'
            : 'grid grid-cols-1 md:grid-cols-2 gap-12 items-center'
        }`}
      >
        {imgUrl && !isCentered && (
          <div className={isImageLeft ? 'order-first' : 'order-last'}>
            <img
              src={imgUrl}
              alt={image?.alt || title || ''}
              className="w-full rounded-lg"
            />
          </div>
        )}
        <div className={isImageLeft ? 'order-last' : 'order-first'}>
          {smallTitle && (
            <span className="block text-sm font-semibold uppercase tracking-wide text-primary mb-2">
              {smallTitle}
            </span>
          )}
          {title && (
            <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-6">
              {title}
            </h2>
          )}
          {content && (
            <div className="text-muted mb-8 leading-relaxed">
              {typeof content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p>Rich text content</p>
              )}
            </div>
          )}
          {button?.label && button?.link && (
            <a
              href={button.link}
              className="inline-flex px-8 py-3 bg-primary text-white rounded-md font-semibold no-underline transition-opacity hover:opacity-90"
            >
              {button.label}
            </a>
          )}
        </div>
        {imgUrl && isCentered && (
          <img
            src={imgUrl}
            alt={image?.alt || title || ''}
            className="w-full rounded-lg mt-8"
          />
        )}
      </div>
    </section>
  )
}
