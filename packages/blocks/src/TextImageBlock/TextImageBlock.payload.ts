import type { Block } from 'payload'
import { buttonsField } from '../shared/buttonFields'
import { abTestField } from '../shared/abTestFields'

export const TextImageBlock: Block = {
  slug: 'textImage',
  labels: { singular: 'Текст + Зображення', plural: 'Текст + Зображення' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText', label: 'Текст' },
    {
      name: 'imagePosition',
      label: 'Зображення',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Праворуч', value: 'right' },
        { label: 'Ліворуч', value: 'left' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { ...buttonsField, maxRows: 1 },
    abTestField,
  ],
}
