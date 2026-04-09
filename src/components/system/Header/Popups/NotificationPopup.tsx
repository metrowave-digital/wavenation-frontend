'use client'

import { useEffect, useRef } from 'react'
import { X, CheckCircle2, Radio, Music4, Sparkles } from 'lucide-react'
import { useHeader } from '../Header.context'
import styles from './NotificationPopup.module.css'

// Mock Data for the broadcast network
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'live',
    title: 'WaveNation FM is Live',
    desc: 'DJ K-FLOW just started The Southern Beat. Tune in now.',
    time: 'Just now',
    unread: true,
    icon: Radio,
    accent: '#ef4444' // Magenta pulse
  },
  {
    id: 2,
    type: 'music',
    title: 'New Drop: Midnight Silk',
    desc: 'Your favorite R&B playlist just got refreshed with 20 new tracks.',
    time: '2h ago',
    unread: true,
    icon: Music4,
    accent: '#00FFFF' // Electric Blue
  },
  {
    id: 3,
    type: 'system',
    title: 'Welcome to WaveNation+',
    desc: 'Your premium benefits are now active. Enjoy ad-free listening and exclusive drops.',
    time: '1d ago',
    unread: false,
    icon: Sparkles,
    accent: '#39FF14' // Neon Green
  }
]

export function NotificationPopup() {
  const { setPopup, isNotificationOpen } = useHeader() // Make sure you added isNotificationOpen to context!
  const panelRef = useRef<HTMLDivElement | null>(null)

  /* ---------------------------------------------
     Close on ESC
  ---------------------------------------------- */
  useEffect(() => {
    if (!isNotificationOpen) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setPopup(null)
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isNotificationOpen, setPopup])

  if (!isNotificationOpen) return null

  const closeMenu = () => setPopup(null)

  return (
    <div
      className={styles.overlay}
      onClick={closeMenu}
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <div
        ref={panelRef}
        className={styles.panel}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <span className={styles.brandText}>NOTIFICATIONS</span>
            <span className={styles.badge}>2 New</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={closeMenu}
            aria-label="Close notifications"
          >
            <X size={24} />
          </button>
        </div>

        {/* MARK ALL READ ACTION */}
        <div className={styles.actionsBar}>
          <button className={styles.markReadBtn}>
            <CheckCircle2 size={14} />
            Mark all as read
          </button>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className={styles.content}>
          {MOCK_NOTIFICATIONS.length > 0 ? (
            <ul className={styles.list}>
              {MOCK_NOTIFICATIONS.map(notif => (
                <li 
                  key={notif.id} 
                  className={`${styles.item} ${notif.unread ? styles.itemUnread : ''}`}
                >
                  <div 
                    className={styles.iconWrapper}
                    style={{ 
                      backgroundColor: `${notif.accent}15`, // 15% opacity background
                      color: notif.accent,
                      borderColor: `${notif.accent}40` // 40% opacity border
                    }}
                  >
                    <notif.icon size={18} />
                  </div>
                  
                  <div className={styles.itemContent}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemTitle}>{notif.title}</span>
                      <span className={styles.itemTime}>{notif.time}</span>
                    </div>
                    <p className={styles.itemDesc}>{notif.desc}</p>
                  </div>

                  {notif.unread && <div className={styles.unreadDot} />}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <p>You are all caught up.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}