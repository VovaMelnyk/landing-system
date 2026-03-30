# Розгортання проєкту з нуля

## Передумови

- **Node.js 20+** (`node -v`)
- **pnpm 10+** (`pnpm -v`). Встановити: `npm i -g pnpm`
- **Supabase акаунт** — [supabase.com](https://supabase.com)
- **Git**

---

## Крок 1 — Створити Supabase проєкт

1. Зайти на [supabase.com/dashboard](https://supabase.com/dashboard)
2. Натиснути **New Project**
3. Заповнити:
   - **Name:** landing-system (або будь-яке)
   - **Database Password:** запам'ятати пароль
   - **Region:** обрати найближчий (наприклад Central EU)
4. Дочекатись створення (1-2 хвилини)
5. Перейти в **Connect** (кнопка зверху)
6. Обрати **Session pooler** (не Direct connection — він тільки IPv6 і може не працювати в локальній мережі)
7. Type: **URI**
8. Скопіювати connection string, замінити `[YOUR-PASSWORD]` на свій пароль

Формат буде такий:
```
postgresql://postgres.XXXXX:PASSWORD@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

> **Важливо:** порт має бути **5432**. Session pooler використовує саме цей порт.

---

## Крок 2 — Клонувати репозиторій

```bash
git clone <repo-url>
cd landing-system
```

---

## Крок 3 — Встановити залежності

```bash
pnpm install
```

Якщо є warning про `onlyBuiltDependencies` — це нормально, ігноруйте.

---

## Крок 4 — Налаштувати змінні середовища

```bash
cp apps/web/.env.example apps/web/.env
```

Відкрити `apps/web/.env` і заповнити:

```env
DATABASE_URL=postgresql://postgres.XXXXX:PASSWORD@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
PAYLOAD_SECRET=будь-який-рядок-мінімум-24-символи
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

- `DATABASE_URL` — connection string з кроку 1
- `PAYLOAD_SECRET` — будь-який випадковий рядок (наприклад згенерувати через `openssl rand -hex 24`)
- `NEXT_PUBLIC_SERVER_URL` — залишити `http://localhost:3000` для локальної розробки

---

## Крок 5 — Запустити проєкт

```bash
cd apps/web
pnpm dev
```

Перший запуск буде повільніший (5-15 секунд) — Payload створює таблиці в Supabase.

Якщо Payload запитає про **schema push** (Warnings detected during schema push) — введіть `y` і натисніть Enter.

В консолі має з'явитись:
```
✓ Ready in XXXms
✓ Pulling schema from database...
```

---

## Крок 6 — Створити адмін акаунт

1. Відкрити `http://localhost:3000/admin`
2. Payload запропонує створити першого користувача
3. Заповнити email і пароль
4. Цей акаунт автоматично стане Super Admin

> **Важливо:** перший створений акаунт не має поля `role` — це нормально, він має повний доступ.

### Встановити роль першому акаунту

Щоб уникнути проблем з access control:

1. Після створення акаунту перейти в **Users** → натиснути на свого юзера
2. Встановити **Role: Super Admin**
3. **Save**

Це гарантує що у вас повний доступ до всіх колекцій і tenant'ів.

---

## Крок 6.1 — Створення лендингів: як це працює

### Як Super Admin

Super Admin бачить все і може створювати лендинги для будь-якого tenant'у:

1. **Landing Pages** → **Create New**
2. Заповнити **Title**, **URL slug**
3. Обрати **Субдомен** (tenant)
4. Додати блоки через **"+ Add Block"**
5. **Save Draft** або **Publish**

### Як маркетолог

Маркетолог бачить тільки лендинги своїх tenant'ів. При створенні нового лендингу:

1. **Landing Pages** → **Create New**
2. Tenant ставиться **автоматично** з першого tenant'у маркетолога
3. Маркетолог може змінити tenant на інший зі свого списку
4. Заповнити поля і додати блоки
5. **Save Draft** або **Publish**

### Як влаштовано (для розробників)

Щоб створення лендингів працювало без помилок, в проєкті реалізовано:

**1. Розділений access control** (`apps/web/src/access/tenantAccess.ts`):
- `create` — дозволено будь-якому залогіненому юзеру (`isLoggedIn`)
- `read/update/delete` — фільтрується по tenant'ах юзера (`tenantAccess`)
- Маркетолог також бачить чернетки без tenant'у (свої нові документи)

**2. Auto-assign tenant** (`apps/web/src/collections/LandingPages.ts` → `beforeChange` hook):
- При створенні чернетки Payload автоматично ставить tenant з першого tenant'у маркетолога
- Це вирішує проблему з autosave — коли Payload створює порожню чернетку при відкритті форми "Create New", вона одразу отримує tenant і read access працює

**3. Autosave увімкнений:**
- `versions.drafts.autosave: true` — Payload автоматично зберігає чернетку кожні кілька секунд
- Завдяки auto-assign tenant чернетка одразу доступна маркетологу

> **Без цих трьох механізмів** при натисканні "Create New" маркетолог отримає помилку "Document not found" — бо autosave створить чернетку без tenant'у, а `read` access її не пропустить.

---

## Крок 7 — Заповнити демо даними (seed)

Seed створює 2 tenant'и, 2 маркетологів і 2 лендинги.

При запущеному dev сервері, в іншому терміналі або браузері відкрити:

```
POST http://localhost:3000/api/seed
```

Або через curl:
```bash
curl -X POST http://localhost:3000/api/seed
```

Відповідь:
```json
{
  "success": true,
  "message": "Seed complete! Created 2 tenants, 2 marketers, 2 landing pages",
  "logins": {
    "promo": "marketer@promo.com / Demo1234!",
    "product": "marketer@product.com / Demo1234!"
  }
}
```

---

## Крок 8 — Додати субдомени в /etc/hosts

```bash
sudo sh -c 'echo "127.0.0.1 promo.localhost" >> /etc/hosts'
sudo sh -c 'echo "127.0.0.1 product.localhost" >> /etc/hosts'
```

Введіть пароль системи коли запитає.

---

## Крок 9 — Перевірити що все працює

| URL | Що має відкритись |
|-----|-------------------|
| `http://localhost:3000/admin` | Payload адмінка |
| `http://promo.localhost:3000/spring-sale` | Лендинг "Весняний розпродаж" зі стилями |
| `http://product.localhost:3000/launch` | Лендинг "Product Launch" |

### Перевірити адмінку

1. Відкрити `http://localhost:3000/admin`
2. В сайдбарі мають бути: **Users, Media, Tenants, Landing Pages**
3. Відкрити **Landing Pages** — має бути 2 лендинги (spring-sale, launch)
4. Відкрити будь-який лендинг — праворуч має бути **Live Preview** з iframe

### Перевірити tenant ізоляцію

1. Вийти з адмін акаунту (Logout)
2. Залогінитись як `marketer@promo.com` / `Demo1234!`
3. В Landing Pages має бути видно **тільки** лендинги Promo tenant
4. Залогінитись як `marketer@product.com` — видно тільки Product

### Перевірити Storybook

В окремому терміналі:
```bash
cd packages/blocks
pnpm storybook
```

Відкрити `http://localhost:6006` — мають бути блоки: CTA Button, Features, Hero, Testimonials, TextImage.

---

## Структура проєкту

```
landing-system/
├── apps/web/                   ← Next.js + Payload CMS (один додаток)
│   ├── src/
│   │   ├── access/             ← tenant access control
│   │   ├── app/(frontend)/     ← лендинги для відвідувачів
│   │   ├── app/(payload)/      ← адмінка Payload
│   │   ├── collections/        ← Payload колекції (Users, Media, Tenants, LandingPages)
│   │   ├── components/         ← BlockRenderer, PostHogProvider, LivePreview
│   │   ├── lib/                ← payload API client, posthog
│   │   └── payload.config.ts   ← головний конфіг Payload
│   ├── .env                    ← змінні середовища (не комітити!)
│   └── .env.example            ← шаблон змінних
├── packages/blocks/            ← React блоки + Payload schemas + Storybook
│   ├── src/
│   │   ├── shared/             ← спільні компоненти (Button)
│   │   ├── HeroBlock/          ← Hero блок
│   │   ├── FeaturesBlock/      ← Features блок
│   │   ├── TextImageBlock/     ← TextImage блок
│   │   ├── CTABlock/           ← CTA блок
│   │   └── TestimonialsBlock/  ← Testimonials блок
│   └── .storybook/             ← конфіг Storybook
├── packages/ui/                ← базові UI (Tailwind globals)
├── scripts/                    ← seed, prewarm
└── .github/workflows/          ← CI/CD
```

---

## Порти

| Сервіс | Порт | Команда запуску |
|--------|------|-----------------|
| Web + CMS | 3000 | `cd apps/web && pnpm dev` |
| Storybook | 6006 | `cd packages/blocks && pnpm storybook` |

Обидва можна запускати одночасно.

---

## Крок 10 — Налаштувати Storybook

Storybook дозволяє розробникам працювати з блоками ізольовано від CMS.

### Встановлення (вже зроблено, але якщо з нуля)

```bash
cd packages/blocks
pnpm add -D storybook@10.3.3 @storybook/nextjs@10.3.3 tailwindcss @tailwindcss/postcss postcss
```

> **Важливо:** Storybook 10 потрібен для сумісності з Next.js 16. Storybook 8.x підтримує тільки до Next.js 15.

### Запуск

```bash
cd packages/blocks
pnpm storybook
```

Відкрити `http://localhost:6006`. В сайдбарі мають бути всі блоки.

### Конфігураційні файли

| Файл | Призначення |
|------|-------------|
| `packages/blocks/.storybook/main.ts` | Storybook конфіг (framework, stories glob) |
| `packages/blocks/.storybook/preview.ts` | CSS імпорт, viewports |
| `packages/blocks/.storybook/storybook.css` | Tailwind підключення + @source для сканування класів |
| `packages/blocks/postcss.config.mjs` | PostCSS з `@tailwindcss/postcss` |

---

## Крок 11 — Live Preview

Live Preview вже налаштований і працює автоматично. При редагуванні лендингу в адмінці справа від форми з'являється iframe з real-time preview.

### Як користуватись

1. Відкрити `http://localhost:3000/admin`
2. Перейти в **Landing Pages** → обрати лендинг
3. Справа від форми — iframe з preview
4. Зверху iframe — перемикачі **Responsive** з розмірами:
   - Mobile (390x844)
   - Tablet (768x1024)
   - Desktop (1440x900)
5. Змінити будь-яке поле блоку — preview оновлюється в реальному часі без збереження

### Як це працює технічно

- Payload CMS надсилає дані форми через `window.postMessage` в iframe
- iframe завантажує preview route: `/preview/[tenant]/[slug]`
- Client component `LivePreviewPage` використовує `useLivePreview()` hook від `@payloadcms/live-preview-react`
- Hook отримує дані з postMessage і передає в `BlockRenderer`

### Конфігурація

`payload.config.ts` → `admin.livePreview`:
- `url` — формує URL preview сторінки на основі tenant і slug
- `collections: ['landing-pages']` — для яких колекцій показувати preview
- `breakpoints` — розміри для перемикача Responsive

---

## Крок 12 — Налаштувати multi-tenant доступ

Маркетолог може керувати **кількома субдоменами одночасно**. Поле `tenants` в Users — це масив (hasMany relationship).

### Як призначити кілька tenant'ів маркетологу

1. Залогінитись як **Super Admin**
2. Перейти в **Users** → обрати маркетолога
3. В полі **Tenants** — можна обрати кілька субдоменів
4. Натиснути **Save**

Після цього маркетолог бачить лендинги **всіх** обраних tenant'ів.

### Як створити нового маркетолога з кількома tenant'ами

1. **Tenants** → переконатись що потрібні tenant'и створені
2. **Users** → **Create New**
3. Заповнити:
   - **Email:** marketer@company.com
   - **Password:** надійний пароль
   - **Role:** Маркетолог
   - **Tenants:** обрати один або кілька субдоменів
4. **Save**

### Як працює access control

- **Super Admin** (`role: admin`) — бачить **все**: всі tenant'и, всі лендинги, всіх юзерів
- **Маркетолог** (`role: marketer`) — бачить **тільки** лендинги тих tenant'ів які йому призначені
- При створенні нового лендингу маркетологом — tenant автоматично ставиться з його першого tenant'у
- Маркетолог може змінити tenant лендингу тільки на інший зі свого списку

### Приклад

Якщо маркетологу призначити tenant'и "Promo" і "Product":
- Він бачить лендинги обох субдоменів
- Може створювати нові лендинги для обох
- Не бачить лендинги інших tenant'ів

---

## Версії пакетів

| Пакет | Версія | Призначення |
|-------|--------|-------------|
| `next` | 16.2.1 | React фреймворк |
| `react` | 19.2.4 | UI бібліотека |
| `payload` | 3.80.0 | CMS ядро |
| `@payloadcms/next` | 3.80.0 | Payload інтеграція з Next.js |
| `@payloadcms/db-postgres` | 3.80.0 | PostgreSQL адаптер |
| `@payloadcms/richtext-lexical` | 3.80.0 | Rich text editor |
| `@payloadcms/live-preview-react` | 3.80.0 | Live Preview hook |
| `tailwindcss` | 4.2.x | CSS фреймворк |
| `storybook` | 10.3.3 | UI компонент explorer |
| `@storybook/nextjs` | 10.3.3 | Storybook framework для Next.js |
| `typescript` | 5.7.3 | Типізація |
| `posthog-js` | 1.364.x | PostHog клієнт (A/B тести) |
| `posthog-node` | 5.28.x | PostHog серверний клієнт |
| `turbo` | 2.5.x | Монорепо build tool |

> **Важливо:** Payload, @payloadcms/next, @payloadcms/db-postgres, @payloadcms/richtext-lexical мають бути **однакової версії** (всі 3.80.0).

---

## Демо акаунти

| Email | Пароль | Роль | Tenants |
|-------|--------|------|---------|
| (ваш email) | (ваш пароль) | Super Admin | всі |
| marketer@promo.com | Demo1234! | Маркетолог | Promo |
| marketer@product.com | Demo1234! | Маркетолог | Product |
