import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LivePreviewPage } from '@/components/LivePreviewPage'

type Props = {
  params: Promise<{ tenant: string; slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function PreviewPage({ params }: Props) {
  const { tenant, slug } = await params
  const payload = await getPayload({ config: configPromise })

  // Шукаємо лендинг включно з чернетками (draft: true)
  const { docs } = await payload.find({
    collection: 'landing-pages',
    where: {
      slug: { equals: slug },
    },
    draft: true,
    depth: 2,
  })

  const page = docs[0] || null
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return (
    <LivePreviewPage
      initialData={page || { blocks: [] }}
      serverURL={serverURL}
    />
  )
}
