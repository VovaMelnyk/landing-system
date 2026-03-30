import type { Meta, StoryObj } from '@storybook/react'
import { HeroBlock } from './HeroBlock'

const meta: Meta<typeof HeroBlock> = {
  title: 'Blocks/Hero',
  component: HeroBlock,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Головна секція лендингу. Підтримує 4 layouts і 3 теми.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof HeroBlock>

export const Default: Story = {
  args: {
    title: 'Збільш продажі на 40%',
    subtitle: 'Автоматизуй маркетинг і фокусуйся на тому що важливо',
    layout: 'imageRight',
    theme: 'light',
    buttons: [
      { text: 'Спробувати безкоштовно', url: '#', variant: 'primary' },
      { text: 'Дивитись демо', url: '#', variant: 'secondary' },
    ],
    image: { url: 'https://picsum.photos/800/600', alt: 'Hero image', width: 800, height: 600 },
  },
}

export const Dark: Story = {
  args: { ...Default.args, theme: 'dark' },
}

export const Centered: Story = {
  args: {
    ...Default.args,
    layout: 'centered',
    eyebrow: 'Нова версія 2.0',
    image: undefined,
  },
}

export const WithBackground: Story = {
  args: {
    ...Default.args,
    layout: 'backgroundImage',
    theme: 'dark',
  },
}
