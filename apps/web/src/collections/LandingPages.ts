import type { CollectionConfig } from 'payload'
import { tenantAccess, isLoggedIn } from '../access/tenantAccess'
import {
  HeroBlock,
  FeaturesBlock,
  TextImageBlock,
  CTABlock,
  TestimonialsBlock,
} from '@landing-system/blocks/payload'

export const LandingPages: CollectionConfig = {
  slug: 'landing-pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'tenant', '_status', 'updatedAt'],
  },
  versions: {
    drafts: { autosave: true },
  },
  access: {
    read: tenantAccess,
    create: isLoggedIn,
    update: tenantAccess,
    delete: tenantAccess,
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Автоматично ставимо перший tenant маркетолога при створенні
        if (!data.tenant && req.user?.role === 'marketer' && req.user?.tenants) {
          const tenants = Array.isArray(req.user.tenants) ? req.user.tenants : [req.user.tenants]
          const first = tenants[0]
          if (first) {
            data.tenant = typeof first === 'object' ? first.id : first
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc }) => {
        const isPublished = doc._status === 'published'
        const wasPublished = previousDoc?._status === 'published'
        if (!isPublished && !wasPublished) return

        const tenant = typeof doc.tenant === 'object'
          ? doc.tenant.subdomain
          : doc.tenant

        try {
          const { revalidateTag } = await import('next/cache')
          revalidateTag(`landing-${tenant}-${doc.slug}`)
          console.log(`Revalidated: landing-${tenant}-${doc.slug}`)
        } catch {
          // next/cache not available outside Next.js runtime
        }
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Назва лендингу', type: 'text', required: true },
    {
      name: 'slug',
      label: 'URL slug',
      type: 'text',
      required: true,
      admin: { description: 'Тільки латиниця, дефіси. Наприклад: spring-sale' },
    },
    { name: 'tenant', label: 'Субдомен', type: 'relationship', relationTo: 'tenants' },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
        { name: 'noIndex', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'posthogPageExperiment',
      label: 'Page A/B тест',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'experimentKey', type: 'text' },
        { name: 'variantBSlug', type: 'text' },
      ],
    },
    {
      name: 'blocks',
      label: 'Блоки сторінки',
      type: 'blocks',
      blocks: [HeroBlock, FeaturesBlock, TextImageBlock, CTABlock, TestimonialsBlock],
    },
  ],
}
