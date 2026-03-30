'use client'

import { usePostHog } from 'posthog-js/react'

export function TrackedButton({ text, url }: { text: string; url: string }) {
  const posthog = usePostHog()

  return (
    <a
      href={url}
      onClick={() => {
        posthog.capture('cta_clicked', { button_text: text, destination_url: url })
      }}
    >
      {text}
    </a>
  )
}
