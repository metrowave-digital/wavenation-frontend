import Link from 'next/link';
import { getCharts, WNChart } from '@/services/charts.api';
import { Archive, ArrowLeft } from 'lucide-react';
import styles from './Archive.module.css';

export default async function ChartsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; year?: string; month?: string }>;
}) {
  const { genre, year, month } = await searchParams;
  
  // Create a filter string for Payload CMS
  let whereStr = `&where[_status][equals]=published`;
  if (genre) whereStr += `&where[chartKey][equals]=${genre}`;

  const response = await getCharts({ limit: 100, where: whereStr }); 
  
  // Cast docs to WNChart[] to avoid 'any' errors
  let archiveCharts: WNChart[] = (response.docs as WNChart[]) || [];

  // Manual filter for dates since Payload date querying can be tricky via simple REST
  if (year || month) {
    archiveCharts = archiveCharts.filter((c: WNChart) => {
      if (!c.weekRange?.startDate) return false;
      const d = new Date(c.weekRange.startDate);
      const matchesYear = year ? d.getFullYear().toString() === year : true;
      const matchesMonth = month ? (d.getMonth() + 1).toString() === month : true;
      return matchesYear && matchesMonth;
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        <nav className={styles.navRow}>
          <Link href="/charts" className={styles.backLink}><ArrowLeft size={16} /> CURRENT CHARTS</Link>
        </nav>

        <header className={styles.header}>
          <Archive size={40} className={styles.icon} />
          <h1>CHART ARCHIVE</h1>
        </header>

        {/* Pure HTML/Server Form Filter */}
        <form className={styles.filterForm} method="GET" action="/charts/archive">
          <div className={styles.filterGroup}>
            <label>GENRE</label>
            <select name="genre" defaultValue={genre || ''}>
              <option value="">All Genres</option>
              <option value="hitlist">The Hitlist</option>
              <option value="rnb-soul">R&B & Soul</option>
              <option value="hip-hop">Hip-Hop</option>
              <option value="southern-soul">Southern Soul</option>
              <option value="gospel">Gospel</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>YEAR</label>
            <select name="year" defaultValue={year || ''}>
              <option value="">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>MONTH</label>
            <select name="month" defaultValue={month || ''}>
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              {/* Add others */}
            </select>
          </div>

          <button type="submit" className={styles.filterBtn}>FILTER</button>
          { (genre || year || month) && <Link href="/charts/archive" className={styles.clearBtn}>CLEAR</Link>}
        </form>

        <div className={styles.results}>
          {archiveCharts.length === 0 ? (
            <p className={styles.noResults}>No charts found for this query.</p>
          ) : (
            archiveCharts.map((chart: WNChart) => {
               const date = chart.weekRange?.startDate ? new Date(chart.weekRange.startDate) : null;
               return (
                 <Link key={chart.id} href={`/charts/${chart.slug}`} className={styles.archiveRow}>
                   <div>
                     <span className={styles.rowTitle}>{chart.title.split(' - ')[0]}</span>
                     <span className={styles.rowWeek}>WEEK {chart.week?.split('-W')[1]}</span>
                   </div>
                   <div className={styles.rowDate}>
                     {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : ''}
                   </div>
                 </Link>
               );
            })
          )}
        </div>
      </main>
    </div>
  );
}