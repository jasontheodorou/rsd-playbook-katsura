import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { addLearningTables } from './learning/schema'
import { databasePoolMax, databaseUrl } from './platform/db'
import { emailAdapter } from './platform/email'
import { jobsConfig } from './platform/jobs'
import { siteUrl } from './platform/site-url'
import { storagePlugins } from './platform/storage'
import { Media } from './publishing/collections/media'
import { Users } from './publishing/collections/users'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// This file must be importable with no database available: `next build` imports it.
// Nothing here connects; Payload connects on first use.
export default buildConfig({
  serverURL: siteUrl(),
  cors: [siteUrl()],
  csrf: [siteUrl()],
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: databaseUrl(), max: databasePoolMax() },
    // Schema changes always go through committed migrations, in development too.
    push: false,
    migrationDir: path.resolve(dirname, '../migrations'),
    afterSchemaInit: [addLearningTables],
  }),
  sharp,
  email: emailAdapter(),
  jobs: jobsConfig(),
  plugins: [...storagePlugins()],
})
