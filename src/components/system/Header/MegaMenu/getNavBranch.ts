// src/components/system/Header/MegaMenu/getNavBranch.ts

import type { MainNavItem, MegaMenuItem } from './MegaMenu.types'

export type NavBranchLevel = {
  item: MainNavItem | MegaMenuItem
  depth: 1 | 2 | 3 | 4
  parent?: MainNavItem | MegaMenuItem
}

export type NavBranchResult = {
  main: MainNavItem | null
  parent: MegaMenuItem | null
  child: MegaMenuItem | null
  grandchild: MegaMenuItem | null
  activeChain: Array<MainNavItem | MegaMenuItem>
  matchedPath: string | null
}

function normalizePath(pathname: string): string {
  if (!pathname) return '/'

  const withoutQuery = pathname.split('?')[0].split('#')[0]
  const trimmed =
    withoutQuery.length > 1 ? withoutQuery.replace(/\/+$/, '') : withoutQuery

  return trimmed || '/'
}

function isExactOrNestedMatch(itemHref: string, pathname: string): boolean {
  const href = normalizePath(itemHref)
  const path = normalizePath(pathname)

  if (href === '/') return path === '/'
  return path === href || path.startsWith(`${href}/`)
}

function getScore(itemHref: string, pathname: string): number {
  const href = normalizePath(itemHref)
  const path = normalizePath(pathname)

  if (!isExactOrNestedMatch(href, path)) return -1
  if (href === path) return href.length + 10000

  return href.length
}

type InternalMatch = {
  score: number
  chain: Array<MainNavItem | MegaMenuItem>
}

function walkTree(
  item: MainNavItem | MegaMenuItem,
  pathname: string,
  chain: Array<MainNavItem | MegaMenuItem> = []
): InternalMatch | null {
  const nextChain = [...chain, item]
  let best: InternalMatch | null = null

  if ('href' in item && item.href) {
    const score = getScore(item.href, pathname)

    if (score >= 0) {
      best = {
        score,
        chain: nextChain,
      }
    }
  }

  if ('children' in item && Array.isArray(item.children)) {
    for (const child of item.children) {
      const childMatch = walkTree(child, pathname, nextChain)

      if (!childMatch) continue
      if (!best || childMatch.score > best.score) {
        best = childMatch
      }
    }
  }

  return best
}

/**
 * Returns the active navigation branch for a pathname.
 *
 * Depth model:
 * 1 = main
 * 2 = parent
 * 3 = child
 * 4 = grandchild
 */
export function getNavBranch(
  navigation: MainNavItem[],
  pathname: string
): NavBranchResult {
  const normalizedPath = normalizePath(pathname)

  let bestMatch: InternalMatch | null = null

  for (const mainItem of navigation) {
    const match = walkTree(mainItem, normalizedPath)

    if (!match) continue
    if (!bestMatch || match.score > bestMatch.score) {
      bestMatch = match
    }
  }

  if (!bestMatch) {
    return {
      main: null,
      parent: null,
      child: null,
      grandchild: null,
      activeChain: [],
      matchedPath: null,
    }
  }

  const [main = null, parent = null, child = null, grandchild = null] =
    bestMatch.chain as [
      MainNavItem | null,
      MegaMenuItem | null,
      MegaMenuItem | null,
      MegaMenuItem | null,
    ]

  const matchedLeaf = bestMatch.chain[bestMatch.chain.length - 1]
  const matchedPath =
    matchedLeaf && 'href' in matchedLeaf && matchedLeaf.href
      ? normalizePath(matchedLeaf.href)
      : null

  return {
    main,
    parent,
    child,
    grandchild,
    activeChain: bestMatch.chain,
    matchedPath,
  }
}