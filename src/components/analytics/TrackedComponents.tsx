'use client'

import React, { useEffect } from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { trackEvent, trackPageView, AnalyticsEvent } from '@/lib/analytics'

/* -------------------------------------------------------------------------- */
/* 1. Page View Tracker (Drop this into your page.tsx)                        */
/* -------------------------------------------------------------------------- */
export function AnalyticsPageView() {
  const pathname = usePathname()
  
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname])

  return null
}

/* -------------------------------------------------------------------------- */
/* 2. Tracked Link Wrapper (Replaces <Link> where you need click tracking)    */
/* -------------------------------------------------------------------------- */
interface TrackedLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  eventName: AnalyticsEvent
  payload?: Record<string, unknown>
  children: React.ReactNode
}

export function TrackedLink({ eventName, payload, children, ...props }: TrackedLinkProps) {
  const handleClick = () => {
    trackEvent(eventName, payload)
  }

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. Tracked Newsletter Form                                                 */
/* -------------------------------------------------------------------------- */
export function TrackedNewsletterForm({ 
  formClass, inputClass, btnClass 
}: { 
  formClass: string; inputClass: string; btnClass: string; 
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent('newsletter_signup', { source: 'news_sidebar' })
    // Add your actual form submission logic here
  }

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <input type="email" placeholder="Email Address" required className={inputClass} />
      <button type="submit" className={btnClass}>Join</button>
    </form>
  )
}