'use client'

import Image from 'next/image'
import { Button, type ButtonProps } from '../shared/Button'
import { useABTest, type ABTestData } from '../shared/useABTest'

type MediaImage = { url: string; alt: string; width?: number; height?: number }

export type HeroBlockProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  buttons?: ButtonProps[]
  image?: MediaImage
  layout?: 'imageRight' | 'imageLeft' | 'centered' | 'backgroundImage'
  theme?: 'light' | 'dark' | 'colored'
  ab?: ABTestData
}

const themeClasses: Record<string, string> = {
  light: 'bg-white text-gray-900',
  dark: 'bg-gray-900 text-white',
  colored: 'bg-gradient-to-br from-blue-600 to-purple-700 text-white',
}

export function HeroBlock({
  eyebrow, title, subtitle, buttons = [], image,
  layout = 'imageRight', theme = 'light', ab,
}: HeroBlockProps) {
  const { isVariantB } = useABTest(ab)

  const displayTitle = isVariantB && ab?.bTitle ? ab.bTitle : title
  const displaySubtitle = isVariantB && ab?.bSubtitle ? ab.bSubtitle : subtitle
  const displayTheme = isVariantB && ab?.bTheme ? ab.bTheme : theme
  const displayButtons = isVariantB && ab?.bBtnText && buttons.length > 0
    ? buttons.map(btn => ({ ...btn, text: ab.bBtnText! })) : buttons

  const isCentered = layout === 'centered'
  const isBg = layout === 'backgroundImage'

  return (
    <section className={['relative py-20 px-6 md:px-12 overflow-hidden', themeClasses[displayTheme] || themeClasses.light].join(' ')}>
      {isBg && image && <Image src={image.url} alt={image.alt} fill className="object-cover opacity-30" />}
      <div className={['relative z-10 max-w-6xl mx-auto', isCentered || isBg ? 'text-center' : 'grid grid-cols-1 md:grid-cols-2 gap-12 items-center', layout === 'imageLeft' ? 'direction-rtl' : ''].join(' ')}>
        <div className={isCentered || isBg ? 'max-w-3xl mx-auto' : ''}>
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-70">{eyebrow}</p>}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">{displayTitle}</h1>
          {displaySubtitle && <p className={['text-lg md:text-xl opacity-80 mb-8 max-w-2xl', isCentered || isBg ? 'mx-auto' : ''].join(' ')}>{displaySubtitle}</p>}
          {displayButtons.length > 0 && (
            <div className={['flex flex-wrap gap-4', isCentered || isBg ? 'justify-center' : ''].join(' ')}>
              {displayButtons.map((btn, i) => <Button key={i} {...btn} />)}
            </div>
          )}
        </div>
        {image && !isCentered && !isBg && (
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image src={image.url} alt={image.alt} fill className="object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
