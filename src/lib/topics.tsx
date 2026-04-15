import type { ReactNode } from 'react'

export type Topic = {
  href: string
  label: string // plain‑text label (used in prev/next nav)
  pill: ReactNode // rich JSX (used in home‑page pills)
  description: string
}

export const TOPICS: Topic[] = [
  {
    href: '/react-compiler',
    label: 'React Compiler',
    pill: 'React Compiler',
    description:
      'Auto‑optimizes components, eliminating manual useMemo and useCallback calls.',
  },
  {
    href: '/death-of-forward-ref',
    label: 'Death of forwardRef',
    pill: (
      <>
        The death of <code>forwardRef</code>
      </>
    ),
    description:
      'Pass refs as plain props — no more forwardRef wrapper function.',
  },
  {
    href: '/context-as-provider',
    label: 'Context as a Provider',
    pill: 'Context as a Provider',
    description:
      'Render <Context> directly as a provider, dropping the .Provider wrapper.',
  },
  {
    href: '/use-hook',
    label: 'use() Hook',
    pill: <code>use()</code>,
    description:
      'Read promises and Context directly in render, replacing complex async patterns.',
  },
  {
    href: '/activity-component',
    label: 'Activity Component',
    pill: <code>{'<Activity />'}</code>,
    description:
      'Hide and restore UI without destroying state — background pre‑rendering included.',
  },
  {
    href: '/use-transition-hook',
    label: 'useTransition',
    pill: <code>useTransition</code>,
    description:
      'Mark state updates as non‑blocking transitions, keeping the UI responsive during heavy renders.',
  },
  {
    href: '/use-effect-hook',
    label: 'The way of useEffect',
    pill: (
      <>
        The way of <code>useEffect</code>
      </>
    ),
    description:
      'Separate reactive from non‑reactive Effect logic with useEffectEvent.',
  },
  {
    href: '/miscellaneous',
    label: 'Miscellaneous',
    pill: 'Miscellaneous',
    description:
      'Render <title>, <meta>, and <link> directly in JSX — React hoists them to <head> automatically.',
  },
]
