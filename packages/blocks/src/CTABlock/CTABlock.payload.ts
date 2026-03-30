import type { Block } from 'payload'
import { buttonsField } from '../shared/buttonFields'
import { abTestField } from '../shared/abTestFields'

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA Банер', plural: 'CTA Банери' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    buttonsField,
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'colored',
      options: [
        { label: 'Кольоровий', value: 'colored' },
        { label: 'Темний', value: 'dark' },
        { label: 'Світлий', value: 'light' },
      ],
    },
    abTestField,
  ],
}
