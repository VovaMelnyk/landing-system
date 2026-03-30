export type ButtonProps = {
  text: string
  url: string
  variant?: 'primary' | 'secondary'
  color?: 'blue' | 'green' | 'red'
}

const primaryColors = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700',
  green: 'bg-green-600 text-white hover:bg-green-700',
  red: 'bg-red-600 text-white hover:bg-red-700',
}

const secondaryColors = {
  blue: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  green: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  red: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
}

export function Button({ text, url, variant = 'primary', color = 'blue' }: ButtonProps) {
  const colorClass = variant === 'primary'
    ? primaryColors[color]
    : secondaryColors[color]

  return (
    <a
      href={url}
      className={`px-8 py-3 rounded-lg font-semibold transition-all ${colorClass}`}
    >
      {text}
    </a>
  )
}
