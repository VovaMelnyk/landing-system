import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { LandingPages } from './collections/LandingPages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Landing CMS',
    },
    livePreview: {
      url: ({ data, collectionConfig }) => {
        if (collectionConfig?.slug === 'landing-pages') {
          const tenant = typeof data.tenant === 'object' ? data.tenant?.subdomain : 'preview'
          return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/preview/${tenant}/${data.slug || 'untitled'}`
        }
        return ''
      },
      collections: ['landing-pages'],
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 768, height: 1024 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Tenants, LandingPages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // DB_PUSH=true — автоматично синхронізує схему (швидка розробка)
    // DB_PUSH=false або не вказано — потрібні міграції (безпечно, як на prod)
    push: process.env.DB_PUSH === 'true',
    migrationDir: path.resolve(dirname, '../migrations'),
  }),
  sharp: sharp as any,
  graphQL: { disable: true },
})
