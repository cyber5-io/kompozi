import type { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'about',
  labels: {
    singular: 'About Section',
    plural: 'About Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (Image Right)', value: 'default' },
        { label: 'Image Left', value: 'imageLeft' },
        { label: 'Centered', value: 'centered' },
      ],
    },
    {
      name: 'smallTitle',
      type: 'text',
      admin: { description: 'Small text above main title' },
    },
    { name: 'title', type: 'text' },
    { name: 'content', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'button',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}
