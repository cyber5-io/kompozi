export type ThemeConfig = {
  name: string
  label: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textMuted: string
    border: string
  }
  fonts: {
    heading: string
    body: string
  }
  sectionOverrides?: Record<string, string>
}
