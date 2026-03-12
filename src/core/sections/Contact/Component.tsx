import React from 'react'
import type { SectionProps } from '../types'

export function ContactSection({ data }: SectionProps) {
  const { variant = 'default', title, description, contactInfo, mapEmbed, showForm = true } = data

  return (
    <section data-section="contact" className="py-20 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-4">{title}</h2>}
            {description && <p className="text-muted max-w-[600px] mx-auto">{description}</p>}
          </div>
        )}
        <div className={`grid gap-12 ${showForm && contactInfo ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-[600px] mx-auto'}`}>
          {showForm && (
            <form className="space-y-6">
              <div>
                <input type="text" name="name" placeholder="Your Name" className="w-full px-4 py-3 bg-surface border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <input type="email" name="email" placeholder="Your Email" className="w-full px-4 py-3 bg-surface border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <textarea name="message" rows={5} placeholder="Your Message" className="w-full px-4 py-3 bg-surface border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
              <button type="submit" className="px-8 py-3 bg-primary text-white rounded-md font-semibold transition-opacity hover:opacity-90">Send Message</button>
            </form>
          )}
          {contactInfo && (contactInfo.email || contactInfo.phone || contactInfo.address) && (
            <div className="space-y-6">
              {contactInfo.email && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary">{contactInfo.email}</a>
                </div>
              )}
              {contactInfo.phone && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <a href={`tel:${contactInfo.phone}`} className="text-primary">{contactInfo.phone}</a>
                </div>
              )}
              {contactInfo.address && (
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Address</h3>
                  <p className="text-muted whitespace-pre-line">{contactInfo.address}</p>
                </div>
              )}
            </div>
          )}
        </div>
        {variant === 'withMap' && mapEmbed && (
          <div className="mt-12 rounded-lg overflow-hidden border border-border">
            <iframe src={mapEmbed} width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location map" />
          </div>
        )}
      </div>
    </section>
  )
}
