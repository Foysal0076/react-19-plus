import { memo, useState, useTransition } from 'react'

// ── data (same as BlockingSearchDemo) ─────────────────────────────────────────

const LABELS = [
  'Apple',
  'Apricot',
  'Avocado',
  'Banana',
  'Blueberry',
  'Cherry',
  'Coconut',
  'Date',
  'Dragonfruit',
  'Elderberry',
  'Fig',
  'Grape',
  'Grapefruit',
  'Guava',
  'Honeydew',
  'Jackfruit',
  'Kiwi',
  'Lemon',
  'Lime',
  'Lychee',
  'Mango',
  'Melon',
  'Nectarine',
  'Orange',
  'Papaya',
  'Peach',
  'Pear',
  'Pineapple',
  'Plum',
  'Raspberry',
]

const ITEMS = Array.from({ length: 250 }, (_, i) => ({
  id: i,
  name: `${LABELS[i % LABELS.length]} product #${Math.floor(i / LABELS.length) + 1}`,
}))

// ── artificially slow item ────────────────────────────────────────────────────

const SlowItem = memo(function SlowItem({ name }: { name: string }) {
  const start = performance.now()
  while (performance.now() - start < 1) {
    // same 1 ms burn — same cost, but now the input is never blocked
  }
  return (
    <li className="border-b border-(--line) px-3 py-1.5 text-xs text-(--sea-ink) last:border-0">
      {name}
    </li>
  )
})

// ── demo ─────────────────────────────────────────────────────────────────────

export default function TransitionSearchDemo() {
  const [query, setQuery] = useState('') // ← urgent: drives input
  const [listQuery, setListQuery] = useState('') // ← deferred: drives list
  const [isPending, startTransition] = useTransition()

  const filtered = listQuery
    ? ITEMS.filter((item) =>
        item.name.toLowerCase().includes(listQuery.toLowerCase()),
      )
    : ITEMS

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value) // paint the input immediately
    startTransition(() => {
      setListQuery(value) // defer — interruptible if user types again
    })
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Type to filter 250 slow items…"
        className="w-full rounded-lg border border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--sea-ink) outline-none focus:border-(--lagoon) focus:ring-1 focus:ring-(--lagoon)"
      />
      <p className="flex items-center gap-2 text-xs text-(--sea-ink-soft)">
        {isPending ? (
          <>
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-(--lagoon) border-t-transparent" />
            <span className="font-medium text-(--lagoon-deep)">
              Filtering in background…
            </span>
          </>
        ) : (
          <>
            {filtered.length} of {ITEMS.length} items — input stays smooth
          </>
        )}
      </p>
      <ul
        className={`max-h-44 overflow-y-auto rounded-lg border border-(--line) transition-opacity duration-150 ${isPending ? 'opacity-40' : 'opacity-100'}`}
      >
        {filtered.map((item) => (
          <SlowItem key={item.id} name={item.name} />
        ))}
      </ul>
    </div>
  )
}
