import { useState } from 'react'

type Props = { label: string }

export default function NoteTab({ label }: Props) {
  const [note, setNote] = useState('')
  const [count, setCount] = useState(0)

  return (
    <div className="space-y-3">
      <p className="m-0 text-xs text-(--sea-ink-soft)">
        Type a note and increment the counter, then switch tabs.
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={`Notes for ${label}…`}
        rows={3}
        className="w-full resize-none rounded-lg border border-(--line) bg-(--surface) px-3 py-2 text-sm text-(--sea-ink) outline-none transition focus:border-(--lagoon-deep) focus:ring-2 focus:ring-[rgba(79,184,178,0.2)]"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="rounded-lg border border-(--line) bg-(--surface) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) transition hover:border-(--lagoon-deep)"
        >
          +1
        </button>
        <code className="text-sm">count = {count}</code>
      </div>
    </div>
  )
}
