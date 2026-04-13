import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPlaylistBySlug } from '@/services/playlists.api';
import { ArrowLeft, Radio, Calendar, User, Hash } from 'lucide-react';
import styles from './PlaylistDetail.module.css';

// --- TYPE DEFINITIONS ---
interface DSPIntegration {
  provider: string;
  platformId: string;
  id?: string;
  publicUrl?: string;
}

interface Mood {
  id: string | number;
  name: string;
  slug?: string;
}

// Defining the main playlist structure to ensure type safety throughout
interface Playlist {
  title: string;
  description?: string;
  playlistType?: string;
  publishDate?: string;
  coverImage?: {
    url: string;
    sizes?: {
      square?: { url: string };
      thumb?: { url: string };
    };
  };
  curator?: {
    displayName: string;
    avatar?: {
      url: string;
      sizes?: {
        thumb?: { url: string };
      };
    };
  };
  dspIntegrations?: DSPIntegration[];
  moods?: Mood[];
}

export default async function PlaylistDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const playlist = await getPlaylistBySlug(slug) as Playlist | null;

  if (!playlist) notFound();

  // --- API MAPPING ---
  // FIXED: Replaced 'any' with DSPIntegration interface
  const spotifyData = playlist.dspIntegrations?.find((dsp: DSPIntegration) => dsp.provider === 'spotify');
  const spotifyPlaylistId = spotifyData?.platformId;

  // Extract Cover Image
  const coverUrl = playlist.coverImage?.sizes?.square?.url 
    || playlist.coverImage?.url 
    || '/images/fallback-square.jpg';

  // Extract Curator Data
  const curatorName = playlist.curator?.displayName || 'WaveNation Team';
  const curatorAvatar = playlist.curator?.avatar?.sizes?.thumb?.url 
    || playlist.curator?.avatar?.url 
    || '/images/wavenation-avatar.png';
    
  const publishDate = playlist.publishDate ? new Date(playlist.publishDate) : null;

  return (
    <div className={styles.page}>
      {/* Background Texture */}
      <div className={styles.textureOverlay} />
      
      <main className={styles.container}>
        {/* Top Nav */}
        <nav className={styles.navRow}>
          <Link href="/playlists" className={styles.backLink}>
            <ArrowLeft size={16} /> RETURN TO HUB
          </Link>
          <div className={styles.statusIndicator}>
            <span className={styles.pulseDot} />
            LIVE SIGNAL
          </div>
        </nav>

        <div className={styles.studioLayout}>
          
          {/* LEFT PANEL: Sticky Metadata & Cover Art */}
          <aside className={styles.leftPanel}>
            <div className={styles.stickyContent}>
              <div className={styles.artworkWrapper}>
                <Image 
                  src={coverUrl} 
                  alt={playlist.title} 
                  fill 
                  className={styles.coverImage} 
                  priority
                />
                <div className={styles.artworkOverlay} />
              </div>

              <div className={styles.primaryMeta}>
                <span className={styles.typeTag}>{playlist.playlistType || 'PLAYLIST'}</span>
                <h1 className={styles.title}>{playlist.title}</h1>
              </div>

              <div className={styles.dataGrid}>
                {/* Curator Block */}
                <div className={styles.dataRow}>
                  <div className={styles.dataLabel}><User size={14} /> CURATOR</div>
                  <div className={styles.dataValue}>
                    <Image 
                      src={curatorAvatar} 
                      alt={curatorName} 
                      width={20} 
                      height={20} 
                      className={styles.avatarImg}
                    />
                    {curatorName}
                  </div>
                </div>

                {/* Date Block */}
                {publishDate && (
                  <div className={styles.dataRow}>
                    <div className={styles.dataLabel}><Calendar size={14} /> DROPPED</div>
                    <div className={styles.dataValue}>
                      {publishDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                    </div>
                  </div>
                )}

                {/* Track Count Block */}
                <div className={styles.dataRow}>
                  <div className={styles.dataLabel}><Radio size={14} /> SYSTEM</div>
                  <div className={styles.dataValue}>
                    {spotifyPlaylistId ? 'Spotify Active' : 'Offline'}
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* RIGHT PANEL: Player & Description */}
          <section className={styles.rightPanel}>
            
            {/* Description Block */}
            <div className={styles.infoBlock}>
              <h2 className={styles.blockHeader}>TRANSMISSION_DETAILS</h2>
              <p className={styles.description}>{playlist.description}</p>
              
              {playlist.moods && playlist.moods.length > 0 && (
                <div className={styles.moodsList}>
                  {/* FIXED: Replaced 'any' with Mood interface */}
                  {playlist.moods.map((mood: Mood) => (
                    <span key={mood.id} className={styles.moodBadge}>
                      <Hash size={12} className={styles.hashIcon}/> {mood.name.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Spotify Player Block */}
            <div className={styles.playerBlock}>
              {spotifyPlaylistId ? (
                <div className={styles.iframeContainer}>
                  <iframe 
                    // FIXED: Corrected template literal syntax from 1{...} to ${...}
                    src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?utm_source=generator&theme=0`} 
                    width="100%" 
                    height="600" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className={styles.spotifyIframe}
                  />
                </div>
              ) : (
                <div className={styles.missingSignal}>
                  <div className={styles.missingLines} />
                  <p>DSP SYNCHRONIZATION UNAVAILABLE</p>
                </div>
              )}
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}