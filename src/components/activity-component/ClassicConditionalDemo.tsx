import { useState } from 'react'
import NoteTab from './NoteTab'

const TABS = ['Inbox', 'Drafts', 'Sent'] as const
type Tab = (typeof TABS)[number]

export default function ClassicConditionalDemo() {
  const [active, setActive] = useState<Tab>('Inbox')

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={[
              'rounded-lg border px-4 py-1.5 text-sm font-semibold transition',
              active === tab
                ? 'border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300'
                : 'border-(--line) bg-(--surface) text-(--sea-ink-soft) hover:border-orange-300',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ❌ Unmount / remount — state is destroyed on every tab switch */}
      {active === 'Inbox' && <NoteTab label="Inbox" />}
      {active === 'Drafts' && <NoteTab label="Drafts" />}
      {active === 'Sent' && <NoteTab label="Sent" />}

      <p className="m-0 rounded-lg border border-orange-200 bg-orange-50/60 px-3 py-2 text-xs text-orange-700 dark:border-orange-800/40 dark:bg-orange-950/20 dark:text-orange-300">
        State is <strong>destroyed</strong> each time you switch away — your
        note and counter reset to zero.
      </p>
    </div>
  )
}
