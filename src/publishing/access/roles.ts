import type { Access, FieldAccess, PayloadRequest } from 'payload'

export const roles = ['editor', 'reviewer', 'admin'] as const
export type Role = (typeof roles)[number]

const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null | undefined)?.role

export const isSignedIn: Access = ({ req }) => Boolean(req.user)
/** For `access.admin`, which must return a plain boolean. */
export const canUseAdmin = ({ req }: { req: PayloadRequest }): boolean => Boolean(req.user)
export const isAdmin: Access = ({ req }) => roleOf(req.user) === 'admin'
export const isReviewerOrAdmin: Access = ({ req }) => {
  const role = roleOf(req.user)
  return role === 'reviewer' || role === 'admin'
}
export const isEditorial: Access = ({ req }) => roles.includes(roleOf(req.user) as Role)

export const isAdminField: FieldAccess = ({ req }) => roleOf(req.user) === 'admin'
