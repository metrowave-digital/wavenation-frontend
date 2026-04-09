import type {
  RadioScheduleItem,
  RadioShowMeta, // Updated from ScheduleNowPayload
} from './audio.types'

/**
 * Normalizes artwork specifically for the schedule/CMS payloads.
 */
export function normalizeScheduleArtwork(
  artwork: string | { url?: string | null } | null | undefined
): string | null {
  if (!artwork) return null
  if (typeof artwork === 'string') return artwork.trim() || null
  if (typeof artwork === 'object' && artwork.url) return artwork.url.trim() || null
  return null
}

export function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime())
}

/**
 * Checks if a specific schedule item is currently "On Air".
 */
export function isShowLiveAtTime(
  item: RadioScheduleItem,
  now = new Date()
): boolean {
  if (!item.startTime || !item.endTime) return false

  const start = new Date(item.startTime)
  const end = new Date(item.endTime)

  if (!isValidDate(start) || !isValidDate(end)) return false

  return now >= start && now <= end
}

/**
 * Finds the show currently occupying the airwaves.
 */
export function findCurrentShow(
  items: RadioScheduleItem[] | null | undefined,
  now = new Date()
): RadioScheduleItem | null {
  if (!Array.isArray(items) || items.length === 0) return null
  return items.find((item) => isShowLiveAtTime(item, now)) ?? null
}

/**
 * Maps a raw CMS schedule item to our clean, internal UI metadata.
 */
export function mapScheduleItemToNowShow(
  item: RadioScheduleItem | null
): RadioShowMeta | null {
  if (!item) return null

  return {
    title: item.title ?? 'WaveNation Live',
    hosts: item.hosts ?? null,
    startTime: item.startTime ?? null,
    endTime: item.endTime ?? null,
    artwork: normalizeScheduleArtwork(item.artwork),
    description: item.description ?? null,
  }
}

/**
 * Safely extracts schedule arrays from common CMS "docs" structures.
 */
export function extractScheduleDocsPayload(
  payload: unknown
): RadioScheduleItem[] {
  if (
    payload &&
    typeof payload === 'object' &&
    'docs' in payload &&
    Array.isArray((payload as { docs: unknown }).docs)
  ) {
    return (payload as { docs: RadioScheduleItem[] }).docs
  }

  return []
}