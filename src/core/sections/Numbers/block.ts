import type { Block } from 'payload'

export const NumbersBlock: Block = {
  slug: 'numbers',
  labels: { singular: 'Numbers Section', plural: 'Numbers Sections' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'With Background', value: 'withBackground' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, siblingData) => siblingData?.variant === 'withBackground' },
    },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'number', type: 'number', required: true },
        { name: 'suffix', type: 'text', admin: { description: 'e.g. +, %, K' } },
        { name: 'label', type: 'text', required: true },
        { name: 'icon', type: 'text', admin: { description: 'Emoji or icon class' } },
      ],
    },
  ],
}
