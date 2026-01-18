'use client'

import { useState } from 'react'
import styles from './Player.module.css'

import { PlayerInfo } from './PlayerInfo/PlayerInfo'
import { PlayerControls } from './PlayerControls/PlayerControls'
import { PlayerProgress } from './PlayerProgress/PlayerProgress'
import { PlayerActions } from './PlayerActions/PlayerActions'
import { PlayerPopup } from './PlayerPopup/PlayerPopup'

export function Player() {
  const [popupOpen, setPopupOpen] = useState(false)

  return (
    <>
      <div
        className={styles.player}
        role="region"
        aria-label="Audio player"
      >
        <div className={styles.texture} aria-hidden />

        {/* 1️⃣ INFO */}
        <div className={styles.info}>
          <PlayerInfo />
        </div>

        {/* 2️⃣ CONTROLS */}
        <div className={styles.controls}>
          <PlayerControls placement="sticky_player" />
        </div>

        {/* 3️⃣ PROGRESS */}
        <div className={styles.progress}>
          <PlayerProgress />
        </div>

        {/* 4️⃣ ACTIONS */}
        <div className={styles.actions}>
          <PlayerActions
            placement="sticky_player"
            onExpand={() => setPopupOpen(true)}
          />
        </div>
      </div>

      <PlayerPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </>
  )
}
