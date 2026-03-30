'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { BlockRenderer } from './BlockRenderer'

export function LivePreviewPage({ initialData, serverURL }: { initialData: any; serverURL: string }) {
  const { data } = useLivePreview({
    initialData,
    serverURL,
    depth: 2,
  })

  return (
    <main>
      <BlockRenderer blocks={data?.blocks || []} />
    </main>
  )
}
