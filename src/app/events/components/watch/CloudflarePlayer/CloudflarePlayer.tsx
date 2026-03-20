import styles from './CloudflarePlayer.module.css'

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
    <section className={styles.shell} aria-label="Live video player">
      <div className={styles.frame}>
        <iframe
          src={src}
          title={title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className={styles.iframe}
        />
      </div>
    </section>
  )
}