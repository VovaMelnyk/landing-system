'use client'

import posthog from 'posthog-js'
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
    if (ab?.key) {
      const checkFlag = () => {
        const flag = posthog.getFeatureFlag(ab.key!)
        console.log(`[A/B Test] key=${ab.key}, variant=${flag}`)
        if (flag !== undefined) {
          setVariant(typeof flag === 'string' ? flag : String(flag))
        }
      }

      if (posthog.isFeatureEnabled !== undefined) {
        checkFlag()
      }

      posthog.onFeatureFlags(() => {
        checkFlag()
      })
    }
  }, [ab?.key])

  const isVariantB = variant === 'test' && !!ab?.key

  return { variant, isVariantB, ab }
}
