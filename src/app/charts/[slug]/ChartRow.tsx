'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import styles from './ChartDetail.module.css';

// Updated interface with ALL necessary properties
export interface ChartEntryData {
  id: string;
  rank: number;
  previousRank: number | null;
  peakRank: number | null;
  weeksOnChart: number;
  movement: string | null;
  trackTitle: string;
  artist: string;
  jump?: number; // Added
  manualTrack?: { artwork?: { url: string } }; // Added
  mediaAssets?: { artwork?: { url: string } }; // Added
}

export function ChartRow({ entry }: { entry: ChartEntryData }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => setIsHighlighted(e.isIntersecting),
      { rootMargin: '-30% 0px -30% 0px', threshold: 0 }
    );

    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rowRef} className={`${styles.row} ${isHighlighted ? styles.rowActive : ''}`}>
      <div className={styles.colRank}>
        {entry.rank < 10 ? `0${entry.rank}` : entry.rank}
      </div>
      
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
  );
}