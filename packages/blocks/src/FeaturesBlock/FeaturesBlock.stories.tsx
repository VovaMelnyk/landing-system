import type { Meta, StoryObj } from '@storybook/react'
import { FeaturesBlock } from './FeaturesBlock'

const meta: Meta<typeof FeaturesBlock> = {
  title: 'Blocks/Features',
  component: FeaturesBlock,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof FeaturesBlock>

export const Default: Story = {
  args: {
    title: 'Чому обирають нас',
    subtitle: 'Все що потрібно для успішного бізнесу',
    columns: '3',
    items: [
      { icon: '🚀', title: 'Швидка доставка', description: 'Доставляємо за 24 години по всій Україні' },
      { icon: '💎', title: 'Висока якість', description: 'Всі товари проходять сертифікацію' },
      { icon: '🔒', title: 'Безпечна оплата', description: 'SSL шифрування і захист покупця' },
    ],
  },
}

export const FourColumns: Story = {
  args: {
    ...Default.args,
    columns: '4',
    items: [
      ...Default.args!.items!,
      { icon: '📞', title: 'Підтримка 24/7', description: 'Завжди на звязку' },
    ],
  },
}
