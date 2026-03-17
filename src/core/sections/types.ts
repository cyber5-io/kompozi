import type { Block } from 'payload'

export type SectionDefinition = {
  block: Block
  Component: React.ComponentType<SectionProps>
}

export type SectionProps = {
  data: Record<string, any>
  theme?: string
}
