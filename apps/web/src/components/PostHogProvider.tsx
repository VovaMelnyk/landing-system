'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect, useRef } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY
      if (token) {
        posthog.init(token, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
          capture_pageview: true,
          persistence: 'localStorage',
          loaded: (ph) => {
            console.log('[PostHog] Initialized, distinct_id:', ph.get_distinct_id())
            // Доступ з DevTools Console через window.posthog
            ;(window as any).posthog = ph
          },
        })
        initialized.current = true
      }
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
