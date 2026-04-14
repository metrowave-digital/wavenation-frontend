import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCharts, WNChart, WNChartEntry } from '@/services/charts.api';
import { BarChart2, ArrowRight } from 'lucide-react';
import { BackToTop } from '@/components/ui/BackToTop/BackToTop';
import styles from './ChartsHub.module.css';

// 1. Define the exact order for the charts
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
  
  // Filter for only published charts
  const publishedCharts = (response.docs as WNChart[] || []).filter(
    (c: WNChart) => c._status === 'published' || c.status === 'published'
  );

  // Deduplicate charts to only show the latest week for each category
  const latestChartsMap = new Map<string, WNChart>();
  for (const chart of publishedCharts) {
    if (!latestChartsMap.has(chart.chartKey)) {
      latestChartsMap.set(chart.chartKey, chart);
    }
  }
  
  // Extract and Sort based on your exact CHART_ORDER array
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
          {currentCharts.map((chart: WNChart, index: number) => {
            const displayTitle = chart.title.split(' - ')[0] || chart.chartKey;
            const numberOne = chart.entries?.[0];
            const runnersUp = chart.entries?.slice(1, 5) || [];
            
            // --- BULLETPROOF IMAGE RESOLVER ---
            const rawArtUrl = numberOne?.manualTrack?.artwork?.url;
            const no1Art = rawArtUrl?.startsWith('http') 
              ? rawArtUrl 
              : rawArtUrl 
                ? `https://wavenation.media${rawArtUrl}` 
                : '/images/default-track.jpg'; // Ensure this exists in your public/images folder

            // Flag to check if the image belongs to a Spotify CDN
            const isSpotifyImage = no1Art.includes('scdn.co') || no1Art.includes('spotifycdn.com');

            return (
              <React.Fragment key={chart.id}>
                <section id={chart.chartKey} className={styles.chartSection}>
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
                            alt={numberOne.trackTitle || 'Track Artwork'} 
                            fill 
                            className={styles.no1Art} 
                            sizes="(max-width: 768px) 100vw, 50vw"
                            // Bypasses deployment image optimization failures for external Spotify images
                            unoptimized={isSpotifyImage} 
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

                {/* --- Cinematic Separator (Hidden on the very last chart) --- */}
                {index < currentCharts.length - 1 && (
                  <div className={styles.chartSeparator} aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </main>

      <BackToTop />
    </div>
  );
}