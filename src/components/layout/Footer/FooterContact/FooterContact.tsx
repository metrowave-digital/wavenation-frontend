import styles from './FooterContact.module.css'
import { SiteSettings } from '@/services/settings.api'

export function FooterContact({ settings }: { settings: SiteSettings }) {
  return (
    <div className={styles.contact}>
      <h4 className={styles.heading}>Contact</h4>
      <address className={styles.address}>
        <p>{settings.address}</p>
        <a href={`tel:${settings.phone}`} className={styles.link}>{settings.phone}</a>
        <br />
        <a href={`mailto:${settings.email}`} className={styles.link}>{settings.email}</a>
      </address>
    </div>
  )
}