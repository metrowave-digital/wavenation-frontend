import Link from 'next/link'
import { Facebook, Instagram, X } from 'lucide-react'
import styles from '../NewsTicker.module.css'

export function NewsTickerMiniMenu() {
  return (
    <nav
      className={styles.miniMenu}
      aria-label="Quick links and social links"
    >
      <div className={styles.quickLinks}>
        <Link href="/submissions" className={styles.menuLink}>
          Submissions
        </Link>
        <Link
          href="/partner-with-us"
          className={styles.menuLink}
        >
          Advertise
        </Link>
        <Link href="/contact-us" className={styles.menuLink}>
          Contact
        </Link>
      </div>

      <span className={styles.divider} />

      <div className={styles.socialLinks}>
        <a
          href="https://www.facebook.com/people/WaveNation-Media/61585147160405/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.social}
          aria-label="WaveNation on Facebook"
        >
          <Facebook size={14} />
        </a>

        <a
          href="https://www.instagram.com/wavenationmedia/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.social}
          aria-label="WaveNation on Instagram"
        >
          <Instagram size={14} />
        </a>

        <a
          href="https://x.com/WaveNationMedia"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.social}
          aria-label="WaveNation on X"
        >
          <X size={14} />
        </a>
      </div>
    </nav>
  )
}