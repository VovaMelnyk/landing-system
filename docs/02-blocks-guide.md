# Робота з блоками — гайд для розробника

## Як влаштована система блоків

Кожен блок складається з **3 файлів** в одній папці `packages/blocks/src/{BlockName}/`:

```
packages/blocks/src/HeroBlock/
├── HeroBlock.payload.ts      ← Payload schema (поля в адмінці)
├── HeroBlock.tsx              ← React компонент (рендер на фронті)
└── HeroBlock.stories.tsx      ← Storybook story (ізольований превʼю)
```

Плюс **2 barrel-файли** для експорту:
- `packages/blocks/src/payload.ts` — експорт всіх Payload schemas
- `packages/blocks/src/index.ts` — експорт всіх React компонентів

**Одне джерело правди:** зміна файлу автоматично підхоплюється і в адмінці, і на фронті, і в Storybook.

---

## Спільні компоненти

Компоненти які використовуються в кількох блоках живуть в `packages/blocks/src/shared/`:

```
shared/
├── Button.tsx          ← React компонент кнопки
└── buttonFields.ts     ← Payload schema полів кнопки
```

Якщо щось використовується в 2+ блоках — виноси в `shared/`.

---

## Створення нового блоку — покроково

### Приклад: створити блок "Pricing" (таблиця цін)

#### 1. Створити папку

```bash
mkdir packages/blocks/src/PricingBlock
```

#### 2. Створити Payload schema

`packages/blocks/src/PricingBlock/PricingBlock.payload.ts`:

```typescript
import type { Block } from 'payload'
import { buttonsField } from '../shared/buttonFields'

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: { singular: 'Ціни', plural: 'Ціни' },
  fields: [
    { name: 'title', type: 'text', label: 'Заголовок', required: true },
    { name: 'subtitle', type: 'textarea', label: 'Підзаголовок' },
    {
      name: 'plans',
      label: 'Тарифи',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'name', type: 'text', label: 'Назва тарифу', required: true },
        { name: 'price', type: 'text', label: 'Ціна', required: true },
        { name: 'period', type: 'text', label: 'Період', defaultValue: '/міс' },
        { name: 'featured', type: 'checkbox', label: 'Виділений' },
        {
          name: 'features',
          label: 'Можливості',
          type: 'array',
          fields: [
            { name: 'text', type: 'text', required: true },
          ],
        },
        buttonsField,
      ],
    },
  ],
}
```

**Типи полів Payload:**
- `text` — однорядковий текст
- `textarea` — багаторядковий текст
- `richText` — Lexical rich text editor
- `select` — dropdown з варіантами
- `checkbox` — чекбокс (boolean)
- `upload` — завантаження файлу (зображення)
- `relationship` — звʼязок з іншою колекцією
- `array` — масив повторюваних елементів
- `group` — група полів

#### 3. Створити React компонент

`packages/blocks/src/PricingBlock/PricingBlock.tsx`:

```tsx
import { Button, type ButtonProps } from '../shared/Button'

type Plan = {
  name: string
  price: string
  period?: string
  featured?: boolean
  features?: { text: string }[]
  buttons?: ButtonProps[]
}

export type PricingBlockProps = {
  title: string
  subtitle?: string
  plans?: Plan[]
}

export function PricingBlock({ title, subtitle, plans = [] }: PricingBlockProps) {
  return (
    <section className="py-20 px-6 md:px-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={[
                'rounded-xl p-8 flex flex-col',
                plan.featured
                  ? 'bg-blue-600 text-white shadow-xl scale-105'
                  : 'bg-white text-gray-900 shadow-sm',
              ].join(' ')}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-1">
                {plan.price}
                <span className="text-lg font-normal opacity-70">{plan.period}</span>
              </div>

              <ul className="my-8 space-y-3 flex-1">
                {plan.features?.map((f, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <span>✓</span> {f.text}
                  </li>
                ))}
              </ul>

              {plan.buttons?.map((btn, j) => (
                <Button key={j} {...btn} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Правила для React компонентів:**
- Використовуй Tailwind класи для стилів
- Імпортуй `Button` з `../shared/Button` для кнопок
- Імпортуй `Image` з `next/image` для зображень
- Експортуй `type {Block}Props` для типізації

#### 4. Створити Storybook story

`packages/blocks/src/PricingBlock/PricingBlock.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { PricingBlock } from './PricingBlock'

