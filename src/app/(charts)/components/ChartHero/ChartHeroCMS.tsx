import { ChartHero } from './ChartHero'
import { getChartsByGenre } from '../../../lib/charts/getChartsByGenre'

type ChartHeroCMSProps = {
  chartKey: string
  variant?: 'home' | 'hitlist' | 'trending' | 'features' | 'methodology' | 'genre'
  eyebrow?: string
  title?: string
  description?: string
  metaLabel?: string
  className?: string
}

export async function ChartHeroCMS({
  chartKey,
  variant = 'genre',
  eyebrow,
  title,
  description,
  metaLabel,
  className,
}: ChartHeroCMSProps) {
  const docs = await getChartsByGenre(chartKey)
  const latestChart = docs[0]

  return (
    <ChartHero
      variant={variant}
      eyebrow={eyebrow}
      title={title}
      description={description}
      metaLabel={metaLabel}
      metaValue={latestChart?.week || 'Current week'}
      entries={latestChart?.entries ?? []}
      className={className}
    />
  )
}