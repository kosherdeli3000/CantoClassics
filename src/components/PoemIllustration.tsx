interface Props {
  imageUrl: string | null
}

export function PoemIllustration({ imageUrl }: Props) {
  if (!imageUrl) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <img
        src={imageUrl}
        alt=""
        className="w-full h-full object-cover"
        style={{ opacity: 0.08 }}
        loading="eager"
      />
    </div>
  )
}
