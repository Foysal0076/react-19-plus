import { useEffect, useEffectEvent, useRef, useState } from 'react'

// ── types ─────────────────────────────────────────────────────────────────────

type LogEntry = {
  id: number
  text: string
  kind: 'connect' | 'disconnect' | 'notify'
}

// ── demo ─────────────────────────────────────────────────────────────────────

export default function ChatRoomDemo() {
  const [roomId, setRoomId] = useState('general')
  const [muted, setMuted] = useState(false)
  const [log, setLog] = useState<LogEntry[]>([])
  const idRef = useRef(0)

  function addLog(text: string, kind: LogEntry['kind']) {
    setLog((prev) => [...prev.slice(-9), { id: ++idRef.current, text, kind }])
  }

  // ✅ onConnected reads latest `muted` WITHOUT being a dep
  //    → muting never causes a reconnect
  const onConnected = useEffectEvent((room: string) => {
    if (!muted) {
      addLog(`Notification: joined #${room}`, 'notify')
    }
  })

  useEffect(() => {
    addLog(`Connecting to #${roomId}…`, 'connect')

    // simulate async connection
    const timer = setTimeout(() => {
      addLog(`Connected to #${roomId}`, 'connect')
      onConnected(roomId)
    }, 600)

    return () => {
      clearTimeout(timer)
      addLog(`Disconnected from #${roomId}`, 'disconnect')
    }
  }, [roomId]) // ← ONLY roomId; muted is non-reactive via onConnected

  const rooms = ['general', 'travel', 'music', 'gaming']

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {rooms.map((r) => (
            <button
              key={r}
              onClick={() => setRoomId(r)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                roomId === r
                  ? 'border-(--lagoon) bg-(--lagoon) text-white'
                  : 'border-(--line) text-(--sea-ink-soft) hover:border-(--lagoon) hover:text-(--lagoon-deep)'
              }`}
            >
              #{r}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-(--sea-ink)">
          <input
            type="checkbox"
            checked={muted}
            onChange={(e) => setMuted(e.target.checked)}
            className="accent-(--lagoon)"
          />
          Mute notifications
        </label>
      </div>

      {/* Explanation badge */}
      <p className="rounded-lg border border-(--line) bg-(--surface) px-3 py-2 text-xs text-(--sea-ink-soft)">
        <strong className="text-(--sea-ink)">Try it:</strong> Switch rooms → you
        will see a reconnect in the log. Toggle mute → no reconnect, but the
        next connection respects the muted state.
      </p>

      {/* Log */}
      <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-(--line) bg-(--surface) p-3 font-mono">
        {log.length === 0 && (
          <p className="text-xs text-(--sea-ink-soft)/60 italic">
            No events yet…
          </p>
        )}
        {log.map((entry) => (
          <p
            key={entry.id}
            className={`text-xs ${
              entry.kind === 'connect'
                ? 'text-teal-600 dark:text-teal-400'
                : entry.kind === 'disconnect'
                  ? 'text-rose-500 dark:text-rose-400'
                  : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {entry.kind === 'connect'
              ? '✅'
              : entry.kind === 'disconnect'
                ? '❌'
                : '🔔'}{' '}
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  )
}
