'use client'

import { useABTest, type ABTestData } from '../shared/useABTest'

type FeatureItem = { icon?: string; title: string; description: string }

export type FeaturesBlockProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  columns?: '2' | '3' | '4'
  items?: FeatureItem[]
  ab?: ABTestData
}

const columnClasses = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export function FeaturesBlock({
  eyebrow, title, subtitle, columns = '3', items = [], ab,
}: FeaturesBlockProps) {
  const { isVariantB } = useABTest(ab)

  const displayTitle = isVariantB && ab?.bTitle ? ab.bTitle : title
  const displaySubtitle = isVariantB && ab?.bSubtitle ? ab.bSubtitle : subtitle

  return (
    <section className="py-20 px-6 md:px-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">{eyebrow}</p>}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{displayTitle}</h2>
          {displaySubtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{displaySubtitle}</p>}
        </div>
        <div className={`grid ${columnClasses[columns]} gap-8`}>
          {items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              {item.icon && <div className="text-3xl mb-4">{item.icon}</div>}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
