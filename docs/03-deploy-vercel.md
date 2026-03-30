# Деплой на Vercel — покрокова інструкція

## Передумови

- Проєкт працює локально (адмінка, лендинги, Storybook)
- Акаунт на [vercel.com](https://vercel.com)
- Репозиторій на GitHub/GitLab/Bitbucket
- Supabase проєкт для production (бажано окремий від dev)

---

## Крок 1 — Підготувати репозиторій

### Ініціалізувати git (якщо ще не зроблено)

```bash
cd landing-system
git init
git add .
git commit -m "Initial commit"
```

### Створити репозиторій на GitHub

1. GitHub → **New repository**
2. Назва: `landing-system`
3. Private (рекомендовано)
4. Не додавати README, .gitignore (вже є)

### Запушити

```bash
git remote add origin https://github.com/YOUR_USERNAME/landing-system.git
git branch -M main
git push -u origin main
```

---

## Крок 2 — Створити production Supabase проєкт

> **Рекомендовано** використовувати окремий Supabase проєкт для production щоб dev і prod дані не перемішувались.

1. Supabase Dashboard → **New Project**
2. Name: `landing-system-prod`
3. Region: той самий що і dev (для мінімальної latency з Vercel)
4. Запам'ятати пароль
5. **Connect** → **Session pooler** → **URI** → скопіювати connection string

---

## Крок 3 — Підключити проєкт до Vercel

1. Зайти на [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → обрати `landing-system`
3. Vercel автоматично визначить що це монорепо

### Налаштування проєкту

| Поле | Значення |
|------|----------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` |
| **Build Command** | `pnpm build` (або залишити default) |
| **Output Directory** | `.next` (default) |
| **Install Command** | `pnpm install` (default) |

### Змінні середовища (Environment Variables)

Додати три змінні:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres.XXXXX:PASSWORD@aws-1-eu-central-1.pooler.supabase.com:5432/postgres` (production Supabase URI) |
| `PAYLOAD_SECRET` | Випадковий рядок 24+ символів (інший ніж dev!) |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-project.vercel.app` (або ваш домен) |

> **Важливо:** `PAYLOAD_SECRET` для production має бути **інший** ніж для dev. Якщо використати той самий — JWT токени від dev будуть працювати на prod.

4. Натиснути **Deploy**

---

## Крок 4 — Перший деплой

Vercel запустить build. Це може зайняти 2-5 хвилин.

### Можливі проблеми при першому деплої

**Schema push потребує підтвердження:**
Payload при першому запуску на production створює таблиці в БД. Якщо build падає з помилкою про schema — потрібно:

1. Запустити проєкт локально з production DATABASE_URL:
   ```bash
   DATABASE_URL=postgresql://...prod... cd apps/web && pnpm dev
   ```
2. Підтвердити schema push (`y`)
3. Зупинити локальний dev
4. Перезапустити деплой на Vercel

**Build error — Module not found:**
Перевірити що `pnpm install` встановлює всі workspace залежності. В `apps/web/package.json` мають бути:
```json
"@landing-system/blocks": "workspace:*",
"@landing-system/ui": "workspace:*"
```

---

## Крок 5 — Налаштувати домен

### Варіант A — Vercel домен (безкоштовно)

Після деплою Vercel надасть URL типу `landing-system-xxx.vercel.app`. Оновити `NEXT_PUBLIC_SERVER_URL`:

1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Змінити `NEXT_PUBLIC_SERVER_URL` на `https://landing-system-xxx.vercel.app`
3. **Redeploy** (Deployments → три крапки → Redeploy)

### Варіант B — Кастомний домен

1. Vercel Dashboard → Project → **Settings** → **Domains**
2. Додати домен: `site.com`
3. Додати wildcard: `*.site.com` (для субдоменів tenant'ів)
4. Vercel покаже DNS записи які потрібно додати у вашого DNS провайдера

DNS записи (приклад):
```
Type    Name    Value
A       @       76.76.21.21
CNAME   *       cname.vercel-dns.com
```

5. Оновити `NEXT_PUBLIC_SERVER_URL` на `https://site.com`
6. Redeploy

### Перевірити субдомени

Після налаштування wildcard домену:
- `https://site.com/admin` — адмінка
- `https://promo.site.com/spring-sale` — лендинг Promo
- `https://product.site.com/launch` — лендинг Product

---

## Крок 6 — Seed production даних

Після першого деплою БД порожня. Потрібно створити tenant'и і маркетологів.

### Варіант A — Через адмінку

1. Відкрити `https://your-domain.com/admin`
2. Створити адмін акаунт
3. Створити Tenant'и (Tenants → Create New)
4. Створити маркетологів (Users → Create New)
5. Створити лендинги (Landing Pages → Create New)

### Варіант B — Через seed endpoint

```bash
curl -X POST https://your-domain.com/api/seed
```

> **Увага:** seed endpoint створює демо акаунти з паролем `Demo1234!`. На production після seed змініть паролі маркетологів через адмінку.

---

## Крок 7 — Налаштувати автоматичний деплой

Vercel автоматично деплоїть при push в main. Додатково можна налаштувати:

### Branch деплої

- `main` → Production
- `staging` → Preview (staging)

В Vercel Dashboard → Settings → Git:
- Production Branch: `main`

### GitHub Actions (опціонально)

CI/CD workflows вже є в `.github/workflows/`:

- `ci.yml` — type-check і build на PR
- `deploy.yml` — деплой на Vercel при push

Для GitHub Actions потрібні секрети:

| Secret | Де взяти |
|--------|----------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Vercel → Settings → General → Vercel ID |
| `VERCEL_PROJECT_ID` | Vercel → Project → Settings → General → Project ID |
| `STAGING_DATABASE_URI` | Supabase staging connection string |
| `STAGING_PAYLOAD_SECRET` | Payload secret для staging |
| `PROD_DATABASE_URI` | Supabase production connection string |
| `PROD_PAYLOAD_SECRET` | Payload secret для production |

---

## Крок 8 — Перевірити production

### Чекліст

- [ ] `https://your-domain.com/admin` — адмінка відкривається
- [ ] Можна створити адмін акаунт
- [ ] Можна створити Tenant
- [ ] Можна створити Landing Page з блоками
- [ ] Лендинг доступний по URL субдомену
- [ ] Live Preview працює в адмінці
- [ ] Зміна контенту → Publish → лендинг оновлюється

### Rollback

Якщо щось пішло не так:
1. Vercel Dashboard → **Deployments**
2. Знайти попередній робочий деплой
3. Натиснути три крапки → **Promote to Production**
4. Rollback відбувається за 2-5 секунд

---

## Змінні середовища — підсумок

### Development (apps/web/.env)

```env
DATABASE_URL=postgresql://...dev-supabase...
PAYLOAD_SECRET=dev-secret-24-chars
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### Production (Vercel Environment Variables)

```env
DATABASE_URL=postgresql://...prod-supabase...
PAYLOAD_SECRET=prod-secret-24-chars-DIFFERENT-from-dev
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
```

### Staging (опціонально, Vercel Preview)

```env
DATABASE_URL=postgresql://...staging-supabase...
PAYLOAD_SECRET=staging-secret-24-chars
NEXT_PUBLIC_SERVER_URL=https://staging.your-domain.com
```

> **Золоте правило:** кожне середовище використовує **окремий** Supabase проєкт і **окремий** PAYLOAD_SECRET.

---

## Архітектура на production

```
[Browser] → [Vercel CDN] → [Next.js + Payload CMS]
                                    ↓
                            [Supabase PostgreSQL]
```

- **Один сервіс** на Vercel (Next.js + Payload разом)
- **Один домен** — адмінка на `/admin`, лендинги на субдоменах
- **Revalidation** — при Publish в адмінці `revalidateTag()` викликається напряму (без HTTP webhook)
- **ISR** — сторінки кешуються і оновлюються on-demand
