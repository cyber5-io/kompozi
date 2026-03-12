import React from 'react'
import type { SectionProps } from '../types'

const platformLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'X',
  github: 'GitHub',
  website: 'Website',
}

export function TeamSection({ data }: SectionProps) {
  const { title, description, members } = data

  return (
    <section data-section="team" className="py-20 bg-background">
      <div className="mx-auto max-w-[1200px] px-6">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold mb-4">{title}</h2>}
            {description && <p className="text-muted max-w-[600px] mx-auto">{description}</p>}
          </div>
        )}
        {members && members.length > 0 && (
          <div className={`grid gap-8 ${members.length <= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
            {members.map((member: any, i: number) => {
              const imgUrl = member.image?.url || member.image
              return (
                <div key={i} className="text-center">
                  {imgUrl && <img src={imgUrl} alt={member.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />}
                  <h3 className="font-heading text-lg font-semibold">{member.name}</h3>
                  {member.role && <p className="text-muted text-sm mb-3">{member.role}</p>}
                  {member.socialLinks && member.socialLinks.length > 0 && (
                    <div className="flex gap-3 justify-center">
                      {member.socialLinks.map((link: any, j: number) => (
                        <a key={j} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-primary transition-colors">
                          {platformLabels[link.platform] || link.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
