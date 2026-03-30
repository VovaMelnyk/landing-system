import type { Block } from 'payload'
import { buttonsField } from '../shared/buttonFields'
import { abTestField } from '../shared/abTestFields'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero секція', plural: 'Hero секції' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Надзаголовок' },
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    { name: 'subtitle', type: 'textarea', label: 'Підзаголовок' },
    buttonsField,
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'layout',
      label: 'Layout',
      type: 'select',
      defaultValue: 'imageRight',
      options: [
        { label: 'Зображення праворуч', value: 'imageRight' },
        { label: 'Зображення ліворуч', value: 'imageLeft' },
        { label: 'По центру', value: 'centered' },
        { label: 'Фонове зображення', value: 'backgroundImage' },
      ],
    },
    {
      name: 'theme',
      label: 'Тема',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Світла', value: 'light' },
        { label: 'Темна', value: 'dark' },
        { label: 'Кольорова', value: 'colored' },
      ],
    },
    abTestField,
  ],
}
