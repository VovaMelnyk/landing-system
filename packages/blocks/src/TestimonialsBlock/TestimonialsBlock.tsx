'use client'

import Image from 'next/image'
import { useABTest, type ABTestData } from '../shared/useABTest'

type TestimonialItem = {
  quote: string
  author: string
  role?: string
  avatar?: { url: string; alt: string }
}

export type TestimonialsBlockProps = {
  title?: string
  items?: TestimonialItem[]
  ab?: ABTestData
}

export function TestimonialsBlock({ title, items = [], ab }: TestimonialsBlockProps) {
  const { isVariantB } = useABTest(ab)
  const displayTitle = isVariantB && ab?.bTitle ? ab.bTitle : title

  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        {displayTitle && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">{displayTitle}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 flex flex-col">
              <blockquote className="text-gray-700 text-lg mb-6 flex-1">&ldquo;{item.quote}&rdquo;</blockquote>
              <div className="flex items-center gap-3">
                {item.avatar && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={item.avatar.url} alt={item.avatar.alt} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{item.author}</p>
                  {item.role && <p className="text-sm text-gray-500">{item.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
