import { Badge } from '@/components/ui/badge'
import { createContext, useContext, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<Theme>('light')

function ThemedCard() {
  const theme = useContext(ThemeContext)
  const isDark = theme === 'dark'
  return (
    <div
      className={[
        'rounded-xl border p-5 transition-colors duration-300',
        isDark
          ? 'border-white/10 bg-gray-900 text-gray-100'
          : 'border-gray-200 bg-white text-gray-900',
      ].join(' ')}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest opacity-50">
        useContext reads
      </p>
      <p className="m-0 text-sm font-medium">
        Current theme:{' '}
        <Badge
          variant={'outline'}
          className={isDark ? 'text-white' : 'text-black'}
        >
          {theme}
        </Badge>
      </p>
    </div>
  )
}

export default function ContextAsProviderNewWay() {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    // React 19: use ThemeContext directly — no .Provider needed
    <ThemeContext value={theme}>
      <div className="space-y-4">
        <ThemedCard />
        <button
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          className="rounded-lg border border-(--line) bg-(--surface) px-4 py-2 text-sm font-semibold text-(--sea-ink) transition hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)"
        >
          Toggle theme (currently: {theme})
        </button>
      </div>
    </ThemeContext>
  )
}
