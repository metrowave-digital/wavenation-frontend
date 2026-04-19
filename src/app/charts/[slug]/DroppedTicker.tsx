'use client';

import React, { useState, useEffect } from 'react';
import { ChartEntryData } from './ChartRow';
import styles from './ChartDetail.module.css';

export function DroppedTicker({ tracks }: { tracks: ChartEntryData[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (tracks.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % tracks.length);
    }, 3000); // Changes every 3 seconds

    return () => clearInterval(interval);
  }, [tracks.length]);

  if (tracks.length === 0) {
    return <div className={styles.droppedTrack}>NONE</div>;
  }

  return (
    <div className={styles.tickerContainer}>
      {tracks.map((track, i) => (
        <div
          key={track.id}
          className={`${styles.tickerItem} ${i === index ? styles.tickerActive : ''}`}
        >
          <span className={styles.droppedTitle}>{track.trackTitle}</span>
          <span className={styles.droppedArtist}>{track.artist}</span>
        </div>
      ))}
    </div>
  );
}