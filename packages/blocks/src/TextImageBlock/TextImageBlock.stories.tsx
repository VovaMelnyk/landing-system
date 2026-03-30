import type { Meta, StoryObj } from '@storybook/react'
import { TextImageBlock } from './TextImageBlock'

const meta: Meta<typeof TextImageBlock> = {
  title: 'Blocks/TextImage',
  component: TextImageBlock,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof TextImageBlock>

export const Default: Story = {
  args: {
    title: 'Як це працює',
    content: [{ children: [{ text: 'Простий у використанні інтерфейс який не вимагає навчання. Почніть за 5 хвилин.' }] }],
    imagePosition: 'right',
    image: { url: 'https://picsum.photos/800/600', alt: 'Feature image' },
    buttons: [{ text: 'Дізнатись більше', url: '#', variant: 'primary', color: 'blue' }],
  },
}

export const ImageLeft: Story = {
  args: {
    ...Default.args,
    imagePosition: 'left',
    eyebrow: 'Крок 2',
    title: 'Налаштуйте під себе',
    buttons: [{ text: 'Спробувати', url: '#', variant: 'secondary', color: 'green' }],
  },
}