const meta: Meta<typeof PricingBlock> = {
  title: 'Blocks/Pricing',
  component: PricingBlock,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof PricingBlock>

export const Default: Story = {
  args: {
    title: 'Оберіть тариф',
    subtitle: 'Почніть безкоштовно, масштабуйте коли готові',
    plans: [
      {
        name: 'Starter',
        price: '$0',
        period: '/міс',
        features: [
          { text: '1 лендинг' },
          { text: '1000 переглядів' },
        ],
        buttons: [{ text: 'Почати', url: '#', variant: 'secondary', color: 'blue' }],
      },
      {
        name: 'Pro',
        price: '$29',
        period: '/міс',
        featured: true,
        features: [
          { text: '10 лендингів' },
          { text: 'Без лімітів' },
          { text: 'A/B тести' },
        ],
        buttons: [{ text: 'Обрати Pro', url: '#', variant: 'primary', color: 'blue' }],
      },
      {
        name: 'Enterprise',
        price: '$99',
        period: '/міс',
        features: [
          { text: 'Безліміт лендингів' },
          { text: 'Пріоритетна підтримка' },
          { text: 'Custom домени' },
        ],
        buttons: [{ text: 'Звʼязатись', url: '#', variant: 'secondary', color: 'blue' }],
      },
    ],
  },
}
```

#### 5. Додати в barrel exports

`packages/blocks/src/payload.ts` — додати рядок:
```typescript
export { PricingBlock } from './PricingBlock/PricingBlock.payload'
```

`packages/blocks/src/index.ts` — додати рядки:
```typescript
export { PricingBlock } from './PricingBlock/PricingBlock'
export type { PricingBlockProps } from './PricingBlock/PricingBlock'
```

#### 6. Підключити в LandingPages колекцію

`apps/web/src/collections/LandingPages.ts` — додати імпорт та в blocks:

```typescript
import {
  HeroBlock,
  FeaturesBlock,
  TextImageBlock,
  CTABlock,
  TestimonialsBlock,
  PricingBlock,        // ← додати
} from '@landing-system/blocks/payload'

// ...
blocks: [HeroBlock, FeaturesBlock, TextImageBlock, CTABlock, TestimonialsBlock, PricingBlock],
```

#### 7. Додати в BlockRenderer

`apps/web/src/components/BlockRenderer.tsx` — додати маппінг:

```typescript
import {
  HeroBlock,
  FeaturesBlock,
  TextImageBlock,
  CTABlock,
  TestimonialsBlock,
  PricingBlock,        // ← додати
} from '@landing-system/blocks'

const blockComponents = {
  hero: HeroBlock,
  features: FeaturesBlock,
  textImage: TextImageBlock,
  cta: CTABlock,
  testimonials: TestimonialsBlock,
  pricing: PricingBlock,  // ← slug з payload.ts → React компонент
}
```

#### 8. Перезапустити

```bash
# Зупинити dev сервер (Ctrl+C), потім:
cd apps/web && rm -rf .next && pnpm dev
```

Якщо Payload запитає schema push — `y`.

Після цього:
- В **адмінці** при створенні лендингу — "+ Add Block" покаже "Ціни"
- В **Storybook** — зʼявиться Blocks/Pricing
- На **фронті** — блок рендериться з Tailwind стилями

---

## Редагування існуючого блоку

### Додати поле в адмінку

Наприклад, додати поле "Background color" в Hero блок:

1. Відкрити `packages/blocks/src/HeroBlock/HeroBlock.payload.ts`
2. Додати поле в масив `fields`:
   ```typescript
   {
     name: 'backgroundColor',
     label: 'Колір фону',
     type: 'text',
     admin: { description: 'CSS колір, наприклад: #ff0000' },
   },
   ```
3. Перезапустити dev (schema push `y`)

### Змінити React компонент

1. Відкрити `packages/blocks/src/HeroBlock/HeroBlock.tsx`
2. Додати prop в тип:
   ```typescript
   backgroundColor?: string
   ```
3. Використати в JSX:
   ```tsx
   <section style={{ backgroundColor }}>
   ```
4. Зміни підхоплюються автоматично (hot reload)

### Оновити Storybook story

1. Відкрити `packages/blocks/src/HeroBlock/HeroBlock.stories.tsx`
2. Додати нове поле в `args`:
   ```typescript
   backgroundColor: '#f0f0f0',
   ```

---

## Спільна кнопка (Button)

Всі блоки використовують одну кнопку з `packages/blocks/src/shared/`.

### Payload schema (`shared/buttonFields.ts`)

Визначає поля кнопки в адмінці:
- **Текст** — текст на кнопці
- **Посилання** — URL
- **Тип** — Primary / Secondary
- **Колір** — Синій / Зелений / Червоний

### React компонент (`shared/Button.tsx`)

Рендерить кнопку з Tailwind стилями на основі variant та color.

### Як додати новий колір кнопки

1. `shared/buttonFields.ts` — додати option:
   ```typescript
   { label: 'Жовтий', value: 'yellow' },
   ```

2. `shared/Button.tsx` — додати стилі:
   ```typescript
   const primaryColors = {
     // ...existing
     yellow: 'bg-yellow-500 text-black hover:bg-yellow-600',
   }
   const secondaryColors = {
     // ...existing
     yellow: 'border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50',
   }
   ```

3. Перезапустити dev — новий колір зʼявиться в адмінці і на фронті для **всіх блоків** які використовують кнопку.

---

## Tailwind стилі

Tailwind сканує файли з `packages/blocks/src/` автоматично — це налаштовано в `apps/web/src/app/(frontend)/styles.css`:

```css
@import "tailwindcss";
@source "../../../../../packages/blocks/src/**/*.tsx";
```

Якщо додаєш новий Tailwind клас в React компонент блоку — він автоматично підхопиться.

---

## Чекліст створення блоку

- [ ] Створити папку `packages/blocks/src/{BlockName}/`
- [ ] Створити `{BlockName}.payload.ts` — Payload schema
- [ ] Створити `{BlockName}.tsx` — React компонент
- [ ] Створити `{BlockName}.stories.tsx` — Storybook story
- [ ] Додати в `packages/blocks/src/payload.ts` — export schema
- [ ] Додати в `packages/blocks/src/index.ts` — export component + type
- [ ] Додати в `apps/web/src/collections/LandingPages.ts` — import + blocks array
- [ ] Додати в `apps/web/src/components/BlockRenderer.tsx` — slug → component mapping
- [ ] Перезапустити dev (`rm -rf .next && pnpm dev`, schema push `y`)
- [ ] Перевірити в адмінці, Storybook і на фронті

---

## Спільні компоненти (shared/)

Всі спільні елементи знаходяться в `packages/blocks/src/shared/`:

| Файл | Призначення |
|------|-------------|
| `Button.tsx` | React компонент кнопки (variant + color) |
| `buttonFields.ts` | Payload schema полів кнопки (для адмінки) |
| `abTestFields.ts` | Payload schema A/B тест полів |
| `useABTest.ts` | React hook для A/B тестування через PostHog |

### Правило

Якщо елемент використовується в **2+ блоках** — виноси в `shared/`. Зміна в одному місці оновлює всі блоки автоматично.

### A/B тест в блоках

Кожен блок імпортує `abTestField` (Payload schema) і `useABTest` (React hook):

**Payload schema** (`{Block}.payload.ts`):
```typescript
import { abTestField } from '../shared/abTestFields'

export const MyBlock: Block = {
  slug: 'myBlock',
  fields: [
    // ...інші поля
    abTestField,  // ← додає секцію A/B Тест в адмінці
  ],
}
```

**React компонент** (`{Block}.tsx`):
```tsx
'use client'
import { useABTest, type ABTestData } from '../shared/useABTest'

export function MyBlock({ title, ab }: { title: string; ab?: ABTestData }) {
  const { isVariantB } = useABTest(ab)
  const displayTitle = isVariantB && ab?.bTitle ? ab.bTitle : title

  return <h1>{displayTitle}</h1>
}
```

> **Важливо:** Блоки з A/B тестом мають бути `'use client'` компонентами бо `useABTest` використовує `posthog-js` на клієнті.

### Короткі назви полів

PostgreSQL має ліміт **63 символи** на назву таблиці/enum. Payload генерує назви як `{collection}_{block}_{field}`. Тому:
- Використовуй **короткі назви** полів: `ab` замість `abTest`, `bTitle` замість `variantB.title`
- **Не роби** глибоку вкладеність group > group > select
- Якщо потрібна вкладеність — тримай назви максимально короткими
