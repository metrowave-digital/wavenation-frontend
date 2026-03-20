type CloudflarePlayerProps = {
  playbackId?: string | null
  embedUrl?: string | null
  title: string
  autoplay?: boolean
  muted?: boolean
}

function buildCloudflareIframeUrl(
  playbackId: string,
  autoplay = false,
  muted = false,
) {
  const params = new URLSearchParams({
    autoplay: autoplay ? 'true' : 'false',
    muted: muted ? 'true' : 'false',
    controls: 'true',
  })

  return `https://iframe.videodelivery.net/${playbackId}?${params.toString()}`
}

export function CloudflarePlayer({
  playbackId,
  embedUrl,
  title,
  autoplay = false,
  muted = false,
}: CloudflarePlayerProps) {
  const src =
    embedUrl ||
    (playbackId
      ? buildCloudflareIframeUrl(playbackId, autoplay, muted)
      : null)

  if (!src) return null

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%',
        overflow: 'hidden',
        borderRadius: '24px',
        background: '#000',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <iframe
        src={src}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
      />
    </div>
  )
}