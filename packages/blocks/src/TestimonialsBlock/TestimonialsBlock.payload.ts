import type { Block } from 'payload'
import { abTestField } from '../shared/abTestFields'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Відгуки', plural: 'Відгуки' },
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок секції' },
    {
      name: 'items',
      label: 'Відгуки',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'quote', label: 'Цитата', type: 'textarea', required: true },
        { name: 'author', label: "Ім'я", type: 'text', required: true },
        { name: 'role', label: 'Посада і компанія', type: 'text' },
        { name: 'avatar', label: 'Фото', type: 'upload', relationTo: 'media' },
      ],
    },
    abTestField,
  ],
}
