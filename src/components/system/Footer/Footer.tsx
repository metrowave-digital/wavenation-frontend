import styles from './Footer.module.css'

import { FooterBrand } from './FooterBrand/FooterBrand'
import { FooterNav } from './FooterNav/FooterNav'
import { FooterContact } from './FooterContact/FooterContact'
import { FooterSocial } from './FooterSocial/FooterSocial'
import { FooterLegal } from './FooterLegal/FooterLegal'
import { MobileFooter } from './MobileFooter/MobileFooter'

export function Footer() {
  return (
    <footer className={styles.root} aria-labelledby="footer-title">
      <div className={styles.container}>
        <h2 id="footer-title" className={styles.srOnly}>
          Footer
        </h2>

        <div className={styles.top}>
          <div className={styles.brand}>
            <FooterBrand />
          </div>

          <div className={styles.right}>
            <div className={styles.navWrap}>
              <FooterNav />
            </div>

            <div className={styles.meta}>
              <FooterContact />
              <FooterSocial />
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <FooterLegal />
        </div>

        <div className={styles.mobileOnly}>
          <MobileFooter />
        </div>
      </div>
    </footer>
  )
}