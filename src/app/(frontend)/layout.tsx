import React from 'react'
import '@/themes/starter/globals.css'

export const metadata = {
  title: 'Kompozi',
  description: 'Built with Kompozi',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
