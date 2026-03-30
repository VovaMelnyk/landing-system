import type { Block } from 'payload'
import { abTestField } from '../shared/abTestFields'

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: { singular: 'Блок переваг', plural: 'Блоки переваг' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Надзаголовок' },
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    { name: 'subtitle', type: 'textarea', label: 'Підзаголовок' },
    {
      name: 'columns',
      label: 'Кількість колонок',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 колонки', value: '2' },
        { label: '3 колонки', value: '3' },
        { label: '4 колонки', value: '4' },
      ],
    },
    {
      name: 'items',
      label: 'Переваги',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: 'icon', label: 'Іконка (emoji або URL)', type: 'text' },
        { name: 'title', label: 'Назва', type: 'text', required: true },
        { name: 'description', label: 'Опис', type: 'textarea', required: true },
      ],
    },
    abTestField,
  ],
}
