import type { Block } from 'payload'

export const ClientsBlock: Block = {
  slug: 'clients',
  labels: { singular: 'Clients Section', plural: 'Clients Sections' },
  fields: [
    {
      name: 'variant', type: 'select', defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    { name: 'title', type: 'text' },
    {
      name: 'grayscale', type: 'checkbox', defaultValue: true,
      admin: { description: 'Display logos in grayscale' },
    },
    {
      name: 'logos', type: 'array', minRows: 1,
      fields: [
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
