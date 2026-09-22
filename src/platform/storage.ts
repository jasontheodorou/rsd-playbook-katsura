import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'

import { env, oneOf } from './env'

/**
 * Media storage seam.
 *  - local: files on disk under ./media (development only; serverless hosts have no disk)
 *  - s3:    any S3-compatible bucket (Cloudflare R2 now, MinIO or the employer's bucket later)
 * Content stores relative paths; nothing in the database encodes a bucket or host.
 */
export const storageDrivers = ['local', 's3'] as const
export type StorageDriver = (typeof storageDrivers)[number]

export const storageDriver = (): StorageDriver => oneOf('STORAGE_DRIVER', storageDrivers, 'local')

export const storagePlugins = (): Plugin[] => {
  if (storageDriver() !== 's3') return []
  return [
    s3Storage({
      collections: { media: true },
      bucket: env('S3_BUCKET'),
      // Browser uploads go straight to the bucket via a presigned URL. Required on Vercel.
      clientUploads: env('S3_CLIENT_UPLOADS', 'true') !== 'false',
      config: {
        endpoint: env('S3_ENDPOINT') || undefined,
        region: env('S3_REGION', 'auto'),
        forcePathStyle: env('S3_FORCE_PATH_STYLE') === 'true',
        credentials: {
          accessKeyId: env('S3_ACCESS_KEY_ID'),
          secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
        },
      },
    }),
  ]
}
