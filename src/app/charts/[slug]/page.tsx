import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getChartBySlug, getChartById } from '@/services/charts.api';
import { getSpotifyArtwork } from '@/services/spotify.api';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Minus, 
  Sparkles, Flame, Rocket, Skull, Disc3, ChevronRight 
} from 'lucide-react';
import { BackToTop } from '@/components/ui/BackToTop/BackToTop';
import styles from './ChartDetail.module.css';

interface ChartEntryData {
  id: string;
  rank: number;
  previousRank: number | null;
  peakRank: number | null;
  weeksOnChart: number;
  movement: string | null;
  trackTitle: string;
  artist: string;
  jump?: number;
  manualTrack?: { artwork?: { url: string } };
  mediaAssets?: { artwork?: { url: string } };
}

export default async function ChartDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chart = await getChartBySlug(slug);
  if (!chart) notFound();

  const entries = (chart.entries as ChartEntryData[]) || [];
  
  // Only fetch artwork for the Top Track to save on API overhead and focus design
  const topTrack = entries.find(e => e.rank === 1);
  let topTrackArt = '/images/default-track.jpg';

  if (topTrack) {
    const cmsArt = topTrack.manualTrack?.artwork?.url || topTrack.mediaAssets?.artwork?.url;
    if (cmsArt) {
      topTrackArt = cmsArt.startsWith('http') ? cmsArt : `https://wavenation.media${cmsArt}`;
    } else {
      const spotifyArt = await getSpotifyArtwork(topTrack.trackTitle, topTrack.artist);
      if (spotifyArt) topTrackArt = spotifyArt;
    }
  }

  /* ACCOLADES LOGIC */
  let biggestGainer: ChartEntryData | null = null;
  let maxJump = 0;
  let highestDebut: ChartEntryData | null = null;
  const currentTrackKeys = new Set<string>();

  for (const entry of entries) {
    const key = `${entry.trackTitle}-${entry.artist}`.toLowerCase().trim();
    currentTrackKeys.add(key);
    if (entry.movement === 'up' && entry.previousRank) {
      const jump = entry.previousRank - entry.rank;
      if (jump > maxJump) { maxJump = jump; biggestGainer = { ...entry, jump }; }
    }
    if (entry.movement === 'new') {
      if (!highestDebut || entry.rank < (highestDebut.rank || 999)) highestDebut = entry;
    }
  }

  let prevChart = null;
  const prevChartId = typeof chart.previousChart === 'object' ? chart.previousChart?.id : chart.previousChart;
  if (prevChartId) prevChart = await getChartById(prevChartId as string);

  const droppedTracks = (prevChart?.entries as ChartEntryData[])?.filter((e) => {
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
          <Link href="/charts" className={styles.backLink}><ArrowLeft size={16} /> HUB</Link>
          <div className={styles.navMeta}>
             <span className={styles.statusStream}>DATA_MODE: BRUTALIST</span>
             {prevChart && (
                <Link href={`/charts/${prevChart.slug}`} className={styles.prevLink}>
                  LAST WEEK <ChevronRight size={14} />
                </Link>
             )}
          </div>
        </nav>

        <header className={styles.billboardHeader}>
          <div className={styles.headerInfo}>
            <span className={styles.categoryBadge}>{chart.chartKey?.replace(/-/g, ' ')}</span>
            <h1 className={styles.title}>{displayTitle}</h1>
            <p className={styles.dateRange}>
              {startDate ? startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : chart.week}
            </p>
          </div>
          {chart.playlist?.slug && (
            <Link href={`/playlists/${chart.playlist.slug}`} className={styles.playlistLink}>
              <Disc3 size={20} /> SYNC PLAYLIST
            </Link>
          )}
        </header>

        {/* --- HERO: NUMBER ONE TRACK --- */}
        {topTrack && (
          <section className={styles.heroSection}>
            <div className={styles.heroArtWrap}>
              <div className={styles.heroRank}>01</div>
              {topTrackArt.includes('scdn.co') ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={topTrackArt} alt="" className={styles.heroArt} />
              ) : (
                <Image src={topTrackArt} alt="" fill className={styles.heroArt} priority />
              )}
              <div className={styles.glitchOverlay} />
            </div>
            <div className={styles.heroMeta}>
              <div className={styles.heroLabel}><Flame size={18} /> CURRENT DOMINATOR</div>
              <h2 className={styles.heroTitle}>{topTrack.trackTitle}</h2>
              <p className={styles.heroArtist}>{topTrack.artist}</p>
              <div className={styles.heroStats}>
                <div className={styles.statBox}><span>PEAK</span> {topTrack.peakRank || 1}</div>
                <div className={styles.statBox}><span>WEEKS</span> {topTrack.weeksOnChart}</div>
              </div>
            </div>
          </section>
        )}

        {/* --- ACCOLADES --- */}
        <div className={styles.accoladesGrid}>
          <div className={styles.accCard}>
             <span className={styles.accType}>GAINER</span>
             <h3 className={styles.accName}>{biggestGainer?.trackTitle || '---'}</h3>
             <p className={styles.accVal}>+{biggestGainer?.jump || 0} POSITIONS</p>
          </div>
          <div className={styles.accCard}>
             <span className={styles.accType}>DEBUT</span>
             <h3 className={styles.accName}>{highestDebut?.trackTitle || '---'}</h3>
             <p className={styles.accVal}>ENTERED @ #{highestDebut?.rank || 0}</p>
          </div>
          <div className={styles.accCard}>
             <span className={styles.accType}>DROPPED</span>
             <h3 className={styles.accName}>{droppedTracks[0]?.trackTitle || 'NONE'}</h3>
             <p className={styles.accVal}>{droppedTracks.length} TRACKS EXIT</p>
          </div>
        </div>

        {/* --- THE MATRIX (TABLE) --- */}
        <section className={styles.tableWrap}>
          <div className={styles.tableHead}>
            <div className={styles.colRank}>#</div>
            <div className={styles.colMove}>+/-</div>
            <div className={styles.colTrack}>TRACK IDENTIFICATION</div>
            <div className={styles.colLW}>LW</div>
            <div className={styles.colPeak}>PK</div>
            <div className={styles.colWoc}>WKS</div>
          </div>

          <div className={styles.tableBody}>
            {entries.filter(e => e.rank > 1).map((entry) => (
              <div key={entry.id} className={styles.row}>
                <div className={styles.colRank}>{entry.rank < 10 ? `0${entry.rank}` : entry.rank}</div>
                
                <div className={styles.colMove}>
                  {entry.movement === 'up' && <TrendingUp size={16} className={styles.up}/>}
                  {entry.movement === 'down' && <TrendingDown size={16} className={styles.down}/>}
                  {entry.movement === 'new' && <Sparkles size={16} className={styles.new}/>}
                  {(entry.movement === 'same' || !entry.movement) && <Minus size={16} className={styles.same}/>}
                </div>

                <div className={styles.colTrack}>
                  <div className={styles.trackContent}>
                    <span className={styles.tTitle}>{entry.trackTitle}</span>
                    <span className={styles.tArtist}>{entry.artist}</span>
                  </div>
                </div>

                <div className={styles.colLW}>{entry.previousRank || '--'}</div>
                <div className={styles.colPeak}>{entry.peakRank || entry.rank}</div>
                <div className={styles.colWoc}>{entry.weeksOnChart}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BackToTop />
    </div>
  );
}