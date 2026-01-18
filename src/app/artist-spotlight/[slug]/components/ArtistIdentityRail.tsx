import styles from '../ArtistSpotlight.module.css'

export function IdentityRail({
  heritage,
  genre,
  role,
}: {
  heritage: string
  genre: string
  role: string
}) {
  return (
    <div className={styles.identityRail}>
      <div>
        <span>Heritage</span>
        <strong>{heritage}</strong>
      </div>
      <div>
        <span>Genre</span>
        <strong>{genre}</strong>
      </div>
      <div>
        <span>Role</span>
        <strong>{role}</strong>
      </div>
    </div>
  )
}
