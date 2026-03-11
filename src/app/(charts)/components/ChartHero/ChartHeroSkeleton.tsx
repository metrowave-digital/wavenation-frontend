import styles from './ChartHeroSkeleton.module.css'

type ChartHeroSkeletonProps = {
  className?: string
}

export function ChartHeroSkeleton({
  className,
}: ChartHeroSkeletonProps) {
  return (
    <section className={`${styles.hero} ${className ?? ''}`.trim()}>
      <div className={styles.backgroundGlowA} aria-hidden="true" />
      <div className={styles.backgroundGlowB} aria-hidden="true" />
      <div className={styles.backgroundGrid} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copyColumn}>
          <div className={styles.topline}>
            <span className={styles.eyebrow} />
            <span className={styles.toplineDot} />
            <span className={styles.toplineText} />
          </div>

          <div className={styles.titleBlock}>
            <span className={styles.titleLineLg} />
            <span className={styles.titleLineMd} />
          </div>

          <div className={styles.descriptionBlock}>
            <span className={styles.descriptionLine} />
            <span className={styles.descriptionLine} />
            <span className={styles.descriptionLineShort} />
          </div>

          <div className={styles.actions}>
            <span className={styles.actionPrimary} />
            <span className={styles.actionSecondary} />
          </div>
        </div>

        <div className={styles.chartColumn}>
          <div className={styles.metaStrip}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel} />
              <span className={styles.metaValue} />
            </div>

            <div className={styles.metaDivider} />

            <div className={styles.metaItem}>
              <span className={styles.metaLabel} />
              <span className={styles.metaValue} />
            </div>
          </div>

          <div className={styles.featuredCard}>
            <div className={styles.featuredRankWrap}>
              <span className={styles.featuredRankHash} />
              <span className={styles.featuredRank} />
            </div>

            <div className={styles.featuredContent}>
              <span className={styles.featuredKicker} />
              <span className={styles.featuredTitle} />
              <span className={styles.featuredArtist} />
              <span className={styles.featuredSummary} />
              <span className={styles.featuredSummaryShort} />
            </div>
          </div>

          <div className={styles.secondaryList}>
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className={styles.secondaryCard}>
                <div className={styles.secondaryRank} />
                <div className={styles.secondaryContent}>
                  <span className={styles.secondaryTitle} />
                  <span className={styles.secondaryArtist} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}