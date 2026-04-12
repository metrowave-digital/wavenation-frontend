import styles from './Footer.module.css'
import { FooterBrand } from './FooterBrand/FooterBrand'
import { FooterNav } from './FooterNav/FooterNav'
import { FooterContact } from './FooterContact/FooterContact'
import { FooterSocial } from './FooterSocial/FooterSocial'
import { FooterLegal } from './FooterLegal/FooterLegal'
import { MobileFooter } from './MobileFooter/MobileFooter'
import { FooterConfigResponse } from './footer.types'
import { SiteSettings } from '@/services/settings.api'

interface FooterProps {
  data: FooterConfigResponse | null;
  settings: SiteSettings | null;
}

export function Footer({ data, settings }: FooterProps) {
  if (!data || !settings) return null;

  return (
    <footer className={styles.root} aria-labelledby="footer-title">
      <div className={styles.container}>
        <h2 id="footer-title" className={styles.srOnly}>Footer</h2>

        <div className={styles.top}>
          <div className={styles.brand}>
            <FooterBrand settings={settings} />
          </div>

          <div className={styles.right}>
            <div className={styles.navWrap}>
              <FooterNav columns={data.columns} />
            </div>

            <div className={styles.meta}>
              <FooterContact settings={settings} />
              <FooterSocial settings={settings} />
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <FooterLegal legalLinks={data.legalLinks} />
        </div>

        <div className={styles.mobileOnly}>
          <MobileFooter columns={data.columns} settings={settings} />
        </div>
      </div>
    </footer>
  )
}