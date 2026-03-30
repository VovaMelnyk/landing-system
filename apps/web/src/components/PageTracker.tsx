'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export function PageTracker({ tenant, slug }: { tenant: string; slug: string }) {
  const posthog = usePostHog()
  useEffect(() => {
    posthog.capture('$pageview', { tenant, landing_slug: slug })
  }, [tenant, slug, posthog])
  return null
}
