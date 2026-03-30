import type { GroupField } from 'payload'

export const abTestField: GroupField = {
  name: 'ab',
  label: 'A/B Тест (PostHog)',
  type: 'group',
  admin: {
    description: 'Залиш порожнім якщо A/B тест не потрібен',
  },
  fields: [
    {
      name: 'key',
      label: 'Feature Flag ключ',
      type: 'text',
      admin: {
        description: 'Має збігатись з Feature Flag в PostHog Dashboard',
      },
    },
    {
      name: 'bTitle',
      label: 'Варіант B — Заголовок',
      type: 'text',
    },
    {
      name: 'bSubtitle',
      label: 'Варіант B — Підзаголовок',
      type: 'textarea',
    },
    {
      name: 'bTheme',
      label: 'Варіант B — Тема',
      type: 'select',
      options: [
        { label: 'Світла', value: 'light' },
        { label: 'Темна', value: 'dark' },
        { label: 'Кольорова', value: 'colored' },
      ],
    },
    {
      name: 'bBtnText',
      label: 'Варіант B — Текст кнопки',
      type: 'text',
    },
  ],
}
