'use client'

import { useEffect } from 'react'
import { SCHEDULE_POLL_MS } from './audio.constants'
import {
  extractScheduleDocsPayload,
  findCurrentShow,
  mapScheduleItemToNowShow,
} from './audio.schedule'
import type { ScheduleNowPayload } from './audio.types'

type UseSchedulePollerArgs = {
  scheduleUrl: string
  onChange: (next: ScheduleNowPayload | null) => void
  onError?: (message: string | null) => void
}

export function useSchedulePoller({
  scheduleUrl,
  onChange,
  onError,
}: UseSchedulePollerArgs) {
  useEffect(() => {
    let alive = true
    let timerId: number | null = null

    const fetchNowShow = async () => {
      try {
        const res = await fetch(scheduleUrl, {
          cache: 'no-store',
        })

        if (!res.ok) {
          onError?.(`schedule_http_${res.status}`)
          return
        }

        const payload = await res.json()
        if (!alive) return

        const docs = extractScheduleDocsPayload(payload)
        const current = findCurrentShow(docs)
        const mapped = mapScheduleItemToNowShow(current)

        onChange(mapped)
        onError?.(null)
      } catch {
        onError?.('schedule_fetch_failed')
      }
    }

    void fetchNowShow()
    timerId = window.setInterval(fetchNowShow, SCHEDULE_POLL_MS)

    return () => {
      alive = false
      if (timerId != null) {
        window.clearInterval(timerId)
      }
    }
  }, [onChange, onError, scheduleUrl])
}