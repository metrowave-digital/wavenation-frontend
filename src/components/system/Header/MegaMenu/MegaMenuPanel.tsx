'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import type { NavItem } from '../nav/nav.types'
import styles from './MegaMenu.module.css'
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

type FeaturedMeta =
  | boolean
  | {
      eyebrow?: string
      title?: string
      description?: string
      accent?: string
    }

interface Props {
  item: NavItem
  onNavigate?: () => void
}

function hasChildren(item: NavItem): item is NavItem & { children: NavItem[] } {
  return Array.isArray(item.children) && item.children.length > 0
}

function hasHref(item: NavItem): item is NavItem & { href: string } {
  return typeof item.href === 'string' && item.href.length > 0
}

function isFeaturedObject(featured: FeaturedMeta | undefined): featured is {
  eyebrow?: string
  title?: string
  description?: string
  accent?: string
} {
  return typeof featured === 'object' && featured !== null
}

function getDefaultSectionHref(item: NavItem): string {
  if (hasHref(item)) return item.href

  switch (item.id) {
    case 'news':
      return '/news'
    case 'watch':
      return '/tv'
    case 'onair':
      return '/radio'
    case 'shop':
      return '/shop'
    case 'connect':
      return '/connect'
    case 'discover':
      return '/discover'
    default:
      return '/'
  }
}

function getFirstHref(items?: NavItem[]): string | null {
  if (!items?.length) return null

  for (const item of items) {
    if (hasHref(item)) return item.href

    if (hasChildren(item)) {
      const nested = getFirstHref(item.children)
      if (nested) return nested
    }
  }

  return null
}

function countDestinations(items?: NavItem[]): number {
  if (!items?.length) return 0

  return items.reduce((count, item) => {
    const selfCount = hasHref(item) ? 1 : 0
    const childCount = hasChildren(item) ? countDestinations(item.children) : 0
    return count + selfCount + childCount
  }, 0)
}

function getItemKey(item: NavItem, index: number): string {
  if (item.id) return item.id
  if (hasHref(item)) return item.href
  return `${item.label}-${index}`
}

function getFeaturedSeed(item: NavItem): {
  eyebrow: string
  title: string
  description: string
  href: string
} | null {
  if (!hasChildren(item)) return null

  const firstFeatured = item.children.find(child =>
    Boolean(child.featured)
  )

  if (!firstFeatured) return null

  if (isFeaturedObject(firstFeatured.featured)) {
    return {
      eyebrow: firstFeatured.featured.eyebrow ?? 'Featured',
      title: firstFeatured.featured.title ?? firstFeatured.label,
      description:
        firstFeatured.featured.description ??
        firstFeatured.description ??
        `Explore ${firstFeatured.label}.`,
      href: firstFeatured.href ?? getFirstHref(firstFeatured.children) ?? '#',
    }
  }

  return {
    eyebrow: 'Featured',
    title: firstFeatured.label,
    description:
      firstFeatured.description ?? `Explore ${firstFeatured.label}.`,
    href: firstFeatured.href ?? getFirstHref(firstFeatured.children) ?? '#',
  }
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
      <div className={className} aria-disabled="true">
        <span className={labelClassName}>{item.label}</span>
        {'badge' in item && item.badge ? (
          <span className={badgeClassName}>{item.badge}</span>
        ) : null}
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
      {'badge' in item && item.badge ? (
        <span className={badgeClassName}>{item.badge}</span>
      ) : null}
    </Link>
  )
}

