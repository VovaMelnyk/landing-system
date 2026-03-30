import type { ArrayField } from 'payload'

// Payload schema — поля кнопки для адмінки
export const buttonsField: ArrayField = {
  name: 'buttons',
  label: 'Кнопки',
  type: 'array',
  maxRows: 2,
  fields: [
    { name: 'text', label: 'Текст', type: 'text', required: true },
    { name: 'url', label: 'Посилання', type: 'text', required: true },
    {
      name: 'variant',
      label: 'Тип',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
      ],
    },
    {
      name: 'color',
      label: 'Колір кнопки',
      type: 'select',
      defaultValue: 'blue',
      options: [
        { label: 'Синій', value: 'blue' },
        { label: 'Зелений', value: 'green' },
        { label: 'Червоний', value: 'red' },
      ],
    },
  ],
}
