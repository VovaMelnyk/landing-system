import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getLandingPage(tenant: string, slug: string) {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'landing-pages',
    where: {
      and: [
        { 'tenant.subdomain': { equals: tenant } },
        { slug: { equals: slug } },
      ],
    },
    depth: 2,
  })

  return docs[0] || null
}

export async function getTenant(subdomain: string) {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'tenants',
    where: { subdomain: { equals: subdomain } },
  })

  return docs[0] || null
}
