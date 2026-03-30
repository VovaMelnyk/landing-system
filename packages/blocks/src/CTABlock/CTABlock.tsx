'use client'

import { Button, type ButtonProps } from '../shared/Button'
import { useABTest, type ABTestData } from '../shared/useABTest'

export type CTABlockProps = {
  title: string
  subtitle?: string
  buttons?: ButtonProps[]
  theme?: 'colored' | 'dark' | 'light'
  ab?: ABTestData
}

const themeClasses: Record<string, string> = {
  colored: 'bg-gradient-to-r from-blue-600 to-purple-700 text-white',
  dark: 'bg-gray-900 text-white',
  light: 'bg-gray-100 text-gray-900',
}

export function CTABlock({
  title, subtitle, buttons = [], theme = 'colored', ab,
}: CTABlockProps) {
  const { isVariantB } = useABTest(ab)

  const displayTitle = isVariantB && ab?.bTitle ? ab.bTitle : title
  const displaySubtitle = isVariantB && ab?.bSubtitle ? ab.bSubtitle : subtitle
  const displayTheme = isVariantB && ab?.bTheme ? ab.bTheme : theme
  const displayButtons = isVariantB && ab?.bBtnText && buttons.length > 0
    ? buttons.map(btn => ({ ...btn, text: ab.bBtnText! })) : buttons

  return (
    <section className={`py-20 px-6 md:px-12 ${themeClasses[displayTheme] || themeClasses.colored}`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{displayTitle}</h2>
        {displaySubtitle && <p className="text-lg opacity-80 mb-8">{displaySubtitle}</p>}
        {displayButtons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {displayButtons.map((btn, i) => <Button key={i} {...btn} />)}
          </div>
        )}
      </div>
    </section>
  )
}
