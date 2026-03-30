import type { Meta, StoryObj } from '@storybook/react'
import { Button, type ButtonProps } from '../shared/Button'

const meta: Meta<ButtonProps> = {
  title: 'Blocks/CTA Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    text: { control: 'text' },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
    },
    color: {
      control: 'radio',
      options: ['blue', 'green', 'red'],
    },
    url: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<ButtonProps>

export const Primary: Story = {
  args: {
    text: 'Натисни мене',
    url: '#',
    variant: 'primary',
    color: 'blue',
  },
}

export const Secondary: Story = {
  args: {
    text: 'Натисни мене',
    url: '#',
    variant: 'secondary',
    color: 'blue',
  },
}
