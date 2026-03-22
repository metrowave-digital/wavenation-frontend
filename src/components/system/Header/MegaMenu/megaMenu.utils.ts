import type { NavItem } from '../nav/nav.types'
import { getFirstHref, hasChildren, hasHref } from '../nav/nav.types'

export const MAX_GROUPS = 4
export const MAX_LINKS_PER_GROUP = 6

export function getResolvedHref(item: NavItem): string {
  if (hasHref(item)) return item.href
  if (hasChildren(item)) return getFirstHref(item.children) ?? '#'
  return '#'
}

export function getGroupHref(group: NavItem): string {
  return getResolvedHref(group)
}

export function getMenuLinks(group: NavItem): NavItem[] {
  if (!hasChildren(group)) return []
  return group.children.slice(0, MAX_LINKS_PER_GROUP)
}

export function getItemDescription(item: NavItem): string | undefined {
  const candidate = item as NavItem & { description?: string }
  return candidate.description
}

export function getItemEyebrow(item: NavItem): string | undefined {
  const candidate = item as NavItem & { eyebrow?: string }
  return candidate.eyebrow
}