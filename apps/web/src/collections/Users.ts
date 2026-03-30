import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Super Admin', value: 'admin' },
        { label: 'Маркетолог', value: 'marketer' },
      ],
      defaultValue: 'marketer',
    },
    {
      name: 'tenants',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: true,
      admin: {
        condition: (data) => data.role !== 'admin',
        description: 'Маркетолог бачить лендинги тільки обраних субдоменів',
      },
    },
  ],
}
