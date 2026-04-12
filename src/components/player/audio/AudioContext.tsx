'use client'

import { createContext, useContext } from 'react'
import type { AudioState } from './audio.types'

export const AudioContext = createContext<AudioState | null>(null)

export function useAudio(): AudioState {
  const ctx = useContext(AudioContext)

  if (!ctx) {
    throw new Error('useAudio must be used within AudioProvider')
  }

  return ctx
}