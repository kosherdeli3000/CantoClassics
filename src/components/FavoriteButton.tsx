import { useState } from 'react'

interface Props {
  isFavorited: boolean
  onToggle: () => void
}

export function FavoriteButton({ isFavorited, onToggle }: Props) {
  const [pulsing, setPulsing] = useState(false)

  function handleClick() {
    if (!isFavorited) {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 400)
    }
    onToggle()
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`
        text-lg transition-all duration-200
        ${isFavorited ? 'text-vermillion' : 'text-warm-gray-light hover:text-vermillion'}
        ${pulsing ? 'scale-125' : 'scale-100'}
      `}
      style={{ transition: 'transform 200ms ease-out, color 200ms ease' }}
    >
      {isFavorited ? '♥' : '♡'}
    </button>
  )
}
