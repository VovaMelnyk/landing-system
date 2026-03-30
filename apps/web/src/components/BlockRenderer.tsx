import {
  HeroBlock,
  FeaturesBlock,
  TextImageBlock,
  CTABlock,
  TestimonialsBlock,
} from '@landing-system/blocks'

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlock,
  features: FeaturesBlock,
  textImage: TextImageBlock,
  cta: CTABlock,
  testimonials: TestimonialsBlock,
}

type Block = {
  id: string
  blockType: string
  [key: string]: any
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block) => {
        const BlockComponent = blockComponents[block.blockType]
        if (!BlockComponent) return null
        return <BlockComponent key={block.id} {...block} />
      })}
    </>
  )
}
