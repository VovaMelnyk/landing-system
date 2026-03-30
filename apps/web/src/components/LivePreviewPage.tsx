'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { BlockRenderer } from './BlockRenderer'

export function LivePreviewPage({ initialData, serverURL }: { initialData: any; serverURL: string }) {
  // На клієнті використовуємо origin поточної сторінки якщо serverURL порожній
  const resolvedURL = serverURL || (typeof window !== 'undefined' ? window.location.origin : '')

  const { data } = useLivePreview({
    initialData,
    serverURL: resolvedURL,
    depth: 2,
  })

  return (
    <main>
      <BlockRenderer blocks={data?.blocks || []} />
    </main>
  )
}
