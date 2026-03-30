'use client'

import Image from 'next/image'
import { Button, type ButtonProps } from '../shared/Button'
import { useABTest, type ABTestData } from '../shared/useABTest'

type MediaImage = { url: string; alt: string; width?: number; height?: number }

export type TextImageBlockProps = {
  eyebrow?: string
  title: string
  content?: any
  imagePosition?: 'right' | 'left'
  image?: MediaImage
  buttons?: ButtonProps[]
  ab?: ABTestData
}

export function TextImageBlock({
  eyebrow, title, content, imagePosition = 'right', image, buttons = [], ab,
}: TextImageBlockProps) {
  const { isVariantB } = useABTest(ab)

  const displayTitle = isVariantB && ab?.bTitle ? ab.bTitle : title
  const displayButtons = isVariantB && ab?.bBtnText && buttons.length > 0
    ? buttons.map(btn => ({ ...btn, text: ab.bBtnText! })) : buttons

  return (
    <section className="py-20 px-6 md:px-12">
      <div className={['max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center', imagePosition === 'left' ? 'md:[direction:rtl]' : ''].join(' ')}>
        <div className={imagePosition === 'left' ? 'md:[direction:ltr]' : ''}>
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">{eyebrow}</p>}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{displayTitle}</h2>
          {content && (
            <div className="prose prose-lg text-gray-600 mb-6">
              {(() => {
                const nodes = content?.root?.children || (Array.isArray(content) ? content : [])
                return nodes.map((node: any, i: number) => {
                  const text = node.children?.map((child: any) => child.text || '').join('') || ''
                  if (!text) return null
                  return <p key={i}>{text}</p>
                })
              })()}
            </div>
          )}
          {displayButtons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {displayButtons.map((btn, i) => <Button key={i} {...btn} />)}
            </div>
          )}
        </div>
        {image && (
          <div className={['relative h-80 md:h-96 rounded-2xl overflow-hidden', imagePosition === 'left' ? 'md:[direction:ltr]' : ''].join(' ')}>
            <Image src={image.url} alt={image.alt} fill className="object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
