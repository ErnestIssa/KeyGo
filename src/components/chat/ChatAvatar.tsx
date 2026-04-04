import { useState } from 'react'
import { chatInitialsFromParts } from '../../lib/chatDisplayName'
import { resolveMediaUrl } from '../../lib/mediaUrl'

type Props = {
  name: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  size?: number
  className?: string
}

export function ChatAvatar({ name, firstName, lastName, avatarUrl, size = 36, className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  const src = resolveMediaUrl(avatarUrl)
  const showImage = Boolean(src) && !failed
  const initials = chatInitialsFromParts(firstName, lastName, name)
  const fontSize = size < 32 ? Math.max(10, size * 0.38) : Math.max(12, size * 0.34)

  return (
    <div
      className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-[var(--brand-soft)] ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="font-semibold text-[var(--brand)] leading-none"
          style={{ fontSize }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
