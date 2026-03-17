import type { ThemeConfig } from './types'

let cachedTheme: ThemeConfig | null = null

export async function loadTheme(): Promise<ThemeConfig> {
  if (cachedTheme) return cachedTheme

  const { default: siteConfig } = await import('@/../../site.config')
  const themeName = siteConfig.theme || 'starter'

  const { default: themeConfig } = await import(`@/themes/${themeName}/theme.config`)
  cachedTheme = themeConfig
  return themeConfig
}

export function themeToCSS(theme: ThemeConfig): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-foreground: ${theme.colors.foreground};
      --color-muted: ${theme.colors.muted};
      --color-border: ${theme.colors.border};
      --font-heading: ${theme.fonts.heading};
      --font-body: ${theme.fonts.body};
    }
  `
}
