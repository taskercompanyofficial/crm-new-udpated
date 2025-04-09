"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+N
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        // Open complaint form in new tab
        window.open('/crm/complaint/new', '_blank')
      }
    }

    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

