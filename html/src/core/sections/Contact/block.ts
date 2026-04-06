import type { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  labels: { singular: 'Contact Section', plural: 'Contact Sections' },
  fields: [
    {
      name: 'variant', type: 'select', defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'With Map', value: 'withMap' },
      ],
    },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'contactInfo', type: 'group',
      fields: [
        { name: 'email', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'textarea' },
      ],
    },
    {
      name: 'mapEmbed', type: 'text',
      admin: {
        description: 'Google Maps embed URL',
        condition: (_, siblingData) => siblingData?.variant === 'withMap',
      },
    },
    { name: 'showForm', type: 'checkbox', defaultValue: true },
  ],
}
