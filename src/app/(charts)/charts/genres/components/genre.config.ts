// src/app/(charts)/charts/genres/components/genre.config.ts

export type GenreSlug =
  | 'rnb-soul'
  | 'hip-hop'
  | 'southern-soul'
  | 'gospel'
  | 'house'

export type GenreConfig = {
  slug: GenreSlug
  title: string
  shortTitle: string
  description: string
  eyebrow: string
}

export const GENRE_CONFIG: Record<GenreSlug, GenreConfig> = {
  'rnb-soul': {
    slug: 'rnb-soul',
    title: 'R&B / Soul',
    shortTitle: 'R&B / Soul',
    eyebrow: 'Genre chart',
    description:
      'A weekly look at the records shaping the R&B and soul conversation across audience energy, editorial attention, and cultural movement.',
  },
  'hip-hop': {
    slug: 'hip-hop',
    title: 'Hip-Hop',
    shortTitle: 'Hip-Hop',
    eyebrow: 'Genre chart',
    description:
      'A focused weekly ranking of the records pushing hip-hop culture, momentum, and conversation right now.',
  },
  'southern-soul': {
    slug: 'southern-soul',
    title: 'Southern Soul',
    shortTitle: 'Southern Soul',
    eyebrow: 'Genre chart',
    description:
      'A weekly chart dedicated to the songs carrying Southern Soul’s audience loyalty, regional energy, and cross-generational impact.',
  },
  gospel: {
    slug: 'gospel',
    title: 'Gospel',
    shortTitle: 'Gospel',
    eyebrow: 'Genre chart',
    description:
      'A weekly ranking of the songs and voices moving gospel listeners, praise spaces, and faith-centered culture.',
  },
  house: {
    slug: 'house',
    title: 'House',
    shortTitle: 'House',
    eyebrow: 'Genre chart',
    description:
      'A weekly look at the house records creating energy, movement, and community across clubs, culture, and discovery.',
  },
}

export const ALL_GENRES = Object.values(GENRE_CONFIG)

export function isGenreSlug(value: string): value is GenreSlug {
  return value in GENRE_CONFIG
}

export function getGenreConfig(value: string) {
  if (!isGenreSlug(value)) return null
  return GENRE_CONFIG[value]
}