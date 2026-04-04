import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPublicUser } from '../lib/api'
import { friendlyErrorMessage } from '../lib/userFriendlyError'
import { ChatAvatar } from '../components/chat/ChatAvatar'
import { Card } from '../components/ui/Card'

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [role, setRole] = useState('')
  const [rating, setRating] = useState<number | undefined>()

  useEffect(() => {
    if (!userId) return
    let c = false
    ;(async () => {
      try {
        const { user } = await getPublicUser(userId)
        if (c) return
        setName(user.name)
        setDisplayName(user.displayName ?? user.name)
        setAvatarUrl(user.avatarUrl)
        setRole(user.role)
        setRating(user.ratingAverage)
        setError(null)
      } catch (e) {
        if (!c) setError(friendlyErrorMessage(e))
      } finally {
        if (!c) setLoading(false)
      }
    })()
    return () => {
      c = true
    }
  }, [userId])

  if (!userId) {
    return (
      <p className="text-[var(--text-muted)]">
        Missing user.{' '}
        <Link to="/profile" className="text-[var(--brand)] font-semibold">
          Profile
        </Link>
      </p>
    )
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-[var(--brand)] font-semibold min-h-[44px] -ml-2 px-2 rounded-lg hover:bg-[var(--brand-soft)]"
      >
        ← Back
      </button>

      {loading ? (
        <p className="text-[var(--text-muted)]">Loading…</p>
      ) : error ? (
        <Card className="p-4 border-[var(--border)] bg-[var(--bg-subtle)]">
          <p className="text-sm text-[var(--text-muted)]">{error}</p>
        </Card>
      ) : (
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <ChatAvatar name={name} avatarUrl={avatarUrl} size={96} />
          <h1 className="text-2xl font-bold text-[var(--text)]">{displayName}</h1>
          <p className="text-[var(--text-muted)] text-sm">
            {role === 'owner' ? 'Owner' : role === 'driver' ? 'Driver' : role}
            {rating != null ? ` · ${rating.toFixed(1)} ★` : ''}
          </p>
        </div>
      )}
    </div>
  )
}
