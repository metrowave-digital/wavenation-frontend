import Link from 'next/link';
import Image from 'next/image';
import { getCharts, WNChart, WNChartEntry } from '@/services/charts.api';
import { BarChart2, ArrowRight } from 'lucide-react';
import { BackToTop } from '@/components/ui/BackToTop/BackToTop';
import styles from './ChartsHub.module.css';

// Define the exact order you want the charts to appear in based on their chartKeys
const CHART_ORDER = [
  'hitlist',
  'rnb-soul',
  'gospel',
  'hip-hop',
  'southern-soul',
  'house-bpm'
];

export default async function ChartsHubPage() {
  const response = await getCharts({ limit: 100 }); 
  
  const publishedCharts = (response.docs as WNChart[] || []).filter(
    (c: WNChart) => c._status === 'published' || c.status === 'published'
  );

  const latestChartsMap = new Map<string, WNChart>();
  
  for (const chart of publishedCharts) {
    if (!latestChartsMap.has(chart.chartKey)) {
      latestChartsMap.set(chart.chartKey, chart);
    }
  }
  
  // Extract the unique charts and sort them based on the CHART_ORDER array
  const currentCharts = Array.from(latestChartsMap.values()).sort((a, b) => {
    const indexA = CHART_ORDER.indexOf(a.chartKey);
    const indexB = CHART_ORDER.indexOf(b.chartKey);
    
    // If a chartKey isn't in the array, push it to the bottom
    const weightA = indexA === -1 ? 999 : indexA;
    const weightB = indexB === -1 ? 999 : indexB;
    
    return weightA - weightB;
  });

  return (
    <div className={styles.page}>
      <div className={styles.textureOverlay} />
      
      <main className={styles.main}>
        <header className={styles.hubHeader}>
          <BarChart2 size={48} className={styles.hubIcon} />
          <h1 className={styles.hubTitle}>CHARTS <span>HUB</span></h1>
          <div className={styles.hubActions}>
            <Link href="/charts/archive" className={styles.archiveLink}>SEARCH ARCHIVES</Link>
          </div>
        </header>

        {/* --- STICKY CATEGORY NAV --- */}
        <nav className={styles.stickyNav}>
          <div className={styles.navScroll}>
            {currentCharts.map((chart: WNChart) => {
              const displayTitle = chart.title.split(' - ')[0] || chart.chartKey;
              return (
                <a key={chart.chartKey} href={`#${chart.chartKey}`} className={styles.navAnchor}>
                  {displayTitle}
                </a>
              );
            })}
          </div>
        </nav>

        <div className={styles.chartsStack}>
          {currentCharts.map((chart: WNChart) => {
            const displayTitle = chart.title.split(' - ')[0] || chart.chartKey;
            const numberOne = chart.entries?.[0];
            const runnersUp = chart.entries?.slice(1, 5) || [];
            
            // Safe image resolution
            const no1Art = numberOne?.manualTrack?.artwork?.url || '/images/default-track.jpg';

            return (
              <section key={chart.id} id={chart.chartKey} className={styles.chartSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{displayTitle}</h2>
                  <span className={styles.weekBadge}>WEEK {chart.week?.split('-W')[1]}</span>
                </div>

                <div className={styles.boardLayout}>
                  {/* Number 1 Highlight */}
                  {numberOne && (
                    <div className={styles.numberOneBlock}>
                      <div className={styles.no1ArtWrap}>
                        <Image 
                          src={no1Art} 
                          alt={numberOne.trackTitle} 
                          fill 
                          className={styles.no1Art} 
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className={styles.no1Rank}>1</div>
                      </div>
                      <div className={styles.no1Info}>
                        <div className={styles.no1Label}>#1 THIS WEEK</div>
                        <h3 className={styles.no1Title}>{numberOne.trackTitle}</h3>
                        <p className={styles.no1Artist}>{numberOne.artist}</p>
                      </div>
                    </div>
                  )}

                  {/* Top 5 List */}
                  <div className={styles.runnersUpBlock}>
                    <ul className={styles.ruList}>
                      {runnersUp.map((track: WNChartEntry) => (
                        <li key={track.id} className={styles.ruItem}>
                          <span className={styles.ruRank}>{track.rank}</span>
                          <div className={styles.ruText}>
                            <span className={styles.ruTitle}>{track.trackTitle}</span>
                            <span className={styles.ruArtist}>{track.artist}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/charts/${chart.slug}`} className={styles.viewFullBtn}>
                      VIEW FULL CHART <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <BackToTop />
    </div>
  );
}