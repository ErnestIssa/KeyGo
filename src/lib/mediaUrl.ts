import { getApiOrigin } from './apiOrigin'

/** Resolve API-stored paths like `/uploads/avatars/id.jpg` for `<img src>`. */
export function resolveMediaUrl(relativeOrAbsolute: string | undefined): string | undefined {
  if (!relativeOrAbsolute) return undefined
  if (/^https?:\/\//i.test(relativeOrAbsolute)) return relativeOrAbsolute
  const path = relativeOrAbsolute.startsWith('/') ? relativeOrAbsolute : `/${relativeOrAbsolute}`
  const origin = getApiOrigin()
  if (origin) return `${origin}${path}`
  return path
}
