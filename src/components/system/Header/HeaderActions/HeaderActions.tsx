'use client'

import React from 'react'
import { Search, Bell, User } from 'lucide-react'
import styles from './HeaderActions.module.css'
import { useHeader } from '../Header.context'

export function HeaderActions() {
  const { setPopup } = useHeader()

  return (
    <div className={styles.container}>
      {/* Search Trigger */}
      <button 
        className={styles.actionBtn} 
        aria-label="Open search"
        onClick={() => setPopup('search')}
      >
        <Search size={18} />
      </button>

      {/* Notifications Trigger */}
      <button 
        className={styles.actionBtn} 
        aria-label="Notifications"
        onClick={() => setPopup('notification')} 
      >
        <span className={styles.indicator} />
        <Bell size={18} />
      </button>

      {/* Profile Trigger */}
      <button 
        className={styles.profileBtn} 
        aria-label="User profile"
        onClick={() => setPopup('profile')}
      >
        <User size={18} />
      </button>
    </div>
  )
}