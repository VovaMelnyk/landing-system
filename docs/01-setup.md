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

---

## Крок 13 — PostHog A/B тестування

### Налаштування

1. Зареєструватись на [posthog.com](https://posthog.com) → створити проєкт
2. Settings → General → скопіювати **Project token** і **Host**
3. Додати в `.env`:
   ```env
   NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_xxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   ```
4. Перезапустити dev

### Як PostHog інтегрований

- **PostHogProvider** (`src/components/PostHogProvider.tsx`) — ініціалізує PostHog на клієнті, підключений в frontend layout
- **posthog-js** — клієнтська бібліотека, автоматично відстежує pageviews і кліки
- При відкритті лендингу PostHog створює `distinct_id` для кожного відвідувача і зберігає в localStorage

### A/B тест на рівні блоку

Кожен блок має секцію **A/B Тест (PostHog)** в адмінці з полями:
- **Feature Flag ключ** — ключ який збігається з PostHog Experiment
- **Варіант B — Заголовок** — альтернативний заголовок
- **Варіант B — Підзаголовок** — альтернативний підзаголовок
- **Варіант B — Тема** — альтернативна тема (light/dark/colored)
- **Варіант B — Текст кнопки** — альтернативний текст

Для запуску A/B тесту:

1. **PostHog Dashboard** → Experiments → New experiment
2. Вказати **Feature flag key** (наприклад `hero-cta-test`)
3. Variants: `control` і `test` (50/50)
4. **Launch** experiment
5. **В адмінці** → Landing Pages → відкрити лендинг → в потрібному блоці заповнити секцію A/B Тест:
   - Feature Flag ключ: `hero-cta-test`
   - Варіант B поля: заповнити альтернативний контент
6. **Publish changes**

Після цього ~50% відвідувачів бачитимуть Варіант A (оригінал), ~50% — Варіант B.

### A/B тест на рівні сторінки

Для тестування двох різних лендингів:

1. Створити два лендинги з різним контентом (наприклад `launch` і `launch-v2`)
2. В основному лендингу → сайдбар → **Page A/B тест**:
   - Experiment Key: ключ з PostHog
   - Variant B Slug: `launch-v2`
3. PostHog розподілить трафік між двома сторінками

### Перевірка в DevTools

PostHog доступний через `window.posthog` в Console:
```javascript
// Подивитись поточний варіант
posthog.getFeatureFlag('hero-cta-test')

// Примусово встановити варіант для тестування
posthog.featureFlags.overrideFeatureFlags({flags: {'hero-cta-test': 'test'}})

// Скинути override
posthog.featureFlags.overrideFeatureFlags({flags: {}})
```

---

## Крок 14 — Міграції бази даних

### Як працює

В `.env` є змінна `DB_PUSH`:
- **`DB_PUSH=true`** — Payload автоматично змінює схему БД при запуску (зручно для розробки)
- **`DB_PUSH=false`** або не вказано — потрібні міграції (безпечно для production)

### Для розробки (DB_PUSH=true)

Зміни в schema (додав поле, новий блок) автоматично застосовуються при `pnpm dev`. Якщо Payload запитує підтвердження schema push — запускай `cd apps/web && pnpm dev` напряму (не через turbo) і введи `y`.

### Тестування міграцій локально

1. В `.env` змінити `DB_PUSH=false`
2. Створити міграцію: `cd apps/web && pnpm migrate:create`
3. Запустити міграції: `cd apps/web && pnpm migrate`
4. Перевірити: `cd apps/web && pnpm migrate:status`
5. Запустити dev: `cd apps/web && pnpm dev`

### Для production

На Vercel `DB_PUSH` не вказано → `false` → Payload використовує міграції. При `next build` Payload автоматично запускає файли міграцій з папки `migrations/`.

### Скрипти

| Команда | Що робить |
|---------|-----------|
| `pnpm migrate` | Запустити всі pending міграції |
| `pnpm migrate:create` | Створити нову міграцію з поточних змін |
| `pnpm migrate:status` | Показати статус міграцій |
| `pnpm migrate:fresh` | Видалити все і створити з нуля (НЕБЕЗПЕЧНО!) |

### Правила для production

1. **Ніколи** не ставити `DB_PUSH=true` на production
2. Перед деплоєм з новою schema — створити міграцію і закомітити її
3. Тестувати міграції локально з `DB_PUSH=false` перед деплоєм
4. Тримати назви полів короткими — PostgreSQL має ліміт 63 символи на назву таблиці/enum

---

## Крок 15 — Деплой на Vercel з кастомним доменом

### Підготовка

1. Ініціалізувати git і запушити на GitHub
2. Перед push — перевірити build локально: `cd apps/web && pnpm build`

### Vercel

1. [vercel.com/new](https://vercel.com/new) → Import `landing-system`
2. **Root Directory:** `apps/web`
3. **Environment Variables:**
   - `DATABASE_URL` — Supabase connection string
   - `PAYLOAD_SECRET` — випадковий рядок (інший ніж dev!)
   - `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` — PostHog token
   - `NEXT_PUBLIC_POSTHOG_HOST` — `https://eu.i.posthog.com`
   - `DB_PUSH` — `false`
4. **Deploy**

> **Не додавати** `NEXT_PUBLIC_SERVER_URL` — без нього адмінка працює коректно, а preview використовує відносні URL.

### Кастомний домен з wildcard (для субдоменів)

Для субдоменів потрібен wildcard DNS `*.yourdomain.com`. Vercel вимагає щоб nameservers домену вказували на Vercel DNS.

1. У реєстратора домену змінити **nameservers** на:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
2. В Vercel Dashboard → Domains → додати:
   - `yourdomain.com`
   - `www.yourdomain.com`
   - `*.yourdomain.com`
3. Зачекати 5-30 хвилин на DNS пропагацію
4. Всі три домени мають стати "Valid Configuration"

> **Cloudflare:** Якщо DNS на Cloudflare — wildcard SSL не працюватиме разом з Vercel. Потрібно або перенести DNS на Vercel, або додавати кожен субдомен вручну.

### Після деплою

- `https://yourdomain.com/admin` — адмінка
- `https://promo.yourdomain.com/spring-sale` — лендинг
- `https://product.yourdomain.com/launch` — лендинг

### Seed на production

Якщо нова БД (не та що на dev):
```javascript
// В DevTools Console на сторінці адмінки:
fetch('/api/seed', { method: 'POST' }).then(r => r.json()).then(console.log)
```

### Rollback

Vercel Dashboard → Deployments → попередній деплой → три крапки → **Promote to Production** (2-5 секунд).
