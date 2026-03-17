import { HeroBlock } from './Hero/block'
import { HeroSection } from './Hero/Component'
import { AboutBlock } from './About/block'
import { AboutSection } from './About/Component'
import { ServicesBlock } from './Services/block'
import { ServicesSection } from './Services/Component'
import { NumbersBlock } from './Numbers/block'
import { NumbersSection } from './Numbers/Component'
import { CTABlock } from './CTA/block'
import { CTASection } from './CTA/Component'
import { TestimonialsBlock } from './Testimonials/block'
import { TestimonialsSection } from './Testimonials/Component'
import { ClientsBlock } from './Clients/block'
import { ClientsSection } from './Clients/Component'
import { ContactBlock } from './Contact/block'
import { ContactSection } from './Contact/Component'
import { ContentBlock } from './Content/block'
import { ContentSection } from './Content/Component'
import { TeamBlock } from './Team/block'
import { TeamSection } from './Team/Component'
import type { SectionDefinition } from './types'

export const sections: Record<string, SectionDefinition> = {
  hero: { block: HeroBlock, Component: HeroSection },
  about: { block: AboutBlock, Component: AboutSection },
  services: { block: ServicesBlock, Component: ServicesSection },
  numbers: { block: NumbersBlock, Component: NumbersSection },
  cta: { block: CTABlock, Component: CTASection },
  testimonials: { block: TestimonialsBlock, Component: TestimonialsSection },
  clients: { block: ClientsBlock, Component: ClientsSection },
  contact: { block: ContactBlock, Component: ContactSection },
  content: { block: ContentBlock, Component: ContentSection },
  team: { block: TeamBlock, Component: TeamSection },
}

export const sectionBlocks = Object.values(sections).map((s) => s.block)
