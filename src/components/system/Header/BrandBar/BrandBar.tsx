'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './BrandBar.module.css'

export function BrandBar() {
  return (
    <div className={styles.wrap}>
      <Link
        href="/"
        className={styles.root}
        aria-label="WaveNation home"
      >
        <div className={styles.brand}>
          <div className={styles.logoShell}>
            <Image
              src="/brand/wavenation-logo-2.svg"
              alt="WaveNation logo"
              width={30}
              height={30}
              priority
              className={styles.logo}
            />
          </div>

          <div className={styles.text}>
            <span className={styles.eyebrow}>Digital Media Network</span>
            <span className={styles.title}>WAVENATION</span>
            <span className={styles.tagline}>
              Amplify Your Vibe
            </span>
          </div>
        </div>

        <span className={styles.glow} aria-hidden="true" />
      </Link>

      <div className={styles.signal} aria-hidden="true">
        <span className={styles.bar1} />
        <span className={styles.bar2} />
        <span className={styles.bar3} />
        <span className={styles.bar4} />
        <span className={styles.bar5} />
        <span className={styles.bar6} />
      </div>
    </div>
  )
}