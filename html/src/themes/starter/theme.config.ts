import type { ThemeConfig } from '@/core/theme/types'

const starterTheme: ThemeConfig = {
  name: 'starter',
  label: 'Starter',
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
  },
  fonts: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
}

export default starterTheme
