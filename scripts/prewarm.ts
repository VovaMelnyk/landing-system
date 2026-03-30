async function prewarm() {
  const siteUrl = process.env.SITE_URL!
  const payloadUrl = process.env.PAYLOAD_URL!

  console.log(`Prewarming ${siteUrl}...`)

  const response = await fetch(
    `${payloadUrl}/api/landing-pages?where[_status][equals]=published&limit=200&depth=1`
  )
  const data = await response.json()

  const pages = data.docs as Array<{
    slug: string
    tenant: { subdomain: string }
  }>

  console.log(`Found ${pages.length} pages to prewarm`)

  const chunks = chunk(pages, 5)

  for (const chunkPages of chunks) {
    await Promise.all(
      chunkPages.map(async (page) => {
        const subdomain = page.tenant?.subdomain
        if (!subdomain) return

        const baseUrl = siteUrl.replace('https://', `https://${subdomain}.`)
        const url = `${baseUrl}/${page.slug}`

        try {
          await fetch(url, { method: 'GET' })
          console.log(`  ${url}`)
        } catch {
          console.log(`  Failed: ${url}`)
        }
      })
    )
  }

  console.log('Prewarm complete')
}

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )
}

prewarm()
