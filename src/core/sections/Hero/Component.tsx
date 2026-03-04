import React from 'react'
import type { SectionProps } from '../types'
import styles from './styles.module.css'

export function HeroSection({ data }: SectionProps) {
  const { variant = 'default', title, subtitle, backgroundImage, buttons, overlay } = data

  const bgUrl = backgroundImage?.url || backgroundImage
  const hasImage = variant === 'withImage' && bgUrl

  return (
    <section
      className={`${styles.hero} ${styles[variant] || ''}`}
      style={hasImage ? { backgroundImage: `url(${bgUrl})` } : undefined}
    >
      {hasImage && overlay && <div className={styles.overlay} />}
      <div className={styles.container}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {buttons && buttons.length > 0 && (
          <div className={styles.buttons}>
            {buttons.map((btn: any, i: number) => (
              <a
                key={i}
                href={btn.link}
                className={`${styles.button} ${styles[`button--${btn.style || 'primary'}`]}`}
              >
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
