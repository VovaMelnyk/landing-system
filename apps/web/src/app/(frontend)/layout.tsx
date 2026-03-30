import './styles.css'
import { PostHogProvider } from '@/components/PostHogProvider'

export const metadata = {
  title: 'Landing System',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  )
}
