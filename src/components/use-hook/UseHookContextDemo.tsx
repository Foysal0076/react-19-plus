import { createContext, use, useState } from 'react'

// A local context just for this demo — isolated from the global site theme
type PanelTheme = 'light' | 'dark' | 'teal'

const PanelThemeContext = createContext<PanelTheme>('light')

const PANELS = [
  {
    id: 1,
    icon: '✅',
    label: 'Deployment',
    message: 'Build succeeded · 2 min ago',
  },
  {
    id: 2,
    icon: '⚠️',
    label: 'Storage',
    message: 'Disk usage at 84% capacity',
  },
  {
    id: 3,
    icon: '📣',
    label: 'Changelog',
    message: 'v2.0 is live — see release notes',
  },
] as const

const themeClasses: Record<PanelTheme, string> = {
  light: 'border-gray-200 bg-white text-gray-900',
  dark: 'border-white/10 bg-gray-900 text-gray-100',
  teal: 'border-teal-200 bg-teal-50 text-teal-900',
}

type PanelProps = {
  icon: string
  label: string
  message: string
  show: boolean
}

function NotificationPanel({ icon, label, message, show }: PanelProps) {
  // ✅ use() called AFTER a conditional return — impossible with useContext
  if (!show) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-(--line) px-4 py-3 opacity-40">
        <span className="text-xs text-(--sea-ink-soft)">
          {label} — hidden (context not read)
        </span>
      </div>
    )
  }

  const theme = use(PanelThemeContext) // Only executes when the panel is visible

  return (
    <div
      className={[
        'rounded-xl border px-4 py-3 transition-colors duration-300',
        themeClasses[theme],
      ].join(' ')}
    >
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm font-semibold">{label}</span>
        <span className="ml-auto rounded-md bg-black/5 px-2 py-0.5 text-xs font-mono opacity-60">
          theme: {theme}
        </span>
      </div>
      <p className="m-0 mt-1 text-xs opacity-70">{message}</p>
    </div>
  )
}

const THEMES: PanelTheme[] = ['light', 'dark', 'teal']

export default function UseHookContextDemo() {
  const [theme, setTheme] = useState<PanelTheme>('light')
  const [shown, setShown] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
  })

  return (
    <PanelThemeContext value={theme}>
      <div className="space-y-4">
        {/* Theme picker */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-(--sea-ink)">
            Panel theme:
          </span>
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={[
                'rounded-lg border px-3 py-1 text-xs font-semibold capitalize transition',
                theme === t
                  ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.18)] text-(--lagoon-deep)'
                  : 'border-(--line) bg-(--surface) text-(--sea-ink) hover:border-(--lagoon-deep)',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Visibility toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-(--sea-ink)">
            Show panels:
          </span>
          {PANELS.map((p) => (
            <button
              key={p.id}
              onClick={() => setShown((s) => ({ ...s, [p.id]: !s[p.id] }))}
              className={[
                'rounded-lg border px-3 py-1 text-xs font-semibold transition',
                shown[p.id]
                  ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.18)] text-(--lagoon-deep)'
                  : 'border-(--line) bg-(--surface) text-(--sea-ink-soft) hover:border-(--lagoon-deep)',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="space-y-2">
          {PANELS.map((p) => (
            <NotificationPanel
              key={p.id}
              icon={p.icon}
              label={p.label}
              message={p.message}
              show={shown[p.id]}
            />
          ))}
        </div>

        <p className="m-0 text-xs text-(--sea-ink-soft)">
          Hidden panels return early before <code>use(PanelThemeContext)</code>{' '}
          is ever called. Visible panels call it inside the conditional branch.
          React handles both correctly — no hook-order violations.
        </p>
      </div>
    </PanelThemeContext>
  )
}
