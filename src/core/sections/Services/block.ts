import type { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Services Section', plural: 'Services Sections' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: '3col',
      options: [
        { label: '3 Columns', value: '3col' },
        { label: '4 Columns', value: '4col' },
        { label: 'Icon List', value: 'iconList' },
      ],
    },
    { name: 'smallTitle', type: 'text', admin: { description: 'Small text above main title' } },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Emoji or icon class' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
