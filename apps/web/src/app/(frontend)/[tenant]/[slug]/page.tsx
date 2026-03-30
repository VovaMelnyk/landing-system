import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getLandingPage, getTenant } from '@/lib/payload'
import { BlockRenderer } from '@/components/BlockRenderer'

type Props = {
  params: Promise<{ tenant: string; slug: string }>
}

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant, slug } = await params
  const page = await getLandingPage(tenant, slug)
  if (!page) return {}

  const tenantData = await getTenant(tenant)
  const domain = tenantData?.domain || `${tenant}.site.com`

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || undefined,
    robots: page.seo?.noIndex ? 'noindex' : 'index, follow',
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || undefined,
      images: page.seo?.ogImage ? [{ url: (page.seo.ogImage as any).url }] : [],
      url: `https://${domain}/${page.slug}`,
    },
    alternates: {
      canonical: `https://${domain}/${page.slug}`,
    },
  }
}

export default async function LandingPage({ params }: Props) {
  const { tenant, slug } = await params
  const page = await getLandingPage(tenant, slug)

  if (!page) notFound()
  if (page._status !== 'published') notFound()

  return (
    <main>
      <BlockRenderer blocks={page.blocks as any} />
    </main>
  )
}
