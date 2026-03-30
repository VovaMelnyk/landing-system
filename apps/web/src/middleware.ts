import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || ''
  const tenant = hostname.split('.')[0]

  // Пропускаємо системні шляхи
  if (['www', 'api', 'storybook'].includes(tenant)) return NextResponse.next()

  // Пропускаємо API, адмінку і статику
  if (req.nextUrl.pathname.startsWith('/api')) return NextResponse.next()
  if (req.nextUrl.pathname.startsWith('/_next')) return NextResponse.next()
  if (req.nextUrl.pathname.startsWith('/admin')) return NextResponse.next()
  if (req.nextUrl.pathname.startsWith('/preview')) return NextResponse.next()

  // Rewrite: promo.site.com/spring-sale → /promo/spring-sale
  return NextResponse.rewrite(
    new URL(`/${tenant}${req.nextUrl.pathname}`, req.url)
  )
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
