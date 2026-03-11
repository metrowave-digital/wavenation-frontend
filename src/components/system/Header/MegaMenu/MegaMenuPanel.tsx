'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'

import type { MainNavItem, NavItem } from '../nav/nav.types'
import {
  countDestinations,
  getDefaultSectionHref,
  getFeaturedSeed,
  getFirstHref,
  getItemKey,
  hasChildren,
  hasHref,
} from '../nav/nav.types'
import styles from './MegaMenuPanel.module.css'
import { trackEvent } from '@/lib/analytics'

type FeaturedCard = {
  id?: string | number
  href: string
  title: string
  description?: string | null
  eyebrow?: string | null
  image?: {
    url?: string | null
    alt?: string | null
  } | null
}

interface Props {
  item: MainNavItem
  onNavigate?: () => void
}

function renderLeafLink({
  item,
  sectionId,
  parentLabel,
  className,
  labelClassName,
  badgeClassName,
  onNavigate,
}: {
  item: NavItem
  sectionId: string
  parentLabel?: string
  className: string
  labelClassName: string
  badgeClassName: string
  onNavigate?: () => void
}) {
  if (!hasHref(item)) {
    return (
      <div className={clsx(className, styles.disabledLink)} aria-disabled="true">
        <span className={labelClassName}>{item.label}</span>
        {item.badge ? <span className={badgeClassName}>{item.badge}</span> : null}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={className}
      data-megamenu-item
      onClick={() => {
        trackEvent('navigation_click', {
          component: 'mega_menu',
          section: sectionId,
          parent: parentLabel,
          label: item.label,
          href: item.href,
        })
        onNavigate?.()
      }}
    >
      <span className={labelClassName}>{item.label}</span>
      {item.badge ? <span className={badgeClassName}>{item.badge}</span> : null}
    </Link>
  )
}

function getGroupHref(group: NavItem): string {
  if (hasHref(group)) return group.href
  return getFirstHref(group.children) ?? '#'
}

export function MegaMenuPanel({ item, onNavigate }: Props) {
  const [featured, setFeatured] = useState<FeaturedCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadFeatured() {
      try {
        setLoading(true)

        const response = await fetch(
          `/api/menu-featured?context=${encodeURIComponent(item.id)}`,
          { cache: 'no-store' }
        )

        if (!response.ok) {
          throw new Error('Failed to load featured stories')
        }

        const json = (await response.json()) as FeaturedCard[]

        if (mounted) {
          setFeatured(Array.isArray(json) ? json : [])
        }
      } catch {
        if (mounted) {
          setFeatured([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadFeatured()

    return () => {
      mounted = false
    }
  }, [item.id])

  const totalLinks = useMemo(() => countDestinations(item.children), [item.children])

  const sectionHref = useMemo(() => {
    return getFirstHref(item.children) ?? getDefaultSectionHref(item)
  }, [item])

  const featuredSeed = useMemo(() => getFeaturedSeed(item), [item])

  const hero = featured[0] ?? null
  const supportingCards = featured.slice(1, 4)
  const featureStripGroups = item.children?.slice(0, 3) ?? []

  return (
    <section className={styles.panel}>
      <aside className={styles.rail}>
        <div className={styles.eyebrow}>WaveNation</div>

        <div className={styles.sectionTop}>
          {item.icon ? <item.icon size={18} className={styles.sectionIcon} aria-hidden /> : null}
          <span className={styles.sectionId}>{item.id.toUpperCase()}</span>
        </div>

        <h2 className={styles.title}>{item.label}</h2>

        <p className={styles.description}>
          {item.description ?? 'Explore featured destinations, stories, and category hubs.'}
        </p>

        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Destinations</span>
            <span className={styles.statValue}>{totalLinks}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Featured</span>
            <span className={styles.statValue}>{loading ? '…' : featured.length}</span>
          </div>
        </div>

        <Link
          href={sectionHref}
          className={styles.primaryCta}
          data-megamenu-item
          onClick={() => {
            trackEvent('navigation_click', {
              component: 'mega_menu',
              section: item.id,
              label: `View ${item.label}`,
              href: sectionHref,
            })
            onNavigate?.()
          }}
        >
          View section
        </Link>

        {featuredSeed ? (
          <div className={styles.seedCard} data-accent={featuredSeed.accent ?? 'blue'}>
            <span className={styles.seedEyebrow}>{featuredSeed.eyebrow}</span>

            <div className={styles.seedTitle}>{featuredSeed.title}</div>

            <p className={styles.seedDescription}>{featuredSeed.description}</p>

            {featuredSeed.href !== '#' ? (
              <Link
                href={featuredSeed.href}
                className={styles.seedLink}
                data-megamenu-item
                onClick={() => {
                  trackEvent('navigation_click', {
                    component: 'mega_menu',
                    section: item.id,
                    label: featuredSeed.title,
                    href: featuredSeed.href,
                  })
                  onNavigate?.()
                }}
              >
                Explore feature
              </Link>
            ) : null}
          </div>
        ) : null}
      </aside>

      <nav className={styles.columns} aria-label={`${item.label} navigation`}>
        {featureStripGroups.length > 0 ? (
          <div className={styles.featureStrip}>
            {featureStripGroups.map((group, index) => {
              const href = getGroupHref(group)

              if (href !== '#') {
                return (
                  <Link
                    key={`feature-${getItemKey(group, index)}`}
                    href={href}
                    className={styles.featureStripCard}
                    data-megamenu-item
                    onClick={() => {
                      trackEvent('navigation_click', {
                        component: 'mega_menu',
                        section: item.id,
                        label: group.label,
                        href,
                      })
                      onNavigate?.()
                    }}
                  >
                    <span className={styles.featureStripEyebrow}>Explore</span>
                    <div className={styles.featureStripTitle}>{group.label}</div>
                    {group.description ? (
                      <p className={styles.featureStripDesc}>{group.description}</p>
                    ) : null}
                  </Link>
                )
              }

              return (
                <div
                  key={`feature-${getItemKey(group, index)}`}
                  className={styles.featureStripCard}
                >
                  <span className={styles.featureStripEyebrow}>Explore</span>
                  <div className={styles.featureStripTitle}>{group.label}</div>
                  {group.description ? (
                    <p className={styles.featureStripDesc}>{group.description}</p>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : null}

        <div className={styles.columnGrid}>
          {item.children?.map((group, index) => (
            <section key={getItemKey(group, index)} className={styles.column}>
              <div className={styles.columnHeader}>
                {hasHref(group) ? (
                  <Link
                    href={group.href}
                    className={styles.groupLink}
                    data-megamenu-item
                    onClick={() => {
                      trackEvent('navigation_click', {
                        component: 'mega_menu',
                        section: item.id,
                        label: group.label,
                        href: group.href,
                      })
                      onNavigate?.()
                    }}
                  >
                    <div className={styles.groupText}>
                      <div className={styles.groupTopline}>
                        <h3 className={styles.groupTitle}>{group.label}</h3>
                        {group.badge ? (
                          <span className={styles.groupBadge}>{group.badge}</span>
                        ) : null}
                      </div>

                      {group.description ? (
                        <p className={styles.groupDescription}>{group.description}</p>
                      ) : null}
                    </div>

                    <span className={styles.arrow} aria-hidden>
                      ↗
                    </span>
                  </Link>
                ) : (
                  <div className={styles.groupStatic}>
                    <div className={styles.groupText}>
                      <div className={styles.groupTopline}>
                        <h3 className={styles.groupTitle}>{group.label}</h3>
                        {group.badge ? (
                          <span className={styles.groupBadge}>{group.badge}</span>
                        ) : null}
                      </div>

                      {group.description ? (
                        <p className={styles.groupDescription}>{group.description}</p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              {hasChildren(group) ? (
                <ul className={styles.childList}>
                  {group.children.map((child, childIndex) => (
                    <li key={getItemKey(child, childIndex)} className={styles.childItem}>
                      {hasChildren(child) ? (
                        <div className={styles.nestedBlock}>
                          {renderLeafLink({
                            item: child,
                            sectionId: item.id,
                            parentLabel: group.label,
                            className: styles.childLink,
                            labelClassName: styles.childLabel,
                            badgeClassName: styles.childBadge,
                            onNavigate,
                          })}

                          <ul className={styles.grandchildList}>
                            {child.children.map((grandchild, grandchildIndex) => (
                              <li key={getItemKey(grandchild, grandchildIndex)}>
                                {renderLeafLink({
                                  item: grandchild,
                                  sectionId: item.id,
                                  parentLabel: child.label,
                                  className: styles.grandchildLink,
                                  labelClassName: styles.grandchildLabel,
                                  badgeClassName: styles.grandchildBadge,
                                  onNavigate,
                                })}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        renderLeafLink({
                          item: child,
                          sectionId: item.id,
                          parentLabel: group.label,
                          className: styles.childLink,
                          labelClassName: styles.childLabel,
                          badgeClassName: styles.childBadge,
                          onNavigate,
                        })
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </nav>

      <aside className={styles.featuredPane} aria-label="Featured stories">
        <div className={styles.featuredHeader}>
          <span className={styles.featuredHeading}>Featured stories</span>
          <span className={styles.featuredCount}>{loading ? '…' : featured.length}</span>
        </div>

        {hero ? (
          <Link
            href={hero.href}
            className={styles.heroCard}
            data-megamenu-item
            onClick={() => {
              trackEvent('hero_click', {
                placement: 'mega_menu',
                section: item.id,
                title: hero.title,
              })
              onNavigate?.()
            }}
          >
            <div className={styles.heroMedia}>
              {hero.image?.url ? (
                <Image
                  src={hero.image.url}
                  alt={hero.image.alt ?? hero.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 380px"
                  className={styles.heroImage}
                />
              ) : (
                <div className={styles.heroFallback} />
              )}

              <div className={styles.heroOverlay} />
            </div>

            <div className={styles.heroBody}>
              <span className={styles.heroEyebrow}>{hero.eyebrow ?? 'Editor’s pick'}</span>

              <h3 className={styles.heroTitle}>{hero.title}</h3>

              {hero.description ? (
                <p className={styles.heroDescription}>{hero.description}</p>
              ) : null}

              <span className={styles.heroCta}>Read story</span>
            </div>
          </Link>
        ) : (
          <div className={styles.emptyCard}>
            {loading ? 'Loading featured coverage…' : `No featured stories yet for ${item.label}.`}
          </div>
        )}

        {supportingCards.length > 0 ? (
          <div className={styles.supportingList}>
            {supportingCards.map((card, index) => (
              <Link
                key={card.id?.toString() ?? `${card.href}-${index}`}
                href={card.href}
                className={styles.supportingCard}
                data-megamenu-item
                onClick={() => {
                  trackEvent('content_click', {
                    placement: 'mega_menu',
                    section: item.id,
                    title: card.title,
                  })
                  onNavigate?.()
                }}
              >
                <div className={styles.thumb}>
                  {card.image?.url ? (
                    <Image
                      src={card.image.url}
                      alt={card.image.alt ?? card.title}
                      fill
                      sizes="86px"
                      className={styles.thumbImage}
                    />
                  ) : (
                    <div className={styles.thumbFallback} />
                  )}
                </div>

                <div className={styles.supportingBody}>
                  {card.eyebrow ? (
                    <div className={styles.supportingEyebrow}>{card.eyebrow}</div>
                  ) : null}

                  <div className={styles.supportingTitle}>{card.title}</div>

                  {card.description ? (
                    <div className={styles.supportingDescription}>{card.description}</div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </aside>
    </section>
  )
}