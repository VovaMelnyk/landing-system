import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getPayloadClient() {
  return getPayload({ config: configPromise })
}

export async function getLandingPage(tenant: string, slug: string) {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'landing-pages',
    where: {
      and: [
        { 'tenant.subdomain': { equals: tenant } },
        { slug: { equals: slug } },
      ],
    },
    depth: 2,
    overrideAccess: true, // bypass tenantAccess для публічного рендеру
  })

  return docs[0] || null
}

export async function getTenant(subdomain: string) {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'tenants',
    where: { subdomain: { equals: subdomain } },
    overrideAccess: true,
  })

  return docs[0] || null
}
