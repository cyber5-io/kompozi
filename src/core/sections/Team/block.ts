import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'team',
  labels: { singular: 'Team Section', plural: 'Team Sections' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'members',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'socialLinks',
          type: 'array',
          maxRows: 5,
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter / X', value: 'twitter' },
                { label: 'GitHub', value: 'github' },
                { label: 'Website', value: 'website' },
              ],
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
