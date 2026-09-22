import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'

import { isEditorial, isReviewerOrAdmin } from '../access/roles'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Uploads. Alt text is required. Derivatives are made at upload time with sharp, so no host image service is needed. */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isEditorial,
    update: isEditorial,
    delete: isReviewerOrAdmin,
  },
  upload: {
    // Used only when STORAGE_DRIVER=local. The s3 plugin overrides it otherwise.
    staticDir: path.resolve(dirname, '../../../media'),
    mimeTypes: ['image/*', 'video/mp4'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 768 },
      { name: 'full', width: 1600 },
    ],
  },
  fields: [{ name: 'alt', type: 'text', required: true }],
}
