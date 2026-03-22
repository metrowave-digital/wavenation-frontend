import type {
  RadioScheduleItem,
  ScheduleNowPayload,
} from './audio.types'

export function normalizeScheduleArtwork(
  artwork: string | { url?: string | null } | null | undefined
): string | null {
  if (!artwork) return null
  if (typeof artwork === 'string') return artwork
  if (typeof artwork === 'object' && artwork.url) return artwork.url
  return null
}

export function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime())
}

export function isShowLiveAtTime(
  item: RadioScheduleItem,
  now = new Date()
): boolean {
  if (!item.startTime || !item.endTime) return false

  const start = new Date(item.startTime)
  const end = new Date(item.endTime)

  if (!isValidDate(start) || !isValidDate(end)) {
    return false
  }

  return now >= start && now <= end
}

export function findCurrentShow(
  items: RadioScheduleItem[] | null | undefined,
  now = new Date()
): RadioScheduleItem | null {
  if (!Array.isArray(items) || items.length === 0) return null

  return items.find((item) => isShowLiveAtTime(item, now)) ?? null
}

export function mapScheduleItemToNowShow(
  item: RadioScheduleItem | null
): ScheduleNowPayload | null {
  if (!item) return null

  return {
    showTitle: item.title ?? 'WaveNation Live',
    hosts: item.hosts ?? '',
    startTime: item.startTime ?? null,
    endTime: item.endTime ?? null,
    artwork: normalizeScheduleArtwork(item.artwork),
    description: item.description ?? null,
  }
}

export function extractScheduleDocsPayload(
  payload: unknown
): RadioScheduleItem[] {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'docs' in payload &&
    Array.isArray((payload as { docs?: unknown }).docs)
  ) {
    return (payload as { docs: RadioScheduleItem[] }).docs
  }

  return []
}