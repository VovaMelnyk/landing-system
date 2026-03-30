import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    description: 'Кожен tenant = один субдомен',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'subdomain', type: 'text', required: true, unique: true },
    { name: 'domain', type: 'text' },
  ],
}
