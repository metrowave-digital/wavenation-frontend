export function isExternalLink(href?: string) {
  return typeof href === 'string' && /^https?:\/\//.test(href)
}