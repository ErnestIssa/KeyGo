import { getToken } from './authStorage'

const API_ORIGIN = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

/** These routes must not send a stale JWT — avoids odd failures on public auth. */
function isPublicAuthPath(path: string): boolean {
  const base = path.split('?')[0]
  return (
    base === '/users/register' ||
    base === '/users/login' ||
    base === '/users/demo-login'
  )
}

function friendlyMessage(path: string, status: number, serverMessage: string): string {
  if (status === 401 && basePath(path) === '/users/login') {
    return "We couldn’t sign you in. Check your email and password, create an account, or use a demo account below."
  }
  return serverMessage || `Request failed (${status})`
}

function basePath(path: string): string {
  return path.split('?')[0]
}

function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  if (API_ORIGIN) return `${API_ORIGIN}/api${p}`
  return `/api${p}`
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token && !isPublicAuthPath(path)) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(apiUrl(path), { ...options, headers })
  const data = (await res.json().catch(() => ({}))) as { error?: string }

  if (!res.ok) {
    const msg = friendlyMessage(path, res.status, data.error || '')
    throw new ApiError(msg, res.status)
  }
  return data as T
}
