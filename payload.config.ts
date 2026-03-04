import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Pages } from './src/collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Kompozi',
    },
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    push: true,
  }),

  editor: lexicalEditor({}),

  sharp,

  collections: [Users, Media, Pages],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
