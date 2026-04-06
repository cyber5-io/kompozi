import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './src/collections/Users.ts'
import { Media } from './src/collections/Media.ts'
import { Pages } from './src/collections/Pages.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Kompozi',
    },
    importMap: {
      baseDir: path.resolve(dirname, 'src'),
      importMapFile: path.resolve(dirname, 'src/app/(payload)/admin/importMap.js'),
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
