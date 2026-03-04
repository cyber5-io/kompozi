import React from 'react'
import type { ThemeConfig } from './types'
import { themeToCSS } from './loader'

type Props = {
  theme: ThemeConfig
  children: React.ReactNode
}

export function ThemeProvider({ theme, children }: Props) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeToCSS(theme) }} />
      <div data-theme={theme.name}>
        {children}
      </div>
    </>
  )
}
