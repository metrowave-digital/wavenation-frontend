import Link from 'next/link'
import Image from 'next/image'
import { getCharts } from '@/services/charts.api'
import { Flame, ArrowRight } from 'lucide-react'
import styles from './HomeCharts.module.css'

export default async function HomeCharts() {
  const res = await getCharts({ limit: 1, where: '&where[chartKey][equals]=hitlist&where[_status][equals]=published' });
  const latestChart = res.docs?.[0];
  if (!latestChart) return null;

  const numberOne = latestChart.entries?.[0];
  const no1Art = numberOne?.manualTrack?.artwork?.url || '/images/default-track.jpg';

  return (
    <section className={styles.wrapper} aria-labelledby="charts-title">
      <div className={styles.container}>
        <div className={styles.chartPanel}>
          <div className={styles.panelOverlay} />
          <div className={styles.contentGrid}>
            <div className={styles.chartContent}>
              <p className={styles.eyebrow}>DATA TERMINAL</p>
              <h2 id="charts-title" className={styles.sectionTitle}>THE HITLIST 20</h2>
              <p className={styles.sectionDescription}>WaveNation’s flagship chart tracks the records moving culture right now.</p>
              <div className={styles.buttonRow}>
                <Link href={`/charts/${latestChart.slug}`} className={styles.primaryButton}>VIEW LATEST CHART</Link>
                <Link href="/charts" className={styles.secondaryButton}>ALL CHARTS <ArrowRight size={16} /></Link>
              </div>
            </div>
            {numberOne && (
              <div className={styles.numberOneSpotlight}>
                <div className={styles.no1Header}><Flame size={16} /> #1 THIS WEEK</div>
                <div className={styles.no1Visual}>
                  <Image src={no1Art} alt={numberOne.trackTitle} width={120} height={120} className={styles.no1Img} />
                  <div className={styles.no1Meta}>
                    <span className={styles.no1Title}>{numberOne.trackTitle}</span>
                    <span className={styles.no1Artist}>{numberOne.artist}</span>
                    <span className={styles.weeksOnChart}>{numberOne.weeksOnChart} WEEKS ON CHART</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}