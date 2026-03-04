import { HeroBlock } from './Hero/block'
import { HeroSection } from './Hero/Component'
import type { SectionDefinition } from './types'

export const sections: Record<string, SectionDefinition> = {
  hero: {
    block: HeroBlock,
    Component: HeroSection,
  },
}

export const sectionBlocks = Object.values(sections).map((s) => s.block)
