import { memo, useState } from 'react'

// ── data ──────────────────────────────────────────────────────────────────────

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

// ── artificially slow item ──────────────────────────────────────────────────

const SlowItem = memo(function SlowItem({ name }: { name: string }) {
  const start = performance.now()
  while (performance.now() - start < 1) {
    // burn ~1 ms per item → 250 items = ~250 ms of blocking per render
  }
  return (
    <li className="border-b border-(--line) px-3 py-1.5 text-xs text-(--sea-ink) last:border-0">
      {name}
    </li>
  )
})

// ── demo ─────────────────────────────────────────────────────────────────────

export default function BlockingSearchDemo() {
  const [query, setQuery] = useState('')

  // Derived directly from query — re-renders ALL SlowItems on every keystroke
  const filtered = query
    ? ITEMS.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      )
    : ITEMS

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to filter 250 slow items…"
        className="w-full rounded-lg border border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--sea-ink) outline-none focus:border-(--lagoon) focus:ring-1 focus:ring-(--lagoon)"
      />
      <p className="text-xs text-(--sea-ink-soft)">
        {filtered.length} of {ITEMS.length} items — try typing fast
      </p>
      <ul className="max-h-44 overflow-y-auto rounded-lg border border-(--line)">
        {filtered.map((item) => (
          <SlowItem key={item.id} name={item.name} />
        ))}
      </ul>
    </div>
  )
}
