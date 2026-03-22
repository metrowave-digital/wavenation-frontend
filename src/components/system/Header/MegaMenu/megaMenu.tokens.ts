export const MEGA_MENU_TOKENS = {
  spacing: {
    panel: '1.6rem',
    gap: '1.25rem',
    headerGap: '1rem',
  },
  radius: {
    panel: '1.75rem',
    card: '1.25rem',
    pill: '999px',
  },
  shadow: {
    panel:
      '0 30px 70px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
  },
  motion: {
    easeStandard: [0.22, 1, 0.36, 1] as const,
    easeExit: [0.4, 0, 1, 1] as const,
    cssEaseStandard: 'cubic-bezier(0.22, 1, 0.36, 1)',
    cssEaseEmphasis: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const