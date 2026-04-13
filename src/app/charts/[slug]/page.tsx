import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getChartBySlug, getChartById } from '@/services/charts.api';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Sparkles, Flame, Rocket, Skull, Disc3 } from 'lucide-react';
import { BackToTop } from '@/components/ui/BackToTop/BackToTop';
import styles from './ChartDetail.module.css';

// 1. Define the internal interface for chart entries
interface ChartEntryData {
  id: string;
  rank: number;
  previousRank: number | null;
  peakRank: number | null;
  weeksOnChart: number;
  movement: string | null;
  trackTitle: string;
  artist: string;
  jump?: number; // Used for biggestGainer calculations
  manualTrack?: {
    artwork?: { url: string };
  };
}

export default async function ChartDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chart = await getChartBySlug(slug);
  if (!chart) notFound();

  // Fetch Previous Chart to calculate Dropped Tracks
  let prevChart = null;
  const prevChartId = typeof chart.previousChart === 'object' ? chart.previousChart?.id : chart.previousChart;
  
  if (prevChartId) {
    prevChart = await getChartById(prevChartId as string);
  }

  // 2. State variables for accolades
  let biggestGainer: ChartEntryData | null = null;
  let maxJump = 0;
  let highestDebut: ChartEntryData | null = null;

  const currentTrackKeys = new Set<string>();

  // 3. Process the current chart entries
  for (const entry of (chart.entries as ChartEntryData[])) {
    const key = `${entry.trackTitle}-${entry.artist}`.toLowerCase().trim();
    currentTrackKeys.add(key);

    // Biggest Gainer Logic
    if (entry.movement === 'up' && entry.previousRank) {
      const jump = entry.previousRank - entry.rank;
      if (jump > maxJump) { 
        maxJump = jump; 
        biggestGainer = { ...entry, jump }; 
      }
    }
    // Highest Debut Logic
    if (entry.movement === 'new') {
      if (!highestDebut || entry.rank < (highestDebut.rank || 999)) {
        highestDebut = entry;
      }
    }
  }

  // 4. Calculate Dropped Tracks (Typing fixed here)
  const droppedTracks = (prevChart?.entries as ChartEntryData[])?.filter((e: ChartEntryData) => {
    const key = `${e.trackTitle}-${e.artist}`.toLowerCase().trim();
    return !currentTrackKeys.has(key);
  }) || [];

  const displayTitle = chart.title.split(' - ')[0] || chart.chartKey;
  const startDate = chart.weekRange?.startDate ? new Date(chart.weekRange.startDate) : null;

  return (
    <div className={styles.page}>
      <div className={styles.textureOverlay} />
      
      <main className={styles.main}>
        <nav className={styles.navRow}>
          <Link href="/charts" className={styles.backLink}><ArrowLeft size={16} /> ALL CHARTS</Link>
          {prevChart && (
            <Link href={`/charts/${prevChart.slug}`} className={styles.prevLink}>PREVIOUS WEEK &rarr;</Link>
          )}
        </nav>

        <header className={styles.billboardHeader}>
          <h1 className={styles.title}>{displayTitle}</h1>
          <p className={styles.dateRange}>
            WEEK OF {startDate ? startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : chart.week}
          </p>
          {chart.playlist?.slug && (
              <Link href={`/playlists/${chart.playlist.slug}`} className={styles.playlistLink}>
                <Disc3 size={18} /> STREAM THE PLAYLIST
              </Link>
          )}
        </header>

        {/* --- ACCOLADES GRID --- */}
        <div className={styles.accoladesGrid}>
          {biggestGainer ? (
            <div className={styles.accoladeCard}>
              <div className={styles.accHeader}><Flame size={16}/> BIGGEST GAINER (+{biggestGainer.jump})</div>
              <div className={styles.accTrack}>{biggestGainer.trackTitle}</div>
              <div className={styles.accArtist}>{biggestGainer.artist}</div>
            </div>
          ) : (
            <div className={styles.accoladeCardEmpty}>NO MAJOR GAINS</div>
          )}

          {highestDebut ? (
            <div className={styles.accoladeCard}>
              <div className={styles.accHeader}><Rocket size={16}/> HIGHEST DEBUT (No. {highestDebut.rank})</div>
              <div className={styles.accTrack}>{highestDebut.trackTitle}</div>
              <div className={styles.accArtist}>{highestDebut.artist}</div>
            </div>
          ) : (
            <div className={styles.accoladeCardEmpty}>NO DEBUTS</div>
          )}

          <div className={`${styles.accoladeCard} ${styles.droppedCard}`}>
            <div className={styles.accHeader}><Skull size={16}/> FELL OFF CHART</div>
            {droppedTracks.length > 0 ? (
              <div className={styles.droppedList}>
                {droppedTracks.slice(0, 3).map((t: ChartEntryData) => (
                  <span key={t.id} className={styles.droppedItem}>{t.trackTitle} <span className={styles.dropRank}>(was #{t.rank})</span></span>
                ))}
                {droppedTracks.length > 3 && <span className={styles.dropMore}>+ {droppedTracks.length - 3} more tracks dropped</span>}
              </div>
            ) : (
              <div className={styles.accArtist}>NO TRACKS DROPPED</div>
            )}
          </div>
        </div>

        {/* --- COMPARISON TABLE --- */}
        <section className={styles.tableWrap}>
          <div className={styles.tableHead}>
            <div className={styles.colRank}>TW</div>
            <div className={styles.colLW}>LW</div>
            <div className={styles.colTrack}>TRACK / ARTIST</div>
            <div className={styles.colStats}>PEAK</div>
            <div className={styles.colStats}>WOC</div>
          </div>

          <div className={styles.tableBody}>
            {(chart.entries as ChartEntryData[]).map((entry: ChartEntryData) => {
              const isNo1 = entry.rank === 1;
              const artUrl = entry.manualTrack?.artwork?.url || '/images/default-track.jpg';

              return (
                <div key={entry.id} className={`${styles.row} ${isNo1 ? styles.rowNo1 : ''}`}>
                  <div className={styles.colRank}>
                    <span className={styles.rankText}>{entry.rank}</span>
                  </div>
                  
                  <div className={styles.colLW}>
                    <span className={styles.lwText}>{entry.previousRank || '-'}</span>
                    <div className={styles.moveInd}>
                      {entry.movement === 'up' && <TrendingUp size={14} className={styles.up}/>}
                      {entry.movement === 'down' && <TrendingDown size={14} className={styles.down}/>}
                      {entry.movement === 'new' && <Sparkles size={14} className={styles.new}/>}
                      {(entry.movement === 'same' || !entry.movement) && <Minus size={14} className={styles.same}/>}
                    </div>
                  </div>

                  <div className={styles.colTrack}>
                    <div className={styles.artBox}><Image src={artUrl} alt="" fill className={styles.artImg}/></div>
                    <div className={styles.trackMeta}>
                      <span className={styles.tTitle}>{entry.trackTitle}</span>
                      <span className={styles.tArtist}>{entry.artist}</span>
                    </div>
                  </div>

                  <div className={styles.colStats}>{entry.peakRank || '-'}</div>
                  <div className={styles.colStats}>{entry.weeksOnChart}</div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BackToTop />
    </div>
  );
}