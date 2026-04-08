import { Activity, useState } from 'react'
import NoteTab from './NoteTab'

const TABS = ['Inbox', 'Drafts', 'Sent'] as const
type Tab = (typeof TABS)[number]

export default function ActivityStateDemo() {
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
                ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.18)] text-(--lagoon-deep)'
                : 'border-(--line) bg-(--surface) text-(--sea-ink-soft) hover:border-(--lagoon-deep)',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ✅ Activity — hides with display:none, state is saved */}
      <Activity mode={active === 'Inbox' ? 'visible' : 'hidden'}>
        <NoteTab label="Inbox" />
      </Activity>
      <Activity mode={active === 'Drafts' ? 'visible' : 'hidden'}>
        <NoteTab label="Drafts" />
      </Activity>
      <Activity mode={active === 'Sent' ? 'visible' : 'hidden'}>
        <NoteTab label="Sent" />
      </Activity>

      <p className="m-0 rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2 text-xs text-teal-700 dark:border-teal-800/40 dark:bg-teal-950/20 dark:text-teal-300">
        State is <strong>preserved</strong> across tab switches — your note and
        counter survive.
      </p>
    </div>
  )
}
