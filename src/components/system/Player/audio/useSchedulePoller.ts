'use client'

import { useEffect } from 'react'
import { SCHEDULE_POLL_MS } from './audio.constants'
import {
  extractScheduleDocsPayload,
  findCurrentShow,
  mapScheduleItemToNowShow,
} from './audio.schedule'
import type { RadioShowMeta } from './audio.types'

type UseSchedulePollerArgs = {
  scheduleUrl: string
  onChange: (next: RadioShowMeta | null) => void
  onError?: (message: string | null) => void
}

export function useSchedulePoller({
  scheduleUrl,
  onChange,
  onError,
}: UseSchedulePollerArgs) {
  useEffect(() => {
    const abortController = new AbortController()
    
    const fetchNowShow = async () => {
      try {
        const res = await fetch(scheduleUrl, {
          cache: 'no-store',
          signal: abortController.signal
        })

        if (!res.ok) {
          onError?.(`schedule_http_${res.status}`)
          return
        }

        const payload = await res.json()
        const docs = extractScheduleDocsPayload(payload)
        const current = findCurrentShow(docs)
        const mapped = mapScheduleItemToNowShow(current)

        onChange(mapped)
        onError?.(null)
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          onError?.('schedule_fetch_failed')
        }
      }
    }

    fetchNowShow()
    const timerId = setInterval(fetchNowShow, SCHEDULE_POLL_MS)

    return () => {
      clearInterval(timerId)
      abortController.abort()
    }
  }, [onChange, onError, scheduleUrl])
}