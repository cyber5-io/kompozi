import { HeroBlock } from './Hero/block'
import { HeroSection } from './Hero/Component'
import { AboutBlock } from './About/block'
import { AboutSection } from './About/Component'
import type { SectionDefinition } from './types'

export const sections: Record<string, SectionDefinition> = {
  hero: {
    block: HeroBlock,
    Component: HeroSection,
  },
  about: {
    block: AboutBlock,
    Component: AboutSection,
  },
}

export const sectionBlocks = Object.values(sections).map((s) => s.block)
