import type { CollectionConfig } from 'payload'

import { canUseAdmin, isAdmin, isAdminField, isSignedIn, roles } from '../access/roles'

/**
 * Editorial users. Keyed by lowercase email so an upstream identity can be matched later.
 * The role is ours and is never derived from the email address or domain.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'role'] },
  access: {
    read: isSignedIn,
    create: isAdmin,
    update: ({ req, id }) => (req.user as { role?: string } | null)?.role === 'admin' || req.user?.id === id,
    delete: isAdmin,
    admin: canUseAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.email) data.email = String(data.email).trim().toLowerCase()
        return data
      },
    ],
    beforeChange: [
      // The very first account becomes the admin, whatever the form said.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.role = 'admin'
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      options: roles.map((r) => ({ label: r, value: r })),
      required: true,
      defaultValue: 'editor',
      access: { create: isAdminField, update: isAdminField },
    },
  ],
}
