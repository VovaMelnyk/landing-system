import { getPayloadClient } from '@/lib/payload'
import { LivePreviewPage } from '@/components/LivePreviewPage'

type Props = {
  params: Promise<{ tenant: string; slug: string }>
}

export const dynamic = 'force-dynamic'

export default async function PreviewPage({ params }: Props) {
  const { tenant, slug } = await params
  const payload = await getPayloadClient()

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

  return (
    <LivePreviewPage
      initialData={page || { blocks: [] }}
      serverURL=""
    />
  )
}