export function MegaMenuPanel({ item, onNavigate }: Props) {
  const [featured, setFeatured] = useState<FeaturedCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

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

        if (alive) {
          setFeatured(Array.isArray(json) ? json : [])
        }
      } catch {
        if (alive) {
          setFeatured([])
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadFeatured()

    return () => {
      alive = false
    }
  }, [item.id])

  const totalLinks = useMemo(() => countDestinations(item.children), [item.children])

  const sectionHref = useMemo(() => {
    return getFirstHref(item.children) ?? getDefaultSectionHref(item)
  }, [item])

  const featuredSeed = useMemo(() => getFeaturedSeed(item), [item])

  const hero = featured[0] ?? null
  const supportingCards = featured.slice(1, 4)

  return (
    <section className={styles.panel}>
      <aside className={styles.intro}>
        <div className={styles.kicker}>WaveNation Desk</div>

        <h2 className={styles.title}>{item.label}</h2>

        <p className={styles.desc}>
          {item.description ?? 'A curated front page for what matters right now.'}
        </p>

        <div className={styles.rule} />

        <div className={styles.introMeta}>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Section</span>
            <span className={styles.metaValue}>{item.id.toUpperCase()}</span>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Browse</span>
            <span className={styles.metaValue}>
              {totalLinks} destination{totalLinks === 1 ? '' : 's'}
            </span>
          </div>

          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Featured</span>
            <span className={styles.metaValue}>
              {loading ? 'Loading…' : `${featured.length} picks`}
            </span>
          </div>
        </div>

        <Link
          href={sectionHref}
          className={styles.introCta}
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
          <div className={styles.sectionFeatureCard}>
            <span className={styles.sectionFeatureEyebrow}>
              {featuredSeed.eyebrow}
            </span>

            <div className={styles.sectionFeatureTitle}>
              {featuredSeed.title}
            </div>

            <p className={styles.sectionFeatureDesc}>
              {featuredSeed.description}
            </p>

            {featuredSeed.href !== '#' ? (
              <Link
                href={featuredSeed.href}
                className={styles.sectionFeatureLink}
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

      <nav className={styles.links} aria-label={`${item.label} links`}>
        {item.children?.map((group, index) => {
          const groupHref = hasHref(group)
            ? group.href
            : getFirstHref(group.children) ?? '#'

          return (
            <div key={getItemKey(group, index)} className={styles.linkGroup}>
              <div className={styles.linkGroupHeader}>
                {hasHref(group) ? (
                  <Link
                    href={group.href}
                    className={styles.link}
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
                    <div className={styles.linkInner}>
                      <div className={styles.linkTopline}>
                        <strong className={styles.linkTitle}>{group.label}</strong>

                        {'badge' in group && group.badge ? (
                          <span className={styles.linkBadge}>{group.badge}</span>
                        ) : null}
                      </div>

                      <span className={styles.linkDesc}>
                        {group.description ?? 'Explore the latest updates.'}
                      </span>
                    </div>

                    <span className={styles.chev} aria-hidden>
                      ↗
                    </span>
                  </Link>
                ) : (
                  <div className={styles.link}>
                    <div className={styles.linkInner}>
                      <div className={styles.linkTopline}>
                        <strong className={styles.linkTitle}>{group.label}</strong>

                        {'badge' in group && group.badge ? (
                          <span className={styles.linkBadge}>{group.badge}</span>
                        ) : null}
                      </div>

                      <span className={styles.linkDesc}>
                        {group.description ?? 'Explore the latest updates.'}
                      </span>
                    </div>

                    {groupHref !== '#' ? (
                      <Link
                        href={groupHref}
                        className={styles.chev}
                        data-megamenu-item
                        aria-label={`Open ${group.label}`}
                        onClick={() => {
                          trackEvent('navigation_click', {
                            component: 'mega_menu',
                            section: item.id,
                            label: group.label,
                            href: groupHref,
                          })
                          onNavigate?.()
                        }}
                      >
                        ↗
                      </Link>
                    ) : (
                      <span className={styles.chev} aria-hidden>
                        ↗
                      </span>
                    )}
                  </div>
                )}
              </div>

              {hasChildren(group) ? (
                <ul className={styles.sublinks}>
                  {group.children.map((child, childIndex) => {
                    const childHasChildren = hasChildren(child)

                    return (
                      <li key={getItemKey(child, childIndex)}>
                        {childHasChildren ? (
                          <div className={styles.subGroup}>
                            {renderLeafLink({
                              item: child,
                              sectionId: item.id,
                              parentLabel: group.label,
                              className: styles.sublink,
                              labelClassName: styles.sublinkLabel,
                              badgeClassName: styles.sublinkBadge,
                              onNavigate,
                            })}

                            <ul className={styles.subsublinks}>
                              {child.children.map((grandchild, grandchildIndex) => (
                                <li key={getItemKey(grandchild, grandchildIndex)}>
                                  {renderLeafLink({
                                    item: grandchild,
                                    sectionId: item.id,
                                    parentLabel: child.label,
                                    className: styles.subsublink,
                                    labelClassName: styles.subsublinkLabel,
                                    badgeClassName: styles.subsublinkBadge,
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
                            className: styles.sublink,
                            labelClassName: styles.sublinkLabel,
                            badgeClassName: styles.sublinkBadge,
                            onNavigate,
                          })
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
          )
        })}
      </nav>

      <aside className={styles.featured} aria-label="Featured stories">
        <div className={styles.featuredHeader}>
          <span className={styles.featuredLabel}>Featured stories</span>
          <span className={styles.featuredPill}>
            {loading ? '…' : featured.length}
          </span>
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
                  sizes="(max-width: 1024px) 92vw, 420px"
                  className={styles.heroImg}
                />
              ) : (
                <div className={styles.heroFallback} />
              )}

              <div className={styles.heroShade} />
            </div>

            <div className={styles.heroBody}>
              <span className={styles.eyebrow}>
                {hero.eyebrow ?? 'Editor’s Pick'}
              </span>

              <h3 className={styles.heroTitle}>{hero.title}</h3>

              {hero.description ? (
                <p className={styles.heroDesc}>{hero.description}</p>
              ) : null}

              <div className={styles.heroCta}>Read story</div>
            </div>
          </Link>
        ) : !loading ? (
          <div className={styles.empty}>
            No featured articles available yet for {item.label}.
          </div>
        ) : (
          <div className={styles.empty}>Loading featured coverage…</div>
        )}

        {supportingCards.length > 0 ? (
          <div className={styles.cardList}>
            {supportingCards.map((card, index) => (
              <Link
                key={card.id?.toString() ?? `${card.href}-${index}`}
                href={card.href}
                className={styles.card}
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
                      sizes="96px"
                      className={styles.thumbImg}
                    />
                  ) : (
                    <div className={styles.thumbFallback} />
                  )}
                </div>

                <div className={styles.cardBody}>
                  {card.eyebrow ? (
                    <span className={styles.cardEyebrow}>{card.eyebrow}</span>
                  ) : null}

                  <div className={styles.cardTitle}>{card.title}</div>

                  {card.description ? (
                    <div className={styles.cardDesc}>{card.description}</div>
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