import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  const payload = await getPayload({ config })

  // --- Tenant 1: promo.site.com ---
  const promoTenant = await payload.create({
    collection: 'tenants',
    data: { name: 'Promo', subdomain: 'promo', domain: 'promo.site.com' },
  })

  await payload.create({
    collection: 'users',
    data: {
      email: 'marketer@promo.com',
      password: 'Demo1234!',
      role: 'marketer',
      tenant: promoTenant.id,
    },
  })

  await payload.create({
    collection: 'landing-pages',
    data: {
      title: 'Весняний розпродаж',
      slug: 'spring-sale',
      tenant: promoTenant.id,
      seo: {
        title: 'Весняний розпродаж -40% | Promo',
        description: 'Тільки до кінця квітня — знижки на весь асортимент',
      },
      blocks: [
        {
          blockType: 'hero',
          title: 'Весняний розпродаж -40%',
          subtitle: 'Тільки до кінця квітня. Безкоштовна доставка від 500 грн.',
          layout: 'centered',
          theme: 'colored',
          buttons: [{ text: 'Купити зараз', url: '#buy', variant: 'primary' }],
        },
        {
          blockType: 'features',
          title: 'Чому обирають нас',
          columns: '3',
          items: [
            { icon: '🚀', title: 'Швидка доставка', description: 'Доставляємо за 24 години по всій Україні' },
            { icon: '💎', title: 'Висока якість', description: 'Всі товари проходять сертифікацію' },
            { icon: '🔒', title: 'Безпечна оплата', description: 'SSL шифрування і захист покупця' },
          ],
        },
        {
          blockType: 'cta',
          title: 'Готовий почати?',
          subtitle: 'Реєструйся і отримай знижку 10% на перше замовлення',
          theme: 'dark',
          buttons: [{ text: 'Зареєструватись', url: '#register', variant: 'primary' }],
        },
      ],
      _status: 'published',
    },
  })
  console.log('Created: promo.site.com/spring-sale')

  // --- Tenant 2: product.site.com ---
  const productTenant = await payload.create({
    collection: 'tenants',
    data: { name: 'Product', subdomain: 'product', domain: 'product.site.com' },
  })

  await payload.create({
    collection: 'users',
    data: {
      email: 'marketer@product.com',
      password: 'Demo1234!',
      role: 'marketer',
      tenant: productTenant.id,
    },
  })

  await payload.create({
    collection: 'landing-pages',
    data: {
      title: 'Product Launch',
      slug: 'launch',
      tenant: productTenant.id,
      posthogPageExperiment: {
        experimentKey: 'product-launch-page-test',
        variantBSlug: 'launch-v2',
      },
      seo: {
        title: 'Новий продукт — Launch 2024 | Product',
        description: 'Дізнайся першим про наш новий продукт',
      },
      blocks: [
        {
          blockType: 'hero',
          title: 'Зустрічай новий продукт',
          subtitle: 'Він змінить те як ти працюєш щодня',
          layout: 'imageRight',
          theme: 'light',
          buttons: [
            { text: 'Дізнатись більше', url: '#features', variant: 'primary' },
            { text: 'Дивитись демо', url: '#demo', variant: 'secondary' },
          ],
        },
        {
          blockType: 'testimonials',
          title: 'Що кажуть перші користувачі',
          items: [
            { quote: 'Це змінило мій workflow повністю', author: 'Олена К.', role: 'Product Manager' },
            { quote: 'Рекомендую кожній команді', author: 'Максим Т.', role: 'CEO, TechStartup' },
          ],
        },
        {
          blockType: 'cta',
          title: 'Хочеш спробувати першим?',
          subtitle: 'Залиш email і отримай ранній доступ',
          theme: 'colored',
          buttons: [{ text: 'Отримати доступ', url: '#early-access', variant: 'primary' }],
        },
      ],
      _status: 'published',
    },
  })
  console.log('Created: product.site.com/launch')

  console.log('\nSeed complete!')
  console.log('\n-- Logins --')
  console.log('promo:   marketer@promo.com   / Demo1234!')
  console.log('product: marketer@product.com / Demo1234!')
  console.log('\n-- Landing pages --')
  console.log('  http://promo.localhost:3000/spring-sale')
  console.log('  http://product.localhost:3000/launch')

  process.exit(0)
}

seed()
