import React from 'react'
import { sections } from './index'

type Block = {
  blockType: string
  [key: string]: any
}

type Props = {
  blocks: Block[]
  theme?: string
}

export function RenderSections({ blocks, theme }: Props) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType, id, blockName, ...blockData } = block
        const section = sections[blockType]

        if (!section) {
          console.warn(`Unknown section type: ${blockType}`)
          return null
        }

        const { Component } = section
        return <Component key={id || `${blockType}-${index}`} data={blockData} theme={theme} />
      })}
    </>
  )
}
