import type { Meta, StoryObj } from '@storybook/react'
import { TestimonialsBlock } from './TestimonialsBlock'

const meta: Meta<typeof TestimonialsBlock> = {
  title: 'Blocks/Testimonials',
  component: TestimonialsBlock,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof TestimonialsBlock>

export const Default: Story = {
  args: {
    title: 'Що кажуть наші клієнти',
    items: [
      { quote: 'Це змінило мій workflow повністю', author: 'Олена К.', role: 'Product Manager' },
      { quote: 'Рекомендую кожній команді', author: 'Максим Т.', role: 'CEO, TechStartup' },
      { quote: 'Найкращий інструмент на ринку', author: 'Анна С.', role: 'Marketing Lead' },
    ],
  },
}

export const TwoItems: Story = {
  args: {
    title: 'Відгуки',
    items: [
      { quote: 'Просто і зручно', author: 'Іван П.', role: 'Developer' },
      { quote: 'Економить купу часу', author: 'Марія Д.', role: 'Designer' },
    ],
  },
}
