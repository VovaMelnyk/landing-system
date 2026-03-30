'use client'

import { useState, useEffect } from 'react'

export type ABTestData = {
  key?: string
  bTitle?: string
  bSubtitle?: string
  bTheme?: string
  bBtnText?: string
}

export function useABTest(ab?: ABTestData) {
  const [variant, setVariant] = useState<string | null>(null)

  useEffect(() => {
    if (!ab?.key) return

    try {
      // Динамічний імпорт — якщо posthog-js не ініціалізований, не ламаємо сторінку
      const posthog = (window as any).posthog
      if (!posthog) return

      const checkFlag = () => {
        try {
          const flag = posthog.getFeatureFlag(ab.key!)
          console.log(`[A/B Test] key=${ab.key}, variant=${flag}`)
          if (flag !== undefined) {
            setVariant(typeof flag === 'string' ? flag : String(flag))
          }
        } catch {
          // PostHog not ready
        }
      }

      checkFlag()

      if (typeof posthog.onFeatureFlags === 'function') {
        posthog.onFeatureFlags(() => {
          checkFlag()
        })
      }
    } catch {
      // PostHog not available — render default variant
    }
  }, [ab?.key])

  const isVariantB = variant === 'test' && !!ab?.key

  return { variant, isVariantB, ab }
}
